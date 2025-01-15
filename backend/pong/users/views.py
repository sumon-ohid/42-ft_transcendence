import json
from .models import PlayerScore, Profile
from django.contrib import messages
from django.http import JsonResponse
from .forms import UserRegistrationForm
from django.contrib.auth import authenticate, logout, login
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from django.core.files.storage import default_storage
from django.contrib.auth.models import User
from django_otp.plugins.otp_totp.models import TOTPDevice
from django_otp.oath import totp
from django_otp.util import random_hex
import base64
import qrcode
from io import BytesIO
from django.views.decorators.csrf import csrf_protect
from django_otp import devices_for_user
from django.utils.crypto import get_random_string
from django.views.decorators.cache import never_cache
from time import time, sleep
import string
import datetime
from django.conf import settings
import requests
import logging
from django.http import HttpResponse
import os
from django.core.files.base import ContentFile
import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db.models import Q
from .models import ChatMessage
from .auth import jwt_required


@login_required
def home(request):
    return render(request, "home.html", {})

def index(request):
    context = {'data': 'Hello from Django'}
    return render(request, 'index.html', context)

@csrf_exempt
def api_signup(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON data.'}, status=400)

        form = UserRegistrationForm(data)
        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data['password'])
            user.save()
            return JsonResponse({'status': 'success', 'message': 'User registered successfully!'})
        else:
            return JsonResponse({'status': 'error', 'errors': form.errors}, status=400)
    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'}, status=405)


@csrf_exempt
def api_login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')

            if not username or not password:
                return JsonResponse({'status': 'error', 'error': 'Username and password are required.'}, status=400)

            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                # Check if 2FA is enabled for the user
                two_factor_enabled = False
                try:
                    profile = user.profile
                    two_factor_enabled = profile.two_factor_enabled
                except Profile.DoesNotExist:
                    pass

                if not two_factor_enabled:
                    # Generate JWT token
                    payload = {
                        'user_id': user.id,
                        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1),
                        'iat': datetime.datetime.utcnow()
                    }
                    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

                    return JsonResponse({
                        'status': 'success',
                        'message': 'Login successful!',
                        'token': token
                    })
                else:
                    # 2FA is required
                    return JsonResponse({
                        'status': 'success',
                        'message': '2FA verification required',
                        'two_factor_enabled': two_factor_enabled,
                        'two_factor_required': True,
                        'token': token
                    })
            else:
                return JsonResponse({'status': 'error', 'error': 'Invalid username or password.'}, status=401)
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'error': 'Invalid JSON data.'}, status=400)

    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'}, status=405)

@csrf_exempt
def api_logout(request):
    if request.user.is_authenticated:
        logout(request)
        return JsonResponse({'status': 'success', 'message': 'Logged out successfully.'})
    else:
        return redirect("https://localhost:8000/#login")
    #return JsonResponse({'status': 'error', 'message': 'Invalid request method.'}, status=405)

def get_username(request):
    if request.user.is_authenticated:
        return JsonResponse({'username': request.user.username})
    else:
        return JsonResponse({'username': 'Guest'})


# @jwt_required
def save_score(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        player_name = request.user.username if request.user.is_authenticated else data.get('player_name')
        score = data.get('score')

        if score is None or player_name is None:
            return JsonResponse({'status': 'error', 'message': 'Invalid data'}, status=400)

        # Get or create the player's score entry
        player_score, created = PlayerScore.objects.get_or_create(player_name=player_name)

        # Append the new score to the scores list
        player_score.scores.append(score)
        player_score.total_score += score  # Update the total score
        player_score.save()

        return JsonResponse({'status': 'success', 'player_name': player_name, 'total_score': player_score.total_score, 'scores': player_score.scores})

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)


# @csrf_exempt
@jwt_required
def upload_profile_picture(request):
    if request.method == 'POST' and request.FILES.get('profile_picture'):
        profile_picture = request.FILES['profile_picture']
        file_path = default_storage.save(f'profile_pictures/{profile_picture.name}', profile_picture)
        
        # Save the file path to the user's profile
        if request.user.is_authenticated:
            user = request.user
            profile, created = Profile.objects.get_or_create(user=user)
            profile.photo = file_path
            profile.save()
        
        return JsonResponse({'status': 'success', 'file_path': file_path})
    return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=400)

