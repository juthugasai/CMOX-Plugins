/**
 * @file adapter.ts
 * @description Third-party plugin extensibility adapter and middleware pipeline for CLI Code Generator & Shell Completion Engine.
 * @module @cmox/plugin-cli-generator-zsh/adapter
 */

import { StreamPayload, MiddlewareHandler } from './types';

export class CLICodeGeneratorShellCompletionEngineThirdPartyAdapter {
  private preIngestMiddlewares: { name: string; handler: MiddlewareHandler }[] = [];
  private postProcessMiddlewares: { name: string; handler: MiddlewareHandler }[] = [];
  private customSinkAdapters: Map<string, (payloads: StreamPayload[]) => Promise<boolean>> = new Map();

  /**
   * Registers a third-party interceptor before data enters the core execution ring buffer.
   */
  public usePreIngest(name: string, handler: MiddlewareHandler): this {
    this.preIngestMiddlewares.push({ name, handler });
    return this;
  }

  /**
   * Registers a third-party interceptor after batch processing.
   */
  public usePostProcess(name: string, handler: MiddlewareHandler): this {
    this.postProcessMiddlewares.push({ name, handler });
    return this;
  }

  /**
   * Registers a custom destination sink (e.g. AWS SQS, Webhook, Custom DB).
   */
  public registerCustomSink(name: string, sinkFn: (payloads: StreamPayload[]) => Promise<boolean>): this {
    this.customSinkAdapters.set(name, sinkFn);
    return this;
  }

  public async executePreIngest<T>(payload: StreamPayload<T>): Promise<StreamPayload<T>> {
    let current = payload;
    for (const middleware of this.preIngestMiddlewares) {
      current = await middleware.handler(current);
    }
    return current;
  }

  public async executePostProcess<T>(payload: StreamPayload<T>): Promise<StreamPayload<T>> {
    let current = payload;
    for (const middleware of this.postProcessMiddlewares) {
      current = await middleware.handler(current);
    }
    return current;
  }

  public async dispatchToCustomSinks(batch: StreamPayload[]): Promise<void> {
    for (const [name, sinkFn] of this.customSinkAdapters.entries()) {
      try {
        await sinkFn(batch);
      } catch (err: any) {
        console.error(`[CLI Code Generator & Shell Completion Engine Adapter] Custom sink "${name}" error: ${err.message}`);
      }
    }
  }

  public getActiveHookNames(): string[] {
    return [
      ...this.preIngestMiddlewares.map(m => `pre:${m.name}`),
      ...this.postProcessMiddlewares.map(m => `post:${m.name}`),
      ...Array.from(this.customSinkAdapters.keys()).map(k => `sink:${k}`)
    ];
  }
}
