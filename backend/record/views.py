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
            200: openapi.Response('Random prase', PhraseSerializer),
            404: 'There are not pending phrases.'
        }
    )

    def get(self, request):
        """
        Obtiene una frase aleatoria.
        """
        user = request.user

        not_done_phrases = Phrase.objects.filter(User=user, done=False)
        if not not_done_phrases.exists():
            return Response({'detail': 'No hay frases por hacer.'}, status=404)
        
        phrase = not_done_phrases.order_by('?').first()
        serializer = PhraseSerializer(phrase)

        return Response(serializer.data)
    

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

            

