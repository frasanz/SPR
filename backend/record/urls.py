from django.urls import path
from rest_framework import permissions
from .views import PhraseListView, RandomPhraseView, AddPhraseView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView


urlpatterns = [
    path('api/phrases/', PhraseListView.as_view(), name='phrase_list'),  # Ruta de la API
    path('api/random-phrase/', RandomPhraseView.as_view(), name='random_phrase'),
    path('api/add-phrase/', AddPhraseView.as_view(), name='add_phrase'),
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),


]