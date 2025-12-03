import pika

import json
import time

from datetime import datetime


def connect_to_rabbitmq(host: str, user: str, password: str, port: int):
    credentials = pika.PlainCredentials(user, password)
    params = pika.ConnectionParameters(host=host, port=port, credentials=credentials)
    connection = pika.BlockingConnection(params)
    channel = connection.channel()
    print(f"{datetime.now()} - Conectado ao RabbitMQ com sucesso!")
    return connection, channel

def declare_queue(channel, queue_name: str, durable: bool = True):
    channel.queue_declare(queue=queue_name, durable=durable)
    print(f"{datetime.now()} - Fila '{queue_name}' declarada com sucesso.")
    
def retries_connect_to_rabbitmq(max_retries: int, queue_name: str, rabbitmq_host: str, rabbitmq_user: str, rabbitmq_pass: str, rabbitmq_port: int):
    for attempt in range(1, max_retries + 1):
        try:
            connection, channel = connect_to_rabbitmq(rabbitmq_host, rabbitmq_user, rabbitmq_pass, rabbitmq_port)
            declare_queue(channel, queue_name)
            print(f"{datetime.now()} - Conectado e fila criada com sucesso!")
            return connection, channel
        except Exception as e:
            print(f"{datetime.now()} - Erro ao conectar ou declarar a fila ao RabbitMQ: {e}")
            if attempt < max_retries:    
                print(f"{datetime.now()} - Tentando reconectar em 10 segundos...")
                time.sleep(10)
            else:
                print(f"{datetime.now()} - Excedeu o número máximo de tentativas.")
    
    return None, None

def publish_message(channel, queue_name: str, message: dict):
    message_body = json.dumps(message)
    channel.basic_publish(
        exchange='',
        routing_key=queue_name,
        body=message_body,
        properties=pika.BasicProperties(delivery_mode=2)
    )
    print(f"{datetime.now()} - Dados enviados para a fila '{queue_name}'.")    