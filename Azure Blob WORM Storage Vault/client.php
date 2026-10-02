<?php
namespace CMOX\Plugins\AzureBlobWORMStorageVault;

class AzureBlobWORMStorageVaultPhpClient {
    private string $bridgeUrl;

    public function __construct(string $bridgeUrl = "http://localhost:7890") {
        $this->bridgeUrl = rtrim($bridgeUrl, "/");
    }

    public function ingest(string $action, array $data): array {
        $payload = json_encode(["action" => $action, "data" => $data]);
        $ch = curl_init($this->bridgeUrl . "/");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Content-Type: application/json",
            "X-CMOX-Plugin: azure-blob-vault"
        ]);
        $res = curl_exec($ch);
        curl_close($ch);
        return json_decode($res, true) ?? [];
    }
}
