import { SignalRBaseService } from "./SignalRBaseService";

class PresenceService extends SignalRBaseService {
  async init() {
    await this.start("http://10.0.2.2:5000/hubs/presenceHub");
  }
  async heartbeat() {
    return this.invoke("Heartbeat");
  }
  async setBackground() {
    return this.invoke("AppWentBackground");
  }
}

export const presenceService = new PresenceService();
