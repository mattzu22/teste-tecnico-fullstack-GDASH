import requests
import time

from datetime import datetime

from config import (
    LATITUDE,
    LONGITUDE,
    API_URL,
    MAX_RETRIES,
    WEATHER_CITY
)

def fetch_weather_data():
    PARAMS = {
        "latitude": LATITUDE,
        "longitude": LONGITUDE,
        "hourly": "temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation",
        "current_weather": "true",
        "timezone": "America/Sao_Paulo",
        "forecast_days": 1 
    }
    
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            print(f"{datetime.now()} - Coletando dados da API (tentativa {attempt}/{MAX_RETRIES})...")
            response = requests.get(API_URL, params=PARAMS, timeout=10)
            response.raise_for_status()
            weather_data = response.json()
            
            current_weather = weather_data.get('current_weather', {})
            
            DATA_WEATHER = {
                "city": WEATHER_CITY,
                "state": "RN",
                "country": "Brazil",
                "timestamp": current_weather.get('time'),
                "temperature_celsius": current_weather.get('temperature'),
                "humidity_percent": current_weather.get('relative_humidity_2m'),
                "wind_speed_ms": current_weather.get('windspeed'),
                "wind_direction_degrees": current_weather.get('winddirection'),
                "weather_code": current_weather.get('weathercode'),
                "precipitation_probability_percent": current_weather.get('precipitation_probability')
            }
            print(f"{datetime.now()} - Coleta de dados da API concluída com sucesso.")
            
            return DATA_WEATHER
            
        except requests.exceptions.RequestException as e:
            print(f"{datetime.now()} - Erro na tentativa {attempt}: {e}")
            if attempt < MAX_RETRIES:
                print(f"{datetime.now()} - Aguardando 10 segundos antes de tentar novamente...")
                time.sleep(10)
            else:
                print(f"{datetime.now()} - Todas as tentativas falharam.")
                return None
        except Exception as e:
            print(f"{datetime.now()} - Erro inesperado ao processar dados da API: {e}")
            return None