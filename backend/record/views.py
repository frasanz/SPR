from django.shortcuts import render
from django.utils.timezone import now
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from .models import Phrase
from .serializers import PhraseSerializer, AudioUploadSerializer
from django.http import HttpResponse, HttpResponseForbidden, Http404
from django.shortcuts import get_object_or_404
from django.conf import settings
import os
from .models import Phrase

# Create your views here.
class PhraseListView(ListAPIView):
    """
    API para obtener todas las frases.
    """
    queryset = Phrase.objects.all()  # Todas las frases del modelo
    serializer_class = PhraseSerializer  # Serializador asociado
    permission_classes = [IsAuthenticated]  # Permisos de la API

    def get_queryset(self):
        """
        Filtra las frases por usuario.
        """
        user = self.request.user  # Usuario autenticado
        if user.is_superuser:
            return Phrase.objects.all().order_by('created_at')
        return Phrase.objects.filter(User=user).order_by('-created_at')
    

class RandomPhraseView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PhraseSerializer

    @swagger_auto_schema(
        operation_description="Get a random unrecorded phrase.",
        responses={
            200: openapi.Response('Random phrase', PhraseSerializer),
            404: 'There are no pending phrases.'
        }
    )
    def get(self, request):
        """
        Obtiene una frase aleatoria junto con estadísticas.
        """
        user = request.user

        # Fetch all phrases and phrases marked as done
        total_phrases = Phrase.objects.filter(User=user).count()
        done_phrases = Phrase.objects.filter(User=user, done=True).count()

        # Filter not done phrases
        not_done_phrases = Phrase.objects.filter(User=user, done=False)
        if not not_done_phrases.exists():
            return Response({
                'detail': 'No hay frases por hacer.',
                'total_phrases': total_phrases,
                'done_phrases': done_phrases
            }, status=404)

        # Randomly select one not done phrase
        phrase = not_done_phrases.order_by('?').first()
        serializer = PhraseSerializer(phrase)

        # Add statistics to the response
        return Response({
            'phrase': serializer.data,
            'total_phrases': total_phrases,
            'done_phrases': done_phrases
        })
    

class AddPhraseView(APIView):

    permission_classes = [IsAuthenticated]
    serializer_class = PhraseSerializer

    @swagger_auto_schema(
        operation_description="Add a new phrase.",
        request_body=PhraseSerializer,
        responses={
            201: openapi.Response('Phrase added', PhraseSerializer),
            400: 'Bad request.'
        }
    )

    def post(self, request):
        """
        Agrega una nueva frase.
        """
        user = request.user
        data = request.data
        data['User'] = user.id
        serializer = PhraseSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        
        return Response(serializer.errors, status=400)
    
class AddMultiplePhrasesView(APIView):
    
    permission_classes = [IsAuthenticated]
    serializer_class = PhraseSerializer

    @swagger_auto_schema(
        operation_description="Add multiple phrases.",
        request_body=PhraseSerializer(many=True),
        responses={
            201: 'Phrases added.',
            400: 'Bad request.'
        }
    )

    def post(self, request):
        """
        Agrega varias frases.
        """
        user = request.user
        data = request.data
        for phrase in data:
            phrase['User'] = user.id

        serializer = PhraseSerializer(data=data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        
        return Response(serializer.errors, status=400)
    
class DeletePhraseView(APIView):
    """
    API to delete a phrase.
    """
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Delete a phrase by its ID if it belongs to the authenticated user.",
        responses={
            204: "Phrase deleted successfully.",
            404: "Phrase not found.",
            403: "You don't have permission to delete this phrase."
        }
    )
    def delete(self, request, id):
        """
        Deletes a phrase if it belongs to the authenticated user.
        """
        try:
            phrase = Phrase.objects.get(id=id)
        except Phrase.DoesNotExist:
            return Response({'detail': 'Phrase not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Ensure the phrase belongs to the user
        if phrase.User != request.user:
            raise PermissionDenied("You don't have permission to delete this phrase.")

        phrase.delete()
        return Response({'detail': 'Phrase deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)


class PartialUpdatePhraseView(APIView):
    """
    API to update a phrase partially.
    """
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Update a phrase partially by its ID if it belongs to the authenticated user.",
        responses={
            200: "Phrase updated successfully.",
            404: "Phrase not found.",
            403: "You don't have permission to update this phrase."
        }
    )
    def patch(self, request, id):
        """
        Updates a phrase partially if it belongs to the authenticated user.
        """
        try:
            phrase = Phrase.objects.get(id=id)
        except Phrase.DoesNotExist:
            return Response({'detail': 'Phrase not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Ensure the phrase belongs to the user
        if phrase.User != request.user:
            raise PermissionDenied("You don't have permission to update this phrase.")

        serializer = PhraseSerializer(instance=phrase, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    

class UploadAudioView(APIView):
    """
    API to upload audio for a specific phrase.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        """
        Uploads an audio file for the phrase with the given ID if it belongs to the authenticated user.
        """
        try:
            # Fetch the phrase by ID
            phrase = Phrase.objects.get(id=id, User=request.user)
        except Phrase.DoesNotExist:
            return Response({'detail': 'Phrase not found or does not belong to the user.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = AudioUploadSerializer(instance=phrase, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            # Set as done
            phrase.done = True
            phrase.done_at = now()
            phrase.save()
            print(phrase.done_at)   

            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class ServeAudioView(APIView):
    """
    View to serve audio files only to authorized users.
    """
    def get(self, request, pk):
        # Obtén la frase asociada al ID
        phrase = get_object_or_404(Phrase, pk=pk)
        print(phrase)
        # Verifica si el usuario autenticado es el propietario
        if phrase.User != request.user:
            return HttpResponseForbidden("You are not allowed to access this file.")

        # Verifica si el archivo de audio existe
        if not phrase.audio:
            return Http404("Audio file not found.")

        file_path = os.path.join(settings.MEDIA_RECORD, str(phrase.audio))
        print(phrase.audio)
        print(file_path)
        if not os.path.exists(file_path):
            return Http404("Audio file does not exist on the server.")

        # Sirve el archivo
        with open(file_path, 'rb') as audio_file:
            response = HttpResponse(audio_file.read(), content_type="audio/mpeg")
            
            response['Content-Disposition'] = f'inline; filename="{os.path.basename(file_path)}"'
            return response

            

class PhraseStatsView(APIView):

    def get(self, request, *args, **kwargs):
        username = request.user.username
        user_phrases_count = Phrase.objects.filter(User=request.user).count()
        validated_phrases_count = Phrase.objects.filter(User=request.user, is_valid=True).count()
        done_phrases_count = Phrase.objects.filter(User=request.user, done=True).count()

        stats = {
            "username": username,
            "name": request.user.get_full_name(),
            "total_phrases": user_phrases_count,
            "validated_phrases": validated_phrases_count,
            "done_phrases": done_phrases_count,
        }
        return Response(stats)
