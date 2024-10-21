import JSADBClient from "./JSADBClient";
import { Device } from "../types/Device";
import { RunnerData } from "../types/Runner";
import { templateMatchingWithNMS } from "./ImageFinder";
import { EnvService } from "./EnvService";

export default class ActionRunnerTouchService {
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

  async execute(): Promise<any> {
    try {
      const subType = this.action.subType;

      switch (subType) {
        case 'coordinate':
          return await this.touchByCoordinate();
        case 'xpath':
          return await this.touchByXPath();
        case 'text':
          return await this.touchByText();
        case 'image':
          return await this.touchByImage();
        default:
          throw new Error('Invalid action subType for tap operation');
      }
    } catch (error) {
      console.error("Unexpected error in ActionRunnerTouchService: ", error);
      return { success: false, error: error }
    }
  }

  private async touchByCoordinate(): Promise<{ success: boolean, result?: any, error?: any }> {
    const { x, y } = this.action;
    const xStr = x.toString();
    const yStr = y.toString();

    const xParsed = this.envService.parseVariables(xStr, this.variableValueMap);
    const yParsed = this.envService.parseVariables(yStr, this.variableValueMap);

    const xValue = Number(this.envService.parseVariables(xParsed, this.variableValueMap));
    const yValue = Number(this.envService.parseVariables(yParsed, this.variableValueMap));

    if (isNaN(xValue) || isNaN(yValue)) {
      return { success: false, result: 'Invalid coordinate values' }
    }

    const tapResult = await this.jsadb.tap(xValue, yValue, this.device.id);

    return { success: true, result: tapResult.result }
  }

  private async touchByXPath(): Promise<{ success: boolean, result?: any, error?: any }> {
    const xpath = this.action.xpath;

    const xpathStr = xpath.toString();
    const xpathValue = this.envService.parseVariables(xpathStr, this.variableValueMap);
    if (!xpathValue) {
      return { success: false, result: 'Invalid XPath' }
    }

    const { success, result, error } = await this.touchByNodeFinder(xpathValue, 'XPath');

    return { success, result, error }
  }

  private async touchByText(): Promise<{ success: boolean, result?: any, error?: any }> {
    const text = this.action.text;

    const textStr = text.toString();
    const textValue = this.envService.parseVariables(textStr, this.variableValueMap);
    if (!textValue) {
      return { success: false, result: 'Invalid Text' }
    }

    const XText = `//node[translate(@text,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz") = "${textValue.toLowerCase()}"]`;
    const { success, result, error } = await this.touchByNodeFinder(XText, 'text');

    return { success, result, error }
  }

  private async touchByNodeFinder(selector: string, selectorType: string): Promise<{ success: boolean, result?: any, error?: any }> {
    try {
      const { result } = await this.jsadb.findNodeByXPath(selector, this.device.id);
      if (result) {
        const { centerX, centerY } = this.calculateNodeCenter(result.bounds);
        const tapResult = await this.jsadb.tap(centerX, centerY, this.device.id);
        return { success: true, result: tapResult.result }
      }
      return { success: false, result: `Unable to find element with the given ${selectorType}` }
    } catch (error) {
      console.error(`Error finding node by ${selectorType}:`, error);
      return { success: false, error: error }
    }
  }

  private calculateNodeCenter(bounds: string): { centerX: number, centerY: number } {
    const boundsMatch = bounds.match(/\[(\d+),(\d+)\]\[(\d+),(\d+)\]/);
    if (boundsMatch) {
      const [, left, top, right, bottom] = boundsMatch.map(Number);
      return {
        centerX: Math.round((left + right) / 2),
        centerY: Math.round((top + bottom) / 2)
      };
    }
    throw new Error('Invalid bounds format');
  }

  private async touchByImage(): Promise<{ success: boolean, result?: any, error?: any }> {
    const { image: targetImage, area: searchArea } = this.action;

    try {
      const targetDimensions = await this.getImageDimensions(targetImage);
      const screenshotDataUrl = await this.captureScreenshot();
      const results = await this.performTemplateMatching(screenshotDataUrl, targetImage, searchArea);

      if (results.length > 0) {
        const match = results[0];
        const centerX = Math.round(match.x + targetDimensions.width / 2);
        const centerY = Math.round(match.y + targetDimensions.height / 2);
        const tapResult = await this.jsadb.tap(centerX, centerY, this.device.id);
        return { success: true, result: tapResult.result }
      } else {
        return { success: false, result: 'Unable to find the target image on the screen' }
      }
    } catch (error) {
      console.error("Error in image-based touch:", error);
      return { success: false, error: error }
    }
  }

  private async getImageDimensions(imageSrc: string): Promise<{ width: number, height: number }> {
    // Convert base64 to Blob
    const base64Response = await fetch(imageSrc);
    const blob = await base64Response.blob();

    // Create ImageBitmap
    const bitmap = await createImageBitmap(blob);

    return { width: bitmap.width, height: bitmap.height };
  }

  private async captureScreenshot(): Promise<string> {
    const { result: screenshotBase64 } = await this.jsadb.screenshot(this.device.id);
    return `data:image/png;base64,${screenshotBase64}`;
  }

  private async performTemplateMatching(
    screenshotDataUrl: string,
    targetImage: string,
    searchArea: any
  ): Promise<any[]> {
    return templateMatchingWithNMS(
      screenshotDataUrl,
      targetImage,
      1, // matching numbers
      0.8, // threshold
      searchArea || null
    );
  }

}
