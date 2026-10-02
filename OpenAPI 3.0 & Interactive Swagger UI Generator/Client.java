package io.cmox.plugins.openapi30interactiveswaggeruigenerator;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

public class OpenAPI30InteractiveSwaggerUIGeneratorJavaClient {
    private final String bridgeUrl;
    private final HttpClient httpClient;

    public OpenAPI30InteractiveSwaggerUIGeneratorJavaClient(String bridgeUrl) {
        this.bridgeUrl = bridgeUrl.replaceAll("/$", "");
        this.httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build();
    }

    public String ingest(String action, String jsonData) throws Exception {
        String payload = String.format("{\"action\":\"%s\",\"data\":%s}", action, jsonData);
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(this.bridgeUrl + "/"))
                .header("Content-Type", "application/json")
                .header("X-CMOX-Plugin", "swagger-openapi-ui")
                .POST(HttpRequest.BodyPublishers.ofString(payload))
                .build();

        HttpResponse<String> response = this.httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        return response.body();
    }
}
