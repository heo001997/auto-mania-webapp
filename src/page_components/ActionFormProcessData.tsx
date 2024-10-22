import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import { CircleMinus, CirclePlus, PlusIcon, RefreshCcw } from "lucide-react";
import { useContext, useState } from "react";
import ActionFormTouchCoordinate from "./ActionFormTouchCoordinate";
import ActionFormTouchXPath from "./ActionFormTouchXPath";
import ActionFormTouchText from "./ActionFormTouchText";
import ActionFormTouchImage from "./ActionFormTouchImage";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { RunnerData } from "@/types/Runner";
import { WorkflowContext } from "@/contexts/WorkflowContext";


export default function ActionFormProcessData() {
  const { workflow, setWorkflow, currentActionId } = useContext(WorkflowContext);
  const action = currentActionId ? workflow.data[currentActionId] : {}
  const actionData = action.data?.action || {}
  const [runnerData, setRunnerData] = useState<RunnerData[]>(actionData.data || [{
    variable: "",
    type: "",
    value: ""
  }]);

  const handleRemoveRunnerData = (index: number) => {
    if (index > 0) {
      setRunnerData(runnerData.filter((_, i) => i !== index));
      setWorkflow((prev: any) => {
        return {
          ...prev,
          data: {
            ...prev.data, 
            [currentActionId]: { 
              ...prev.data[currentActionId], 
              data: { 
                ...prev.data[currentActionId].data, 
                action: { ...actionData, data: runnerData.filter((_, i) => i !== index) } 
              } 
            }
          }
        }
      });
    }
  }

  const handleVariableChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newRunnerData = [...runnerData];
    newRunnerData[index].variable = e.target.value;
    setRunnerData(newRunnerData);
    setWorkflow((prev: any) => {
      return {
        ...prev,
        data: {
          ...prev.data, 
          [currentActionId]: {
            ...prev.data[currentActionId], 
            data: {
              ...prev.data[currentActionId].data, 
              action: { ...actionData, data: newRunnerData }
            }
          }
        }
      }
    });
  }

  const handleTypeChange = (index: number) => (value: string) => {
    const newRunnerData = [...runnerData];
    newRunnerData[index].type = value;
    newRunnerData[index].value = "";
    setRunnerData(newRunnerData);
    setWorkflow((prev: any) => {
      return {
        ...prev,
        data: {
          ...prev.data, 
          [currentActionId]: {
            ...prev.data[currentActionId], 
            data: {
              ...prev.data[currentActionId].data, 
              action: { ...actionData, data: newRunnerData }
            }
          }
        }
      }
    });
  }

  const handleValueChange = (value: string, index: number) => {
    const newRunnerData = [...runnerData];
    newRunnerData[index].value = value;
    setRunnerData(newRunnerData);
    setWorkflow((prev: any) => {
      return {
        ...prev,
        data: {
          ...prev.data, 
          [currentActionId]: {
            ...prev.data[currentActionId], 
            data: {
              ...prev.data[currentActionId].data, 
              action: { ...actionData, data: newRunnerData }
            }
          }
        }
      }
    });
  }

  const handleAddRunnerData = (index: number) => {
    const newRunnerData = [...runnerData];
    newRunnerData.push({
      variable: "",
      type: "",
      value: ""
    });
    setRunnerData(newRunnerData);
    setWorkflow((prev: any) => {
      return {
        ...prev,
        data: {
          ...prev.data, 
          [currentActionId]: {
            ...prev.data[currentActionId], 
            data: {
              ...prev.data[currentActionId].data, 
              action: { ...actionData, data: newRunnerData }
            }
          }
        }
      }
    });
  }

  const handleDatasetValueChange = (index: number) => (value: string) => {
    const newRunnerData = [...runnerData];
    newRunnerData[index].value = value;
    setRunnerData(newRunnerData);
    setWorkflow((prev: any) => {
      return {
        ...prev,
        data: {
          ...prev.data, 
          [currentActionId]: {
            ...prev.data[currentActionId], 
            data: {
              ...prev.data[currentActionId].data, 
              action: { ...actionData, data: newRunnerData }
            }
          }
        }
      }
    });
  }

  return (
    <div>
      <Separator className="mb-5" />
      <div className="flex gap-4 my-4 justify-between">
        <div className="flex flex-col gap-6 grow">
          <div className="flex items-center gap-2">
            <Label className="text-md">
              Structure
            </Label>
          </div>
          {runnerData.map((currRunnerData, index) => {
            return <div className="flex items-center justify-between gap-4" key={index}>
              <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 h-8">
                    <Button className="min-w-8 min-h-8 p-1" onClick={() => handleRemoveRunnerData(index)}>
                      <CircleMinus className="min-w-4 min-h-4" />
                    </Button>
                    <Label className="text-right">
                      Variable
                    </Label>
                    <div className="flex items-center gap-2 min-w-28">
                      <Input
                        id="variable"
                        value={currRunnerData.variable}
                        onChange={(e) => handleVariableChange(e, index)}
                        pattern="[a-zA-Z0-9.]*"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 h-8">
                    <Label className="text-right">
                      Type
                    </Label>
                    <div className="flex items-center gap-2">
                      <Select value={currRunnerData.type} onValueChange={handleTypeChange(index)}>
                        <SelectTrigger className="min-w-[200px]">
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="dataset">Dataset</SelectItem>
                            <SelectItem value="static">Static</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 h-8">
                    <Label className="text-right">
                      Value
                    </Label>
                    {
                      (currRunnerData.type === "dataset" || currRunnerData.type === "") &&
                      <div className="flex items-center gap-2">
                        <Select value={currRunnerData.value} onValueChange={handleDatasetValueChange(index)}>
                          <SelectTrigger className="min-w-[200px]">
                            <SelectValue placeholder="Select a value" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="next">Next</SelectItem>
                              <SelectItem value="previous">Previous</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    }
                    {
                      (currRunnerData.type === "static" || currRunnerData.type === "javascript" || currRunnerData.type === "variable") &&
                      <div className="flex items-center gap-2 min-w-[200px] max-h-[50px]">
                        <Textarea
                          id="value"
                          className="max-h-[50px]"
                          value={currRunnerData.value}
                          onChange={(e) => handleValueChange(e.target.value, index)}
                        />
                      </div>
                    }
                    <Button className="min-w-8 min-h-8 p-1" onClick={() => handleAddRunnerData(index)}>
                      <CirclePlus className="min-w-4 min-h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            })
          }
        </div>
      </div>
    </div>
  )
}