from django.contrib.auth import get_user_model
from rest_framwork import generics
from .serializers import UserSerializer

# Create your views here.
User = get_user_model()


class RegisterUserView(generics.CreateAPIview):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = []
