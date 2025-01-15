import jwt
from django.http import JsonResponse
from django.conf import settings
from functools import wraps

def jwt_required(func):
    @wraps(func)
    def wrapper(request, *args, **kwargs):
        token = request.META.get('HTTP_AUTHORIZATION')
        if token is not None:
            token = token.replace('Bearer ', '')
            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                request.user_id = payload['user_id']
                return func(request, *args, **kwargs)
            except jwt.ExpiredSignatureError:
                return JsonResponse({'error': 'Token has expired'}, status=401)
            except jwt.InvalidTokenError:
                return JsonResponse({'error': 'Invalid token'}, status=401)
        else:
            return JsonResponse({'error': 'Authorization header missing'}, status=401)
    return wrapper
