import time
from datetime import datetime

from weather_api import fetch_weather_data
from rabbitmq_client import retries_connect_to_rabbitmq, publish_message

from config import ( 
    RABBITMQ_HOST,
    RABBITMQ_USER,
    RABBITMQ_PASS,
    RABBITMQ_PORT,
    QUEUE_NAME,
    MAX_RETRIES
)

def main():
    connection, channel = retries_connect_to_rabbitmq(MAX_RETRIES, QUEUE_NAME, RABBITMQ_HOST, RABBITMQ_USER, RABBITMQ_PASS, RABBITMQ_PORT)
    
    if connection is None or channel is None:
        print(f"{datetime.now()} - Não foi possível conectar ao RabbitMQ. Encerrando serviço.")
        return
            
    print(f"{datetime.now()} - Iniciando coleta. Pressione Ctrl+C para sair.")
    
    while True:
        try:
            weather_data = fetch_weather_data()
            
            if weather_data:
                publish_message(channel, QUEUE_NAME, weather_data)
            else:
                print(f"{datetime.now()} - Nenhum dado foi obtido da API nessa requisição.")

            print(f"{datetime.now()} - Aguardando 1 hora para próxima requisição.")
            time.sleep(3600)
            
        except KeyboardInterrupt:
            print(f"\n{datetime.now()} - Desligando o serviço...")
            break
        except Exception as e:
            print(f"{datetime.now()} - Ocorreu um erro: {e}. Tentando reconectar em 10 segundos...")
            time.sleep(10)
            
            connection, channel = retries_connect_to_rabbitmq(MAX_RETRIES, QUEUE_NAME, RABBITMQ_HOST, RABBITMQ_USER, RABBITMQ_PASS, RABBITMQ_PORT)
            
            if connection is None or channel is None:
                print(f"{datetime.now()} - Não foi possível reconectar ao RabbitMQ. Encerrando serviço.")
                break

    if connection and connection.is_open:
        connection.close()
    print(f"{datetime.now()} - Serviço finalizado.")

if __name__ == '__main__':
    main()