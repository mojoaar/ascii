package client

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type GenerateResp struct {
	Output string `json:"output"`
}

func Generate(baseURL, text, font string, width int) (string, error) {
	body := map[string]any{"text": text, "font": font}
	if width > 0 {
		body["width"] = width
	}
	b, _ := json.Marshal(body)
	resp, err := http.Post(baseURL+"/api/generate", "application/json", bytes.NewReader(b))
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	data, _ := io.ReadAll(resp.Body)
	if resp.StatusCode != 200 {
		return "", fmt.Errorf("generate failed: %s", string(data))
	}
	var out GenerateResp
	if err := json.Unmarshal(data, &out); err != nil {
		return "", err
	}
	return out.Output, nil
}
