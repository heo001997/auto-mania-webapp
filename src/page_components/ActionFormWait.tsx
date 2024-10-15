import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { WorkflowContext } from "@/contexts/WorkflowContext";
import { useContext, useState } from "react";

export default function ActionFormWait() {
  const { workflow, setWorkflow, currentActionId } = useContext(WorkflowContext);
  const action = currentActionId ? workflow.data[currentActionId] : {}
  const actionData = action.data?.action || {}
  const [sleepTime, setSleepTime] = useState<string>(actionData.sleepTime || '');

  const handleSleepTimeChange = (value: string) => {
    setSleepTime(value);
    setWorkflow((prev: any) => {
      return {
        ...prev, 
        data: {
          ...prev.data, [currentActionId]: {
            ...prev.data[currentActionId], data: {
              ...prev.data[currentActionId].data, 
              action: {
                ...prev.data[currentActionId].data.action,
                sleepTime: value
              }
            }
          }
        }
      }
    })
  };

  return (
    <div>
      <Separator className="mb-5" />
      <div className="flex gap-4 my-4 justify-between">
        <div className="flex flex-col gap-4 grow">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sleep_time" className="text-right">
              Sleep time (ms)
            </Label>
            <Input 
              id="sleep_time" 
              className="col-span-2"
              value={sleepTime}
              onChange={(e) => handleSleepTimeChange(e.target.value)}
              placeholder="Enter sleep time in milliseconds"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
