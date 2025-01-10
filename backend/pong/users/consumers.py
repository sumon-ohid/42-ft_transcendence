import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import User
from .models import ChatMessage
from channels.db import database_sync_to_async

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        self.other_user = self.scope['url_route']['kwargs']['username']
        self.room_name = self.get_room_name(self.user.username, self.other_user)
        self.room_group_name = 'chat_%s' % self.room_name

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        receiver_username = text_data_json['receiver']

        chat_message = await self.save_message_to_db(self.user.username, receiver_username, message)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': {
                    'sender': chat_message.sender.username,
                    'receiver': chat_message.receiver.username,
                    'text': chat_message.message,
                    'timestamp': chat_message.timestamp.isoformat(),
                }
            }
        )

    async def chat_message(self, event):
        message = event['message']

        await self.send(text_data=json.dumps({
            'message': message
        }))

    @database_sync_to_async
    def save_message_to_db(self, sender_username, receiver_username, message):
        sender = User.objects.get(username=sender_username)
        receiver = User.objects.get(username=receiver_username)
        return ChatMessage.objects.create(
            sender=sender,
            receiver=receiver,
            message=message
        )

    def get_room_name(self, user1, user2):
        """Generate a unique room name for a pair of users."""
        users = sorted([user1, user2])
        return f"{users[0]}_{users[1]}"