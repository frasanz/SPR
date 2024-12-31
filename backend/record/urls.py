from django.urls import path
from rest_framework import permissions
from .views import PhraseListView, RandomPhraseView, AddPhraseView, AddMultiplePhrasesView,  DeletePhraseView, PartialUpdatePhraseView, UploadAudioView, ServeAudioView, PhraseStatsView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView


urlpatterns = [
    path('api/phrases/', PhraseListView.as_view(), name='phrase_list'),  # Ruta de la API
    path('api/random-phrase/', RandomPhraseView.as_view(), name='random_phrase'),
    path('api/add-phrase/', AddPhraseView.as_view(), name='add_phrase'),
    path('api/add-multiple-phrases/', AddMultiplePhrasesView.as_view(), name='add_multiple_phrases'),
    path('api/delete-phrase/<int:id>/', DeletePhraseView.as_view(), name='delete_phrase'),
    path('api/upload-audio/<int:id>/', UploadAudioView.as_view(), name='upload-audio'),
    path('api/partial-update-phrase/<int:id>/', PartialUpdatePhraseView.as_view(), name='update-phrase'),
    path('api/audio/<int:pk>/', ServeAudioView.as_view(), name='serve-audio'),
    path('api/stats/', PhraseStatsView.as_view(), name='stats'),
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),


]