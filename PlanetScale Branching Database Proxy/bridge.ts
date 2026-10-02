/**
 * @file bridge.ts
 * @description Universal JSON-RPC 2.0 & HTTP REST Bridge enabling ANY programming language
 * (Python, Go, Rust, Java, C#, PHP, C++, Ruby) to execute real-time operations on PlanetScale Branching Database Proxy.
 * @module @cmox/plugin-planetscale-proxy/bridge
 */

import http from 'http';
import { PlanetScaleBranchingDatabaseProxyEngine } from './engine';

export class PlanetScaleBranchingDatabaseProxyUniversalBridge {
  private engine: PlanetScaleBranchingDatabaseProxyEngine;
  private server: http.Server | null = null;
  private port: number;

  constructor(engine: PlanetScaleBranchingDatabaseProxyEngine, port = 7890) {
    this.engine = engine;
    this.port = port;
  }

  public start(): Promise<number> {
    return new Promise((resolve) => {
      this.server = http.createServer(async (req, res) => {
        // Enable CORS for universal access
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CMOX-Plugin');

        if (req.method === 'OPTIONS') {
          res.writeHead(204);
          res.end();
          return;
        }

        // Health endpoint
        if (req.url === '/health' || req.url === '/status') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(this.engine.getHealthReport(), null, 2));
          return;
        }

        // JSON-RPC 2.0 & REST Ingest Endpoint
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const parsed = JSON.parse(body || '{}');

              // JSON-RPC 2.0 Protocol Handler
              if (parsed.jsonrpc === '2.0') {
                const result = await this.handleJsonRpc(parsed.method, parsed.params);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ jsonrpc: '2.0', id: parsed.id, result }));
                return;
              }

              // Standard REST Ingest
              const action = parsed.action || 'stream';
              const data = parsed.data || parsed;
              const event = await this.engine.ingest(action, data);

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, event }));
            } catch (err: any) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Endpoint not found. Use POST / for ingest or GET /health for metrics.' }));
      });

      this.server.listen(this.port, () => {
        resolve(this.port);
      });
    });
  }

  private async handleJsonRpc(method: string, params: any): Promise<any> {
    switch (method) {
      case 'ingest':
        return await this.engine.ingest(params.action || 'stream', params.data);
      case 'flush':
        return await this.engine.flushBuffer();
      case 'getHealthReport':
        return this.engine.getHealthReport();
      case 'ping':
        return { pong: true, timestamp: Date.now() };
      default:
        throw new Error(`Method "${method}" not supported by PlanetScale Branching Database Proxy.`);
    }
  }

  public stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => resolve());
      } else {
        resolve();
      }
    });
  }
}
