from django.shortcuts import render
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Phrase
from .serializers import PhraseSerializer

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
            return Phrase.objects.all()
        return Phrase.objects.filter(User=user)
    

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
            