# def get_profile_picture(request):
#     if request.user.is_authenticated:
#         profile = Profile.objects.get(user=request.user)
#         if profile.photo:
#             photo_url = profile.photo.url
#         else:
#             default_avatars = [
#                 '/static/avatars/avatar1.png',
#                 '/static/avatars/avatar2.png',
#                 '/static/avatars/avatar3.png',
#                 '/static/avatars/avatar4.png',
#                 '/static/avatars/avatar5.png',
#                 '/static/avatars/avatar6.png'
#             ]
#             photo_url = random.choice(default_avatars)
#         return JsonResponse({'photo': photo_url})
#     return JsonResponse({'photo': None})

def get_profile_picture(request):
    if request.user.is_authenticated:
        profile = Profile.objects.get(user=request.user)
        photo_url = profile.photo.url if profile.photo else None
        return JsonResponse({'photo': photo_url})
    return JsonResponse({'photo': None})


def leaderboard(request):
    # Get the top 10 scores ordered by total_score in descending order
    scores = PlayerScore.objects.all().order_by('-total_score')[:10]
    data = []
    
    for score in scores:
        try:
            profile = Profile.objects.get(user__username=score.player_name)
            avatar_url = profile.photo.url if profile.photo else '/media/profile_pictures/11475215.jpg'
        except Profile.DoesNotExist:
            avatar_url = '/media/profile_pictures/11475215.jpg'
        
        data.append({
            'name': score.player_name,
            'score': score.total_score,
            'avatar': avatar_url
        })

    return JsonResponse(data, safe=False)


def get_play_history(request, username):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Authentication required'}, status=401)

    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User does not exist'}, status=404)

    try:
        player_score = PlayerScore.objects.get(player_name=user.username)
    except PlayerScore.DoesNotExist:
        return JsonResponse([], safe=False)

    scores_with_dates = [
        {
            'score': score,
            'date': player_score.last_updated,
            'win': score >= 5,
            'lose': score < 5
        }
        for score in player_score.scores
    ]
    return JsonResponse(sorted(scores_with_dates, key=lambda x: x['date'], reverse=True), safe=False)

@jwt_required
def change_username(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            new_username = data.get('new_username')
            current_username = data.get('current_username')

            if not new_username or not current_username:
                return JsonResponse({'status': 'error', 'error': 'Both current and new usernames are required.'}, status=400)

            if User.objects.filter(username=new_username).exists():
                return JsonResponse({'status': 'error', 'error' : 'New username already exists.'}, status=400)

            if new_username == 'Guest':
                return JsonResponse({'status': 'error', 'error': 'Username can not be Guest.'}, status=400)

            try:
                user = User.objects.get(username=current_username)
                user.username = new_username
                user.save()
                return JsonResponse({'status': 'success', 'message': 'Username changed successfully!'})
            except User.DoesNotExist:
                return JsonResponse({'status': 'error', 'error': 'User does not exist.'}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'error': 'Invalid JSON data.'}, status=400)

    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'}, status=405)


@jwt_required
def change_password(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            current_password = data.get('current_password')
            new_password = data.get('new_password')

            if not current_password or not new_password:
                return JsonResponse({'status': 'error', 'error': 'Both current and new passwords are required.'}, status=400)

            user = authenticate(username=request.user.username, password=current_password)
            if user is not None:
                user.set_password(new_password)
                user.save()
                return JsonResponse({'status': 'success', 'message': 'Password changed successfully!'})
            else:
                return JsonResponse({'status': 'error', 'error': 'Current password is incorrect.'}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'error': 'Invalid JSON data.'}, status=400)

    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'}, status=405)


# 2Factor Authentication
def generate_random_hex(length):
    return get_random_string(length * 2, allowed_chars='0123456789abcdef')


