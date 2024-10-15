import JSADBClient from "./JSADBClient";
import { Device } from "../types/Device";
import { templateMatchingWithNMS } from "./ImageFinder";

export default class ActionRunnerTypingService {
  private jsadb: JSADBClient;
  private action: object;
  private device: Device;

  constructor(action: object, device: Device) {
    this.jsadb = new JSADBClient();
    this.action = action;
    this.device = device;
  }

  async execute(): Promise<{ success: boolean, result?: any, error?: any }> {
    try {
      const text = this.action.text;
      if (!text) throw new Error("No text provided for typing action");

      const result = await this.jsadb.type(text, this.device.id);
      console.log("Typing result:", result);
      return { success: true, result: result.result };
    } catch (error) {
      console.error("Error running input action: ", error);
      return { success: false, error: error };
    }
  }
}
