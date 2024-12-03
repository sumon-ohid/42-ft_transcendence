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


@login_required
def home(request):
    return render(request, "home.html", {})

def index(request):
    context = {'data': 'Hello from Django'}
    return render(request, 'index.html', context)

# @csrf_exempt  # Use only if CSRF token is not included in the frontend request
def api_signup(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)  # Parse JSON from the request body
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


# @csrf_exempt
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
                return JsonResponse({'status': 'success', 'message': 'Login successful!'})
            else:
                return JsonResponse({'status': 'error', 'error': 'Invalid username or password.'}, status=401)
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'error': 'Invalid JSON data.'}, status=400)

    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'}, status=405)


# @csrf_exempt
def api_logout(request):
    if request.user.is_authenticated:
        logout(request)
        return JsonResponse({'status': 'success', 'message': 'Logged out successfully.'})
    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'}, status=405)

def get_username(request):
    if request.user.is_authenticated:
        return JsonResponse({'username': request.user.username})
    else:
        return JsonResponse({'username': 'Guest'})


# @csrf_exempt
def save_score(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        player_name = request.user.username if request.user.is_authenticated else data.get('player_name')
        score = data.get('score')
        
        # Check if the player already has a score entry
        player_score, created = PlayerScore.objects.get_or_create(player_name=player_name)
        
        # Append the new score to the existing score
        player_score.score += score
        player_score.save()
        
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'}, status=400)


# @csrf_exempt
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

def get_profile_picture(request):
    if request.user.is_authenticated:
        profile = Profile.objects.get(user=request.user)
        photo_url = profile.photo.url if profile.photo else None
        return JsonResponse({'photo': photo_url})
    return JsonResponse({'photo': None})


def leaderboard(request):
    scores = PlayerScore.objects.all().order_by('-score')[:10]  # Get top 10 scores
    data = []
    for score in scores:
        try:
            profile = Profile.objects.get(user__username=score.player_name)
            avatar_url = profile.photo.url if profile.photo else '/media/profile_pictures/11475215.jpg'
        except Profile.DoesNotExist:
            avatar_url = '/media/profile_pictures/11475215.jpg'
        
        data.append({
            'name': score.player_name,
            'score': score.score,
            'avatar': avatar_url
        })
    return JsonResponse(data, safe=False)

def get_play_history(request):
    player_name = request.user.username
    scores = PlayerScore.objects.filter(player_name=player_name).order_by('-date')
    data = [
        {
            'score': score.score,
            'date': score.date,
            'win': score.score >= 5,
            'lose': score.score < 5
        }
        for score in scores
    ]
    return JsonResponse(data, safe=False)

@csrf_exempt
def change_username(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            new_username = data.get('new_username')
            current_username = data.get('current_username')

            if not new_username or not current_username:
                return JsonResponse({'status': 'error', 'error': 'Both current and new usernames are required.'}, status=400)

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