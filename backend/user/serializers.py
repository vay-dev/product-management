from .models import CustomUser
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "profile_picture", "password"]
        extra_kwargs = {"password": {"write_only:": True}}

        def create(self, validated_data):
            user = User(
                email=validated_data["email"],
                username=validated_data["username"],
                profile_picture=validated_data.get("profile_picture")
            )
            # for hashing password
            user.set_password(validated_data["password"])
            user.save()
            return user
