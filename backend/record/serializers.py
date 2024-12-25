from rest_framework import serializers
from .models import Phrase

class PhraseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Phrase
        fields = ['User', 'id', 'text', 'created_at', 'updated_at', 'done']  # Campos que se incluirán en la API
