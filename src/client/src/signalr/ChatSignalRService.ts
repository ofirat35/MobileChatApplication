import { MessageCreateModel } from "../models/Messages/MessageCreateModel";
import { MessageListModel } from "../models/Messages/MessageListModel";
import { SignalRBaseService } from "./SignalRBaseService";

class ChatSignalRService extends SignalRBaseService {
  private messageListeners: ((message: MessageListModel) => void)[] = [];
  private deleteListeners: ((messageId: string) => void)[] = [];

  async init() {
    this.registerEvents();
    await this.start("http://10.0.2.2:5000/hubs/chatHub");
  }
  async heartbeat() {
    return this.invoke("Heartbeat");
  }
  async setBackground() {
    return this.invoke("AppWentBackground");
  }

  registerEvents() {
    this.on("ReceiveMessage", (message) => {
      this.messageListeners.forEach((callback) => callback(message));
    });

    this.on("RemoveMessage", (message) => {
      this.deleteListeners.forEach((callback) => callback(message));
    });
  }

  subscribeToMessages(callback: (message: MessageListModel) => void) {
    this.messageListeners.push(callback);
    return () => {
      this.messageListeners = this.messageListeners.filter(
        (c) => c !== callback,
      );
    };
  }

  subscribeToDelete(callback: (messageId: string) => void) {
    this.deleteListeners.push(callback);
    return () => {
      this.deleteListeners = this.deleteListeners.filter((c) => c !== callback);
    };
  }

  async sendMessageAsync(message: MessageCreateModel) {
    return this.invoke("SendMessageAsync", message);
  }
  async RemoveMessageAsync(messageId: string) {
    return this.invoke("RemoveMessageAsync", messageId);
  }
}

export const chatSignalRService = new ChatSignalRService();
