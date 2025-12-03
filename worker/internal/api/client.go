package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"worker/internal/models"
)

func SendToAPI(data models.WeatherData) error {
	apiURL := os.Getenv("NESTJS_API_URL_POST")
	if apiURL == "" {
		log.Println("NESTJS_API_URL_POST não definido, usando padrão")
		apiURL = "http://nestjsapi:5443/api/weather/logs"
	}

	jsonData, err := json.Marshal(data)
	if err != nil {
		return fmt.Errorf("erro ao serializar: %w", err)
	}

	maxRetriesStr := os.Getenv("MAX_RETRIES")
	maxRetries, err := strconv.Atoi(maxRetriesStr)
	if err != nil {
		log.Printf("API_MAX_RETRIES inválido ou não definido. Usando o padrão de 3 tentativas.")
		maxRetries = 3
	}

	var lastErr error

	for tentativa := 1; tentativa <= maxRetries; tentativa++ {
		log.Printf("Tentativa %d de %d", tentativa, maxRetries)

		resp, err := http.Post(apiURL, "application/json", bytes.NewBuffer(jsonData))
		if err != nil {
			lastErr = err
			if tentativa < maxRetries {
				log.Printf("Erro ao enviar: %v. Tentando novamente em 10 segundos...", err)
				time.Sleep(10 * time.Second)
				continue
			}
			break
		}
		defer resp.Body.Close()

		if resp.StatusCode >= 400 {
			body, _ := io.ReadAll(resp.Body)
			lastErr = fmt.Errorf("erro %s: %s", resp.Status, string(body))
			if tentativa < maxRetries {
				log.Printf("Resposta de erro: %v. Tentando novamente em 10 segundos...", lastErr)
				time.Sleep(10 * time.Second)
				continue
			}
			break
		}

		log.Printf("✓ Enviado: %s", resp.Status)
		return nil
	}

	return fmt.Errorf("falhou após %d tentativas: %w", maxRetries, lastErr)
}