import JSADBClient from "./JSADBClient";
import { Device } from "../types/Device";
import { templateMatchingWithNMS } from "./ImageFinder";

export default class ActionRunnerApkService {
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
      const packageName = this.action.packageName;
      const subType = this.action.subType;

      if (!packageName) throw new Error("No package name provided for apk action");

      if (subType === 'open') {
        const result = await this.jsadb.openApp(packageName, this.device.id);
        console.log("Apk open result:", result);
        return { success: true, result: result.result };
      } else {
        throw new Error("Invalid subType provided for apk action");
      }
    } catch (error) {
      console.error("Error running input action: ", error);
      return { success: false, error: error };
    }
  }
}