@jwt_required
def setup_2fa(request):
    if request.user.is_authenticated:
        if request.method == 'POST':
            try:
                # Check if a TOTP device already exists for the user
                otp_device = TOTPDevice.objects.get(user=request.user, name="default")
            except TOTPDevice.DoesNotExist:
                # Generate a random secret key
                secret = generate_random_hex(20)
                
                # Create a TOTP device for the user
                otp_device = TOTPDevice(user=request.user, name="default")
                otp_device.key = secret
                otp_device.save()

            otp_key = base64.b32encode(otp_device.bin_key).decode()
            label = f"Pong%20Game%3A{request.user.username}"
            qr_code_url = f"otpauth://totp/{label}?secret={otp_key}&algorithm=SHA1&digits=6&period=30&issuer=Pong%20Game&_={int(time())}"

            # Generate the QR code
            qr = qrcode.make(qr_code_url)
            buffer = BytesIO()
            qr.save(buffer, format='PNG')
            qr_code_image = base64.b64encode(buffer.getvalue()).decode()
            
            # Return the QR code as a data URL
            response = JsonResponse({'qr_code_url': f'data:image/png;base64,{qr_code_image}'})
            response['Cache-Control'] = 'no-store, no-cache, must-revalidate, proxy-revalidate'
            response['Pragma'] = 'no-cache'
            response['Expires'] = '0'
            return response
        return JsonResponse({'error': 'Invalid method'}, status=400)
    
    return JsonResponse({'error': 'Authentication required'}, status=401)

