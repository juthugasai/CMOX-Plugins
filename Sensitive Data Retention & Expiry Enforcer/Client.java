package io.cmox.plugins.sensitivedataretentionexpiryenforcer;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

public class SensitiveDataRetentionExpiryEnforcerJavaClient {
    private final String bridgeUrl;
    private final HttpClient httpClient;

    public SensitiveDataRetentionExpiryEnforcerJavaClient(String bridgeUrl) {
        this.bridgeUrl = bridgeUrl.replaceAll("/$", "");
        this.httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build();
    }

    public String ingest(String action, String jsonData) throws Exception {
        String payload = String.format("{\"action\":\"%s\",\"data\":%s}", action, jsonData);
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(this.bridgeUrl + "/"))
                .header("Content-Type", "application/json")
                .header("X-CMOX-Plugin", "retention-expiry-enforcer")
                .POST(HttpRequest.BodyPublishers.ofString(payload))
                .build();

        HttpResponse<String> response = this.httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        return response.body();
    }
}
