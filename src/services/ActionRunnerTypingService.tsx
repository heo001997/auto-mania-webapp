import JSADBClient from "./JSADBClient";
import { Device } from "../types/Device";
import { RunnerData } from "../types/Runner";
import { templateMatchingWithNMS } from "./ImageFinder";
import { EnvService } from "./EnvService";

export default class ActionRunnerTypingService {
  private jsadb: JSADBClient;
  private action: object;
  private device: Device;
  private variableValueMap: Record<string, string>;
  private envService: EnvService;

  constructor(action: object, device: Device, variableValueMap: Record<string, string>) {
    this.jsadb = new JSADBClient();
    this.action = action;
    this.device = device;
    this.variableValueMap = variableValueMap;
    this.envService = new EnvService();
  }

  async execute(): Promise<{ success: boolean, result?: any, error?: any }> {
    try {
      const text = this.action.text;
      if (!text) throw new Error("No text provided for typing action");

      const textStr = text.toString();
      const textValue = this.envService.parseVariables(textStr, this.variableValueMap);
      if (!textValue) {
        return { success: false, result: 'Invalid Text' }
      }

      const result = await this.jsadb.type(textValue, this.device.id);
      console.log("Typing result:", result);
      return { success: true, result: result.result };
    } catch (error) {
      console.error("Error running input action: ", error);
      return { success: false, error: error };
    }
  }
}
