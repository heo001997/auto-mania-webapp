import JSADBClient from "./JSADBClient";
import { Device } from "../types/Device";
import { RunnerData } from "../types/Runner";
import { templateMatchingWithNMS } from "./ImageFinder";
import { EnvService } from "./EnvService";

export default class ActionRunnerSwipeService {
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
      const xStart = this.action.start?.x;
      const yStart = this.action.start?.y;
      const xEnd = this.action.end?.x;
      const yEnd = this.action.end?.y;
      const speed = this.action?.speed;
      if (!xStart || !yStart || !xEnd || !yEnd || !speed) throw new Error("Missing required swipe parameters");

      const textXStart = xStart.toString();
      const textYStart = yStart.toString();
      const textXEnd = xEnd.toString();
      const textYEnd = yEnd.toString();
      const textSpeed = speed.toString();

      const xStartValue = parseInt(this.envService.parseVariables(textXStart, this.variableValueMap));
      const yStartValue = parseInt(this.envService.parseVariables(textYStart, this.variableValueMap));
      const xEndValue = parseInt(this.envService.parseVariables(textXEnd, this.variableValueMap));
      const yEndValue = parseInt(this.envService.parseVariables(textYEnd, this.variableValueMap));
      const speedValue = parseInt(this.envService.parseVariables(textSpeed, this.variableValueMap));

      if (!xStartValue || !yStartValue || !xEndValue || !yEndValue || !speedValue) {
        return { success: false, result: 'Invalid swipe parameters' }
      }

      const result = await this.jsadb.swipe(xStartValue, yStartValue, xEndValue, yEndValue, speedValue, this.device.id);
      console.log("Swipe result:", result);
      return { success: true, result: result.result };
    } catch (error) {
      console.error("Error running input action: ", error);
      return { success: false, error: error };
    }
  }
}
