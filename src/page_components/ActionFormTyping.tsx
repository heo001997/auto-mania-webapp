import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FlaskConical, ScanEye, SendHorizonal, X } from "lucide-react";
import { useContext, useState } from "react";
import JSADBClient from "@/services/JSADBClient";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { WorkflowContext } from "@/contexts/WorkflowContext";

export default function ActionFormTyping() {
  const { workflow, setWorkflow, currentActionId } = useContext(WorkflowContext);
  const action = currentActionId ? workflow.data[currentActionId] : {}
  const actionData = action.data?.action || {}
  const [text, setText] = useState<string>(actionData.text || '');
  const [sample, setSample] = useState<string>('');
  const [current, setCurrent] = useState<string>('');
  const device = useSelector((state: RootState) => state.devices.currentDevice);
  const jsadb = new JSADBClient();

  const handleSendClick = async () => {
    if (device && text) {
      try {
        const result = await jsadb.type(text, device.id);
        console.log("Type result:", result);
      } catch (error) {
        console.error("Error typing text:", error);
      }
    }
  };

  const handleCurrentTextClick = async () => {
    if (device) {
      try {
        const { result } = await jsadb.getCurrentInputText(device.id);
        console.log("Current text:", result);
        setCurrent(result); // Change this line
      } catch (error) {
        console.error("Error getting current input text:", error);
      }
    }
  };

  const handleSampleClick = async () => {
    if (device && text) setSample(text);
  };

  const handleClearTextClick = async () => {
    if (device) {
      try {
        const result = await jsadb.clearCurrentInput(device.id);
        if (result.success) {
          console.log("Text cleared successfully:", result.result);
          setCurrent('');
          setSample('');
        } else {
          console.error("Failed to clear current input:", result.error);
        }
      } catch (error) {
        console.error("Error clearing text:", error);
      }
    }
  };

  function handleTextChange(value: string): void {
    setText(value);
    setWorkflow((prev: any) => {
      return {
        ...prev, 
        data: {
          ...prev.data, [currentActionId]: {
            ...prev.data[currentActionId], data: {
              ...prev.data[currentActionId].data, 
              action: {
                ...prev.data[currentActionId].data.action,
                text: value
              }
            }
          }
        }
      }
    })
  }

  return (
    <div>
      <Separator className="mb-5" />
      <div className="flex flex-col gap-4 grow">
        <div className="flex flex-col gap-2">
          <Label className="pb-2">
            Action Properties
          </Label>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="element-text" className="text-right">
              Text
            </Label>
            <Textarea
              id="element-text"
              className="col-span-2 min-h-[150px]"
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
            />
            <div className="self-start flex flex-col gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="col-span-1 h-8 gap-2 w-full"
                onClick={handleSendClick}
              >
                <SendHorizonal className="h-3.5 w-5" />
                <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                Send
                </span>
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="col-span-1 h-8 gap-2 w-full"
                onClick={handleSampleClick}
              >
                <FlaskConical className="h-3.5 w-5" />
                <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                  Sample
                </span>
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="col-span-1 h-8 gap-2 w-full"
                onClick={handleCurrentTextClick}
              >
                <ScanEye className="h-3.5 w-5" />
                <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                  Current
                </span>
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="col-span-1 h-8 gap-2 w-full"
                onClick={handleClearTextClick}
              >
                <X className="h-3.5 w-5" />
                <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                  Clear
                </span>
              </Button>
            </div>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-2">
          <Label htmlFor="inspecting-element" className="pb-2">
            Inspecting Element
          </Label>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sample" className="text-right">
              Sample
            </Label>
            <Textarea
              readOnly={true}
              id="sample"
              className="col-span-3 min-h-[150px]"
              value={sample}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="current" className="text-right">
              Current
            </Label>
            <Textarea
              readOnly={true}
              id="current"
              className="col-span-3 min-h-[150px]"
              value={current}
            />
          </div>
        </div>
      </div>
    </div>
  )
}