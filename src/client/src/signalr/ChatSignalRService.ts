import { MessageListModel } from "./../models/Messages/MessageListModel";
import { MessageCreateModel } from "../models/Messages/MessageCreateModel";
import { SignalRBaseService } from "./SignalRBaseService";
import { ChatListModel } from "../models/Chats/ChatListModel";

class ChatSignalRService extends SignalRBaseService {
  private messageListeners: ((message: MessageListModel) => void)[] = [];
  private deleteMsgListeners: ((message: MessageListModel) => void)[] = [];
  private deleteChatListeners: ((chats: ChatListModel[]) => void)[] = [];

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
      this.deleteMsgListeners.forEach((callback) => callback(message));
    });

    this.on("RemoveChat", (chats: ChatListModel[]) => {
      this.deleteChatListeners.forEach((callback) => callback(chats));
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

  subscribeToDeleteMessage(callback: (message: MessageListModel) => void) {
    this.deleteMsgListeners.push(callback);
    return () => {
      this.deleteMsgListeners = this.deleteMsgListeners.filter(
        (c) => c !== callback,
      );
    };
  }

  subscribeToDeleteChat(callback: (chats: ChatListModel[]) => void) {
    this.deleteChatListeners.push(callback);
    return () => {
      this.deleteChatListeners = this.deleteChatListeners.filter(
        (c) => c !== callback,
      );
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
