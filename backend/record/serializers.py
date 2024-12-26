from rest_framework import serializers
from .models import Phrase

class PhraseSerializer(serializers.ModelSerializer):

    audio_url = serializers.SerializerMethodField()

    class Meta:
        model = Phrase
        fields = ['User', 'id', 'text', 'created_at', 'updated_at', 'done', 'is_valid', 'is_valid_at', 'done', 'audio_url']  # Campos que se incluirán en la API

    def get_audio_url(self, obj):
        """
        Devuelve la URL del archivo de audio.
        """
        
        request = self.context.get('request')
        if obj.audio and request:
            return request.build_absolute_uri(obj.audio.url)    
        return None

class AudioUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Phrase
        fields = ['User', 'id', 'audio', 'updated_at']  # Include only necessary fields
        read_only_fields = ['updated_at']

    def update(self, instance, validated_data):
        """
        Update the audio file and mark `updated_at` as the current time.
        """
        instance.audio = validated_data.get('audio', instance.audio)
        instance.updated_at = validated_data.get('updated_at', instance.updated_at)
        instance.save()
        return instance
