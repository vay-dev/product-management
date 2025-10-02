from django.contrib.auth import get_user_model
from rest_framework import generics
from .serializers import UserSerializer

# Create your views here.
User = get_user_model()


class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = []
