// Package rabbitmqamqpeventexchange provides the official Go SDK for RabbitMQ AMQP Event Exchange.
package rabbitmqamqpeventexchange

import (
	"bytes"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type Client struct {
	BridgeURL  string
	APIKey     string
	HTTPClient *http.Client
}

func NewClient(bridgeURL string, apiKey string) *Client {
	return &Client{
		BridgeURL:  bridgeURL,
		APIKey:     apiKey,
		HTTPClient: &http.Client{Timeout: 5 * time.Second},
	}
}

func (c *Client) Ingest(action string, data interface{}) (map[string]interface{}, error) {
	reqBody, _ := json.Marshal(map[string]interface{}{
		"action": action,
		"data":   data,
	})
	req, err := http.NewRequest("POST", c.BridgeURL+"/", bytes.NewBuffer(reqBody))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-CMOX-Plugin", "rabbitmq-exchange")

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&result)
	return result, nil
}
