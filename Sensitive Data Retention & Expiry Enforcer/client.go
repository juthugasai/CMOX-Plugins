// Package sensitivedataretentionexpiryenforcer provides the official high-performance Go SDK for Sensitive Data Retention & Expiry Enforcer.
package sensitivedataretentionexpiryenforcer

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

type StreamPayload struct {
	ID        string      `json:"id"`
	Timestamp int64       `json:"timestamp"`
	Action    string      `json:"action"`
	Data      interface{} `json:"data"`
	Checksum  string      `json:"checksumSha256"`
}

func NewClient(bridgeURL string, apiKey string) *Client {
	return &Client{
		BridgeURL:  bridgeURL,
		APIKey:     apiKey,
		HTTPClient: &http.Client{Timeout: 5 * time.Second},
	}
}

func (c *Client) Ingest(action string, data interface{}) (*StreamPayload, error) {
	dataBytes, err := json.Marshal(data)
	if err != nil {
		return nil, err
	}
	hash := sha256.Sum256(dataBytes)
	checksum := hex.EncodeToString(hash[:])

	reqBody, _ := json.Marshal(map[string]interface{}{
		"action": action,
		"data":   data,
	})

	req, err := http.NewRequest("POST", c.BridgeURL+"/", bytes.NewBuffer(reqBody))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-CMOX-Plugin", "retention-expiry-enforcer")

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	return &StreamPayload{
		ID:        fmt.Sprintf("go_%d", time.Now().UnixMilli()),
		Timestamp: time.Now().UnixMilli(),
		Action:    action,
		Data:      data,
		Checksum:  checksum,
	}, nil
}
