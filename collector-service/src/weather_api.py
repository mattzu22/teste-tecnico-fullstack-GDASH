import requests
import time

from datetime import datetime

from config import (
    LATITUDE,
    LONGITUDE,
    API_URL,
    MAX_RETRIES,
    WEATHER_CITY,
    WEATHER_STATE,
    WEATHER_COUNTRY
)

def fetch_weather_data():
    PARAMS = {
        "latitude": LATITUDE,
        "longitude": LONGITUDE,
        "current": "temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m,wind_direction_10m,apparent_temperature",
        "hourly": "precipitation_probability,precipitation,weather_code", 
        "timezone": "America/Sao_Paulo",
        "forecast_days": 1,
    }

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            print(
                f"{datetime.now()} - Coletando dados da API (tentativa {attempt}/{MAX_RETRIES})..."
            )
            response = requests.get(API_URL, params=PARAMS, timeout=10)
            response.raise_for_status()
            weather_data = response.json()
            
            current_weather = weather_data.get("current", {})
            hourly_weather = weather_data.get("hourly", {})

            current_time = current_weather.get("time")

            hourly_times = hourly_weather.get("time", [])
            current_index = hourly_times.index(current_time) if current_time in hourly_times else 0

            current_precipitation_prob = hourly_weather.get("precipitation_probability", [])[current_index]

            next_24h_probabilities = hourly_weather.get("precipitation_probability", [])[current_index:current_index+24]

            DATA_WEATHER = {
                "city": WEATHER_CITY,
                "state": WEATHER_STATE,
                "country": WEATHER_COUNTRY,
                "timestamp": current_weather.get("time"),
                "temperature_celsius": current_weather.get("temperature_2m"),
                "apparent_temperature": current_weather.get("apparent_temperature"),
                "humidity_percent": current_weather.get("relative_humidity_2m"),
                "wind_speed_ms": current_weather.get("wind_speed_10m"),
                "wind_direction_degrees": current_weather.get("wind_direction_10m"),
                "weather_code": current_weather.get("weather_code"),
                    
                "precipitation_probability_percent": current_precipitation_prob,
                "hourly_forecast": {
                    "times": hourly_times[current_index:current_index+24],
                    "precipitation_probability": next_24h_probabilities,
                    "precipitation": hourly_weather.get("precipitation", [])[current_index:current_index+24],
                }
            }
            print(f"{datetime.now()} - Coleta de dados da API concluída com sucesso.")

            return DATA_WEATHER


        except requests.exceptions.RequestException as e:

            print(f"{datetime.now()} - Erro na tentativa {attempt}: {e}")

            if attempt < MAX_RETRIES:
                print(
                    f"{datetime.now()} - Aguardando 10 segundos antes de tentar novamente..."
                )

                time.sleep(10)
            else:
                print(f"{datetime.now()} - Todas as tentativas falharam.")
                return None

        except Exception as e:
            print(f"{datetime.now()} - Erro inesperado ao processar dados da API: {e}")
            return None
