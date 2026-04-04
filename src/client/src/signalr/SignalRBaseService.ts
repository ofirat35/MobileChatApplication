import * as signalR from "@microsoft/signalr";
import { AuthStorage } from "../helpers/Auth/auth-storage";

export class SignalRBaseService {
  protected connection: signalR.HubConnection | null = null;
  private isStarting = false;

  protected async start(connectionUrl: string): Promise<void> {
    if (this.connection || this.isStarting) return;

    this.isStarting = true;

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(connectionUrl, {
        accessTokenFactory: async () => {
          const token = await AuthStorage.getAccessToken();
          return token ?? "";
        },
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.registerBaseEvents();
    this.registerEvents();

    await this.startInternal(connectionUrl);

    this.isStarting = false;
  }

  private async startInternal(connectionUrl: string) {
    try {
      await this.connection!.start();
      console.log("SignalR connected");
    } catch (err) {
      console.log("SignalR start error:", err);
      setTimeout(() => this.startInternal(connectionUrl), 5000);
    }
  }

  async stop(): Promise<void> {
    if (!this.connection) return;

    await this.connection.stop();
    this.connection = null;
  }

  protected async invoke(method: string, ...args: any[]) {
    if (!this.connection) return;

    if (this.connection.state !== signalR.HubConnectionState.Connected) return;

    try {
      return await this.connection.invoke(method, ...args);
    } catch (err) {
      console.log(`Invoke error: ${method}`, err);
    }
  }

  protected on(event: string, callback: (...args: any[]) => void) {
    this.connection?.on(event, callback);
  }

  protected off(event: string) {
    this.connection?.off(event);
  }

  protected registerEvents() {
    // 👈 override in child classes
  }

  private registerBaseEvents() {
    if (!this.connection) return;

    this.connection.onreconnecting((error) => {
      console.log("reconnecting...", error);
    });

    this.connection.onreconnected((id) => {
      console.log("reconnected:", id);
    });

    this.connection.onclose((error) => {
      console.log("closed:", error);
    });
  }

  protected isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }
}
