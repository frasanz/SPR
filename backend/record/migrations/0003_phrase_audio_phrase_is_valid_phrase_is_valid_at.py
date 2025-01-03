# Generated by Django 4.2.17 on 2024-12-25 07:22

from django.db import migrations, models
import record.models


class Migration(migrations.Migration):

    dependencies = [
        ('record', '0002_rename_recording_speech'),
    ]

    operations = [
        migrations.AddField(
            model_name='phrase',
            name='audio',
            field=models.FileField(blank=True, null=True, upload_to=record.models.user_recording_directory_path),
        ),
        migrations.AddField(
            model_name='phrase',
            name='is_valid',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='phrase',
            name='is_valid_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
