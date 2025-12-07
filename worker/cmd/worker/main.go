package main

import (
	"encoding/json"
	"log"
	"os"

	"worker/internal/api"
	"worker/internal/models"
	"worker/internal/rabbitmq"
)

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

func main() {
	log.SetFlags(log.LstdFlags)
	log.Println("Worker iniciado")

	rabbitmqURL := os.Getenv("RABBITMQ_URL")
	if rabbitmqURL == "" {
		log.Fatal("RABBITMQ_URL não definida")
	}

	queueName := os.Getenv("QUEUE_NAME")
	if queueName == "" {
		queueName = "weather_data"
		log.Printf("QUEUE_NAME não definido, usando padrão: %s", queueName)
	}

	conn, ch, err := rabbitmq.Connect(rabbitmqURL)
	failOnError(err, "Falha na conexão")
	defer func() {
		log.Println("Fechando conexões...")
		conn.Close()
		ch.Close()
	}()

	queue, err := rabbitmq.DeclareQueue(ch, queueName)
	failOnError(err, "Falha ao declarar fila")

	msgs, err := ch.Consume(queue.Name, "", false, false, false, false, nil)
	failOnError(err, "Erro ao registrar consumidor")
	log.Println("Consumidor registrado")

	forever := make(chan bool)

	go func() {
		log.Println("Aguardando mensagens...")

		for msg := range msgs {
			log.Println("\nNova mensagem recebida")

			var data models.WeatherData
			log.Println("Deserializando JSON...")
			if err := json.Unmarshal(msg.Body, &data); err != nil {
				log.Printf("JSON inválido: %v", err)
				msg.Nack(false, false)
				log.Println("Mensagem descartada (NACK)")
				continue
			}
			log.Println("JSON deserializado com sucesso")

			log.Println("Enviando dados para API...")
			if err := api.SendToAPI(data); err != nil {
				log.Printf("Falha no envio: %v", err)
				msg.Nack(false, false)
				log.Println("Mensagem descartada (NACK)")
				continue
			}

			msg.Ack(false)
			log.Println("Mensagem confirmada (ACK)")
			log.Println("Processamento concluído com sucesso")
		}
	}()

	log.Println("\n[PRONTO] Aguardando mensagens... (CTRL+C para sair)\n")
	<-forever
}