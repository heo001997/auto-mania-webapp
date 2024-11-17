import { Device } from "../types/Device";
import ActionRunnerTouchService from "./ActionRunnerTouchService";
import ActionRunnerApkService from "./ActionRunnerApkService";
import ActionRunnerTypingService from "./ActionRunnerTypingService";
import ActionRunnerPressService from "./ActionRunnerPressService";
import ActionRunnerSwipeService from "./ActionRunnerSwipeService";
import ActionRunnerUploadService from "./ActionRunnerUploadService";

export default class ActionRunnerService {
  private action: object;
  private device: Device;
  private variableValueMap: Record<string, string>;

  constructor(action: object, device: Device, variableValueMap: Record<string, string>) {
    this.action = action;
    this.device = device;
    this.variableValueMap = variableValueMap;
  }

  async execute(): Promise<{ success: boolean, result?: any, error?: any }> {
    try {
      const actionType = this.action.type
      console.log("defaultWait: ", this.variableValueMap.defaultWait)
      await this.waitService(this.variableValueMap.defaultWait);

      let service;
      let serviceResult;
      if (actionType === 'touch') {
        service = new ActionRunnerTouchService(this.action, this.device, this.variableValueMap);
        serviceResult = await service.execute();
      } else if (actionType === 'swipe') {
        service = new ActionRunnerSwipeService(this.action, this.device, this.variableValueMap);
        serviceResult = await service.execute();
      } else if (actionType === 'typing') {
        service = new ActionRunnerTypingService(this.action, this.device, this.variableValueMap);
        serviceResult = await service.execute();
      } else if (actionType === 'upload') {
        service = new ActionRunnerUploadService(this.action, this.device, this.variableValueMap);
        serviceResult = await service.execute();
      } else if (actionType === 'press') {
        service = new ActionRunnerPressService(this.action, this.device);
        serviceResult = await service.execute();
      } else if (actionType === 'apk') {
        service = new ActionRunnerApkService(this.action, this.device);
        serviceResult = await service.execute();
      } else if (actionType === 'wait') {
        serviceResult = await this.waitService(this.action.sleepTime);
      } else {
        throw new Error('Invalid action type');
      }
      
      const { success, result, error } = serviceResult;
      return { success, result, error }
    } catch (error) {
      console.error("Unexpected error in ActionRunnerService: ", error);
      return { success: false, error: error };
    }
  }

  private async waitService(time: string): Promise<{ success: boolean }> {
    const sleepTime = parseInt(time);
    console.log("start wait: ", sleepTime)
    if (isNaN(sleepTime) || sleepTime < 0) {
      throw new Error('Invalid sleep time for wait action');
    }
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), sleepTime));
  }
}
