namespace CMOX.Plugins.RowLevelSecurityRLSPolicyManager
{
    using System;
    using System.Net.Http;
    using System.Text;
    using System.Threading.Tasks;

    public class RowLevelSecurityRLSPolicyManagerCSharpClient
    {
        private readonly string _bridgeUrl;
        private readonly HttpClient _httpClient;

        public RowLevelSecurityRLSPolicyManagerCSharpClient(string bridgeUrl = "http://localhost:7890")
        {
            _bridgeUrl = bridgeUrl.TrimEnd('/');
            _httpClient = new HttpClient { Timeout = TimeSpan.FromSeconds(5) };
        }

        public async Task<string> IngestAsync(string action, string jsonData)
        {
            var payload = $"{{\"action\":\"{action}\",\"data\":{jsonData}}}";
            var content = new StringContent(payload, Encoding.UTF8, "application/json");
            content.Headers.Add("X-CMOX-Plugin", "rls-policy-manager");

            var response = await _httpClient.PostAsync($"{_bridgeUrl}/", content);
            return await response.Content.ReadAsStringAsync();
        }
    }
}
