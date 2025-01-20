name: Django CI with Docker

on:
  push:
    branches: ["main"]
  pull_request:
    branches: ["main"]

jobs:
  build:

    runs-on: ubuntu-latest

    steps:
    - name: Check out the code
      uses: actions/checkout@v4

    - name: Set up Docker
      uses: docker/setup-buildx-action@v2

    - name: Install Docker Compose
      run: sudo apt-get install -y docker-compose

    - name: Create .env file from Secrets
      run: |
        echo "POSTGRES_USER=${{ secrets.POSTGRES_USER }}" >> .env
        echo "POSTGRES_PASSWORD=${{ secrets.POSTGRES_PASSWORD }}" >> .env
        echo "POSTGRES_DB=${{ secrets.POSTGRES_DB }}" >> .env
        echo "SECRET_KEY=${{ secrets.SECRET_KEY }}" >> .env
        echo "INTRA42_CLIENT_ID=${{ secrets.INTRA42_CLIENT_ID }}" >> .env
        echo "INTRA42_SECRET=${{ secrets.INTRA42_SECRET }}" >> .env

    - name: Build and Run Docker Compose
      run: |
        docker-compose up --build
