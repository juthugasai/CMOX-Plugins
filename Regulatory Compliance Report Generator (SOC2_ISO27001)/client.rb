require 'net/http'
require 'json'
require 'uri'

module CMOX
  module Plugins
    class RegulatoryComplianceReportGeneratorSOC2ISO27001RubyClient
      def initialize(bridge_url = "http://localhost:7890")
        @bridge_url = bridge_url.chomp('/')
      end

      def ingest(action, data)
        uri = URI.parse("#{@bridge_url}/")
        request = Net::HTTP::Post.new(uri)
        request.content_type = "application/json"
        request["X-CMOX-Plugin"] = "regulatory-report-generator"
        request.body = { action: action, data: data }.to_json

        response = Net::HTTP.start(uri.hostname, uri.port) do |http|
          http.request(request)
        end
        JSON.parse(response.body)
      end
    end
  end
end
