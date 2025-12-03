package rabbitmq

import (
	"fmt"
	"log"
	amqp "github.com/rabbitmq/amqp091-go"
)

func Connect(url string) (*amqp.Connection, *amqp.Channel, error) {
	log.Printf("Conectando ao RabbitMQ: %s", url)
	
	conn, err := amqp.Dial(url)
	if err != nil {
		return nil, nil, fmt.Errorf("erro ao conectar: %w", err)
	}

	ch, err := conn.Channel()
	if err != nil {
		conn.Close()
		return nil, nil, fmt.Errorf("erro ao abrir canal: %w", err)
	}

	return conn, ch, nil
}

func DeclareQueue(ch *amqp.Channel, name string) (amqp.Queue, error) {
	log.Printf("Declarando fila: %s", name)
	
	queue, err := ch.QueueDeclare(name, true, false, false, false, nil)
	if err != nil {
		return amqp.Queue{}, fmt.Errorf("erro ao declarar fila: %w", err)
	}
	
	return queue, nil
}