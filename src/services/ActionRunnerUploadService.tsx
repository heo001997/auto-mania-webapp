import JSADBClient from "./JSADBClient";
import { Device } from "../types/Device";
import { RunnerData } from "../types/Runner";
import { templateMatchingWithNMS } from "./ImageFinder";
import { EnvService } from "./EnvService";

export default class ActionRunnerUploadService {
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
      const clientPath = this.action.clientPath;
      const mobilePath = this.action.mobilePath;

      if (!clientPath || !mobilePath) {
        return { success: false, error: "Both client path and mobile path must be specified" };
      }

      const clientPathValue = this.envService.parseVariables(clientPath.toString(), this.variableValueMap);
      const mobilePathValue = this.envService.parseVariables(mobilePath.toString(), this.variableValueMap);

      if (!clientPathValue || !mobilePathValue) {
        return { success: false, error: "Invalid paths after variable parsing" };
      }

      // Normalize path separators to forward slashes
      const normalizedClientPath = clientPathValue.replace(/\\/g, '/');
      let filePath = '';

      if (normalizedClientPath.includes('*')) {
        // Handle wildcard path
        let basePath, pattern;
        
        if (normalizedClientPath.endsWith('/*')) {
          basePath = normalizedClientPath.substring(0, normalizedClientPath.lastIndexOf('/'));
          pattern = '*';
        } else {
          const lastSlashIndex = normalizedClientPath.lastIndexOf('/');
          basePath = normalizedClientPath.substring(0, lastSlashIndex);
          pattern = normalizedClientPath.substring(lastSlashIndex + 1);
        }

        const { result } = await this.jsadb.listPaths(basePath);
        const paths = result.items;

        // Create regex pattern from the wildcard pattern
        const regexPattern = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');

        const matchingPaths = paths.filter((path: any) => {
          const normalizedFilePath = path.path.replace(/\\/g, '/');
          const fileName = normalizedFilePath.substring(normalizedFilePath.lastIndexOf('/') + 1);
          return regexPattern.test(fileName);
        });

        if (matchingPaths.length === 0) {
          return { success: false, error: "No matching files found" };
        }

        filePath = matchingPaths[0].path;
      } else {
        // Handle exact path
        const dirPath = normalizedClientPath.substring(0, normalizedClientPath.lastIndexOf('/'));
        const { result } = await this.jsadb.listPaths(dirPath);
        const paths = result.items;
        
        const normalizedPaths = paths.map((path: any) => path.path.replace(/\\/g, '/'));
        if (!normalizedPaths.includes(normalizedClientPath)) {
          return { success: false, error: "File not found" };
        }

        filePath = clientPathValue;
      }

      // Upload the file
      const uploadResult = await this.jsadb.uploadFile(filePath, mobilePathValue, this.device.id);
      if (!uploadResult.success) {
        return { success: false, error: uploadResult.error };
      }

      return { success: true, result: uploadResult.result };
    } catch (error) {
      console.error("Error running upload action: ", error);
      return { success: false, error: error };
    }
  }
}