@csrf_exempt
def verify_2fa(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            code = data.get('code')
            if not code:
                return JsonResponse({'error': 'Code is required'}, status=400)

            # Get the user's TOTP device
            totp_device = TOTPDevice.objects.filter(user=request.user).first()
            if not totp_device:
                return JsonResponse({'error': 'No 2FA device found for this user'}, status=400)

            # Verify the code using the TOTP device
            if totp_device.verify_token(code):
                request.user.profile.two_factor_enabled = True
                request.user.profile.save()
                # Generate JWT token
                payload = {
                    'user_id': request.user.id,
                    'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1),
                    'iat': datetime.datetime.utcnow()
                }
                token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
                return JsonResponse({
                    'status': 'success',
                    'message': '2FA verification successful',
                    'token': token
                })
            else:
                return JsonResponse({'error': 'Invalid verification code'}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON in request'}, status=400)

    return JsonResponse({'error': 'Invalid method'}, status=400)

@csrf_exempt
def disable_2fa(request):
    if request.method == 'POST':
        request.user.profile.two_factor_enabled = False
        request.user.profile.save()
        return JsonResponse({'status': 'success'})
    return JsonResponse({'error': 'Invalid method'}, status=400)

def get_2fa_status(request):
    if request.user.is_authenticated:
        if request.method == 'GET':
            if request.user.profile.two_factor_enabled == True:
                return JsonResponse({'enabled': True})
            return JsonResponse({'enabled': False})
        return JsonResponse({'error': 'Invalid method'}, status=400)
    return JsonResponse({'error': 'Authentication required'}, status=401)


def get_users(request):
    current_user = request.user
    users = User.objects.exclude(id=current_user.id).select_related('profile').values('id', 'username', 'profile__photo')
    users_list = list(users)
    return JsonResponse(users_list, safe=False)


from .models import Friendship

def add_block(request, username):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Authentication required'}, status=401)

    try:
        friend = User.objects.get(username=username)
        Friendship.objects.create(user=request.user, friend=friend)
        return JsonResponse({'status': 'Friend added'})
    except User.DoesNotExist:
        return JsonResponse({'error': 'User does not exist'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

def remove_block(request, username):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Authentication required'}, status=401)

    try:
        friend = User.objects.get(username=username)
        Friendship.objects.filter(user=request.user, friend=friend).delete()
        return JsonResponse({'status': 'Friend removed'})
    except User.DoesNotExist:
        return JsonResponse({'error': 'User does not exist'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


def get_user_profile(request, username):
    try:
        user = User.objects.get(username=username)
        profile = user.profile
        is_friend = Friendship.objects.filter(user=request.user, friend=user).exists()
        data = {
            'username': user.username,
            'profile__photo': profile.photo.url if profile.photo else None,
            'is_friend': is_friend
        }
        return JsonResponse(data)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User does not exist'}, status=404)

def intra42_login(request):
    client_id = settings.SOCIALACCOUNT_PROVIDERS['intra42']['APP']['client_id']
    redirect_uri = "https://localhost:8000/accounts/social/login/callback/"
    auth_url = f"https://api.intra.42.fr/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code"
    print(auth_url)
    return redirect(auth_url)



def callback_view(request):
    code = request.GET.get('code')
    if not code:
        return redirect('/')

    token_url = "https://api.intra.42.fr/oauth/token"
    data = {
        'grant_type': 'authorization_code',
        'client_id': settings.SOCIALACCOUNT_PROVIDERS['intra42']['APP']['client_id'],
        'client_secret': settings.SOCIALACCOUNT_PROVIDERS['intra42']['APP']['secret'],
        'code': code,
        'redirect_uri': 'https://localhost:8000/accounts/social/login/callback/',
    }
    response = requests.post(token_url, data=data)
    response_data = response.json()

    if 'access_token' not in response_data:
        return JsonResponse({'status': 'error', 'message': 'Access token not provided'}, status=400)

    access_token = response_data['access_token']

    user_info_url = "https://api.intra.42.fr/v2/me"
    headers = {'Authorization': f'Bearer {access_token}'}
    user_info = requests.get(user_info_url, headers=headers).json()

    # get user data
    username = user_info['login']
    photo_url = user_info.get('image', {}).get('link', '')

    # check if the username already exists
    # if User.objects.filter(username=username).exists():
    #     return HttpResponse("""
    #         <html>
    #         <head>
    #             <script src="/static/scripts/homePage.js" defer></script>
    #             <link rel="stylesheet" href="/static/css/style.css">
    #         </head>
    #         <body style="justify-content: center; align-items: center; display: flex; height: 100vh;">
    #             <div>
    #                 <h1 style="color: white; text-align: center;">Error !!<br> User name already exists.<br></h1>
    #                 <h2 style="color: white; text-align: center;">Redirecting....</h2>
    #             </div>
    #             <script type="text/javascript">
    #                 window.onload = function() {
    #                     setTimeout(function() {
    #                         window.location.href = '/#homePage';
    #                         login();
    #                     }, 1000);
    #                 };
    #             </script>
    #         </body>
    #         </html>
    #     """)

    user, created = User.objects.get_or_create(username=username)
    if created:
        user.set_unusable_password()
        user.save()

    login(request, user)

    profile, _ = Profile.objects.get_or_create(user=user)
    if profile.photo:
        saved_path = profile.photo
    elif photo_url:
        response = requests.get(photo_url)
        if response.status_code == 200:
            file_name = os.path.basename(photo_url)
            file_path = f'profile_pictures/{file_name}'
            saved_path = default_storage.save(file_path, ContentFile(response.content))
            profile.photo = saved_path
            profile.save()

    return redirect('/api/redirect/')


def redirect_to_home(request):
    payload = {
        'user_id': request.user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1),
        'iat': datetime.datetime.utcnow()
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    token_str = token.decode('utf-8') if isinstance(token, bytes) else token

    return HttpResponse(f"""
        <html>
        <head>
            <script src="/static/scripts/homePage.js" defer></script>
            <link rel="stylesheet" href="/static/css/style.css">
        </head>
        <body style="justify-content: center; align-items: center; display: flex; height: 100vh;">
            <h1 style="color: white; text-align: center;">Redirecting....</h1>
            <script type="text/javascript">
                window.onload = function() {{
                    setTimeout(function() {{
                        localStorage.setItem('jwtToken', "{token_str}");
                        window.location.href = '/#homePage';
                        homePage();
                    }}, 1000);
                }};
            </script>
        </body>
        </html>
    """)



from django.db.models import Q

@csrf_exempt
def get_chat_history(request):
    if request.method == "GET":
        user = request.user
        receiver_username = request.GET.get("receiver")

        if not receiver_username:
            return JsonResponse({"error": "Missing receiver parameter"}, status=400)

        try:
            receiver = User.objects.get(username=receiver_username)
            messages = ChatMessage.objects.filter(
                (Q(sender=user) & Q(receiver=receiver)) | (Q(sender=receiver) & Q(receiver=user))
            ).order_by('timestamp')

            messages_data = [
                {
                    "sender": msg.sender.username,
                    "message": msg.message,
                    "timestamp": msg.timestamp.isoformat(),
                }
                for msg in messages
            ]

            return JsonResponse({"messages": messages_data}, status=200)

        except User.DoesNotExist:
            return JsonResponse({"error": "Receiver not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def get_last_active(request):
    if request.method == "GET":
        username = request.GET.get("username")

        if not username:
            return JsonResponse({"error": "Missing username parameter"}, status=400)

        try:
            user = User.objects.get(username=username)
            last_login = user.last_login
            last_active = last_login.isoformat() if last_login else 'unknown'
            return JsonResponse({"last_active": last_active}, status=200)

        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)

def get_openrouter_key(request):
    return JsonResponse({'apiKey': settings.OPENROUTER_API})
