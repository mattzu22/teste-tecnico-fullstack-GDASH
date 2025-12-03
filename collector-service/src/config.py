import os
   
RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "rabbitmq")
RABBITMQ_USER = os.getenv("RABBITMQ_USER", "guest")
RABBITMQ_PASS = os.getenv("RABBITMQ_PASS", "guest")
RABBITMQ_PORT = int(os.getenv("RABBITMQ_PORT", "5672"))
WEATHER_CITY = os.getenv("WEATHER_CITY", "Natal")
QUEUE_NAME = os.getenv("QUEUE_NAME", "weather_data")
MAX_RETRIES = int(os.getenv("MAX_RETRIES", "3"))
   
LATITUDE = os.getenv("WEATHER_LATITUDE", "5.783")
LONGITUDE = os.getenv("WEATHER_LONGITUDE", "-35.200")
API_URL = os.getenv("API_URL", "https://api.open-meteo.com/v1/forecast")