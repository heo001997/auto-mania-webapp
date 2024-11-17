import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { WorkflowContext } from "@/contexts/WorkflowContext";
import { useContext, useState } from "react";
import { EnvService } from "@/services/EnvService";
import { FlaskConical, Upload } from "lucide-react";
import JSADBClient from "@/services/JSADBClient";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function ActionFormUpload() {
  const { workflow, setWorkflow, currentActionId, runner, datasets } = useContext(WorkflowContext);
  const action = currentActionId ? workflow.data[currentActionId] : {}
  const actionData = action.data?.action || {}
  const [clientPath, setClientPath] = useState<string>(actionData.clientPath || '');
  const [mobilePath, setMobilePath] = useState<string>(() => {
    const defaultPath = '/sdcard/Download/AutoMania';
    if (!actionData.mobilePath) {
      setWorkflow((prev: any) => ({
        ...prev,
        data: {
          ...prev.data,
          [currentActionId]: {
            ...prev.data[currentActionId],
            data: {
              ...prev.data[currentActionId].data,
              action: {
                ...prev.data[currentActionId].data.action,
                mobilePath: defaultPath
              }
            }
          }
        }
      }));
    }
    return actionData.mobilePath || defaultPath;
  });
  const [sample, setSample] = useState<string>('');
  const device = useSelector((state: RootState) => state.devices.currentDevice);
  const jsadb = new JSADBClient();

  const handleClientPathChange = (value: string) => {
    setClientPath(value);
    setWorkflow((prev: any) => {
      return {
        ...prev, 
        data: {
          ...prev.data, [currentActionId]: {
            ...prev.data[currentActionId], data: {
              ...prev.data[currentActionId].data, 
              action: {
                ...prev.data[currentActionId].data.action,
                clientPath: value
              }
            }
          }
        }
      }
    })
  };

  const handleMobilePathChange = (value: string) => {
    setMobilePath(value);
    setWorkflow((prev: any) => {
      return {
        ...prev, 
        data: {
          ...prev.data, [currentActionId]: {
            ...prev.data[currentActionId], data: {
              ...prev.data[currentActionId].data, 
              action: {
                ...prev.data[currentActionId].data.action,
                mobilePath: value
              }
            }
          }
        }
      }
    })
  };

  const handleSampleClick = async () => {
    if (!clientPath || !mobilePath) {
      console.log('Both paths must be specified');
      return;
    }

    const envService = new EnvService();
    const datasetIdMap = envService.datasetIdMap(runner.data)
    const variableValueMap: Record<string, string> = envService.variableValueMap(runner.data, datasets, datasetIdMap);
    const clientPathValue = envService.parseVariables(clientPath, variableValueMap);
    const mobilePathValue = envService.parseVariables(mobilePath, variableValueMap);
    
    if (!clientPathValue || !mobilePathValue) {
      console.log('Invalid paths');
      return;
    }

    try {
      // Normalize path separators to forward slashes
      const normalizedClientPath = clientPathValue.replace(/\\/g, '/');
      
      if (normalizedClientPath.includes('*')) {
        // Handle wildcard path
        let basePath, pattern;
        
        if (normalizedClientPath.endsWith('/*')) {
          // Case: /path/to/dir/*
          basePath = normalizedClientPath.substring(0, normalizedClientPath.lastIndexOf('/'));
          pattern = '*';
        } else {
          // Case: /path/to/dir*
          const lastSlashIndex = normalizedClientPath.lastIndexOf('/');
          basePath = normalizedClientPath.substring(0, lastSlashIndex);
          pattern = normalizedClientPath.substring(lastSlashIndex + 1);
        }

        console.log('Base path:', basePath);
        console.log('Pattern:', pattern);

        const { result } = await jsadb.listPaths(basePath);
        const paths = result.items;
        console.log('Received paths:', paths);

        // Create regex pattern from the wildcard pattern
        const regexPattern = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
        console.log('Regex pattern:', regexPattern);

        const matchingPaths = paths.filter((path: any) => {
          const normalizedFilePath = path.path.replace(/\\/g, '/');
          const fileName = normalizedFilePath.substring(normalizedFilePath.lastIndexOf('/') + 1);
          console.log('Checking file:', fileName);
          const matches = regexPattern.test(fileName);
          console.log('Matches pattern:', matches);
          return matches;
        });

        console.log('Matching paths:', matchingPaths);

        if (matchingPaths.length > 0) {
          setSample(matchingPaths[0].path);
        } else {
          console.log('No matching paths found');
          setSample('');
        }
      } else {
        // Handle exact path
        const dirPath = normalizedClientPath.substring(0, normalizedClientPath.lastIndexOf('/'));
        const fileName = normalizedClientPath.substring(normalizedClientPath.lastIndexOf('/') + 1);
        console.log('Directory path:', dirPath);
        console.log('File name:', fileName);
        
        const { result } = await jsadb.listPaths(dirPath);
        const paths = result.items;
        console.log('Received paths:', paths);
        
        // Normalize the paths for comparison
        const normalizedPaths = paths.map((path: any) => path.path.replace(/\\/g, '/'));
        if (normalizedPaths.includes(normalizedClientPath)) {
          setSample(clientPathValue); // Use original path format
        } else {
          console.log('Path not found');
          setSample('');
        }
      }
    } catch (error) {
      console.error('Error checking paths:', error);
      setSample('');
    }
  };

  const handleUploadClick = async () => {
    if (!clientPath || !mobilePath) {
      console.log('Both paths must be specified');
      return;
    }

    const envService = new EnvService();
    const datasetIdMap = envService.datasetIdMap(runner.data)
    const variableValueMap: Record<string, string> = envService.variableValueMap(runner.data, datasets, datasetIdMap);
    const clientPathValue = envService.parseVariables(clientPath, variableValueMap);
    const mobilePathValue = envService.parseVariables(mobilePath, variableValueMap);
    
    if (!clientPathValue || !mobilePathValue) {
      console.log('Invalid paths');
      return;
    }

    try {
      const result = await jsadb.uploadFile(sample, mobilePathValue, device.id);
      if (result.success) {
        console.log('File uploaded successfully:', result.result);
      } else {
        console.error('Upload failed:', result.error);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <Separator className="mb-5" />
      <div className="flex gap-4 my-4 justify-between">
        <div className="flex flex-col gap-4 grow">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="client_path" className="text-right">
              Client Path
            </Label>
            <Input 
              id="client_path" 
              className="col-span-2"
              value={clientPath}
              onChange={(e) => handleClientPathChange(e.target.value)}
              placeholder="Enter client path"
            />
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 gap-2"
                onClick={handleSampleClick}
              >
                <FlaskConical className="h-3.5 w-5" />
                <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                  Sample
                </span>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mobile_path" className="text-right">
              Mobile Path
            </Label>
            <Input 
              id="mobile_path" 
              className="col-span-2"
              value={mobilePath}
              onChange={(e) => handleMobilePathChange(e.target.value)}
            />
            <div className="flex gap-2">
              <Button
                size="sm" 
                variant="outline" 
                className="h-8 gap-2"
                onClick={handleUploadClick}
              >
                <Upload className="h-3.5 w-5" />
                <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                  Upload
                </span>
              </Button>
            </div>
          </div>

          {sample && (
            <>
              <Separator />
              <div className="flex flex-col gap-2">
                <Label htmlFor="inspecting-element" className="pb-2">
                  Inspecting Element
                </Label>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sample" className="text-right">
                    Sample
                  </Label>
                  <Input
                    readOnly={true}
                    id="sample"
                    className="col-span-3"
                    value={sample}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

