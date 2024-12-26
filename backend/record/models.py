from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now

# Create your models here.
def user_recording_directory_path(instance, filename):
    # It builds a route to upload the records
    # Structure: /recordings/user_<id>/<filename>
    return f"media/recordings/user_{instance.User.id}/{instance.id}.wav"


class Phrase(models.Model):
    User = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    done = models.BooleanField(default=False)
    done_at = models.DateTimeField(null=True, blank=True)
    audio = models.FileField(upload_to=user_recording_directory_path, null=True, blank=True)
    is_valid = models.BooleanField(default=False)
    is_valid_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.text[:50]
    
class Speech(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    phrase = models.ForeignKey(Phrase, on_delete=models.CASCADE)
    audio = models.FileField(upload_to=user_recording_directory_path)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_valid = models.BooleanField(default=False)
    is_valid_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.phrase.text[:50]} - {self.user.username}"