import JSADBClient from "./JSADBClient";
import { Device } from "../types/Device";
import { templateMatchingWithNMS } from "./ImageFinder";

export default class ActionRunnerService {
  private jsadb: JSADBClient;
  private action: object;
  private device: Device;

  constructor(action: object, device: Device) {
    this.jsadb = new JSADBClient();
    this.action = action;
    this.device = device;
  }

  async execute(): Promise<any> {
    if (this.action.type === 'touch') {
      return this.touch();
    } else if (this.action.type === 'input') {
      return this.input();
    } else {
      throw new Error('Invalid action type');
    }
  }

  async touch(): Promise<any> {
    const subType = this.action.subType;

    if (subType === 'coordinate') {
      const x = this.action.x;
      const y = this.action.y;

      return this.jsadb.tap(x, y, this.device.id);
    } else if (subType === 'xpath') {
      const xpath = this.action.xpath;

      try {
        const { result } = await this.jsadb.findNodeByXPath(xpath, this.device.id);
        if (result) {
          const boundsMatch = result.bounds.match(/\[(\d+),(\d+)\]\[(\d+),(\d+)\]/);
          if (boundsMatch) {
            const left = parseInt(boundsMatch[1]);
            const top = parseInt(boundsMatch[2]);
            const right = parseInt(boundsMatch[3]);
            const bottom = parseInt(boundsMatch[4]);

            const centerX = Math.round((left + right) / 2);
            const centerY = Math.round((top + bottom) / 2);

            return this.jsadb.tap(centerX, centerY, this.device.id);
          }
        }
        throw new Error('Unable to find element with the given XPath');
      } catch (error) {
        console.error("Error finding node by XPath:", error);
        throw error;
      }
    } else if (subType === 'text') {
      const text = this.action.text;
      
      try {
        const XText = `//node[translate(@text,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz") = "${text.toLowerCase()}"]`;
        const { result } = await this.jsadb.findNodeByXPath(XText, this.device.id);
        
        if (result) {
          const boundsMatch = result.bounds.match(/\[(\d+),(\d+)\]\[(\d+),(\d+)\]/);
          if (boundsMatch) {
            const left = parseInt(boundsMatch[1]);
            const top = parseInt(boundsMatch[2]);
            const right = parseInt(boundsMatch[3]);
            const bottom = parseInt(boundsMatch[4]);

            const centerX = Math.round((left + right) / 2);
            const centerY = Math.round((top + bottom) / 2);

            return this.jsadb.tap(centerX, centerY, this.device.id);
          }
        }
        throw new Error('Unable to find element with the given text');
      } catch (error) {
        console.error("Error finding node by text:", error);
        throw error;
      }
    } else if (subType === 'image') {
      const targetImage = this.action.image;
      const searchArea = this.action.area;

      try {
        // Get dimensions of the target image
        const img = new Image();
        img.src = targetImage;
        await new Promise((resolve) => { img.onload = resolve; });
        const targetWidth = img.width;
        const targetHeight = img.height;

        // Capture the latest screenshot
        const { result: screenshotBase64 } = await this.jsadb.screenshot(this.device.id);
        const screenshotDataUrl = `data:image/png;base64,${screenshotBase64}`;

        // Perform template matching
        const results = await templateMatchingWithNMS(
          screenshotDataUrl,
          targetImage,
          1, // matching numbers
          0.8, // threshold
          searchArea || null
        );

        if (results.length > 0) {
          const match = results[0];
          const centerX = Math.round(match.x + targetWidth / 2);
          const centerY = Math.round(match.y + targetHeight / 2);

          return this.jsadb.tap(centerX, centerY, this.device.id);
        } else {
          throw new Error('Unable to find the target image on the screen');
        }
      } catch (error) {
        console.error("Error in image-based touch:", error);
        throw error;
      }
    } else {
      throw new Error('Invalid action subType for tap operation');
    }
  }

  async input(): Promise<any> {
    if (action.data.action.type !== 'input') throw new Error('Invalid action type for input operation');

    if (action.data.action.subType === 'text') {
      const text = action.data.action.text;
      return this.jsadb.input(text, device.id);
    } else {
      throw new Error('Invalid action subType for input operation');
    }
  }
}
