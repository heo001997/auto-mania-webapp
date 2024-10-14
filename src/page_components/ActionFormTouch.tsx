import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import { useContext, useState } from "react";
import { Separator } from "@/components/ui/separator";
import ActionFormTouchCoordinate from "./ActionFormTouchCoordinate";
import ActionFormTouchXPath from "./ActionFormTouchXPath";
import ActionFormTouchText from "./ActionFormTouchText";
import ActionFormTouchImage from "./ActionFormTouchImage";
import { WorkflowContext } from "@/contexts/WorkflowContext";

export default function ActionFormTouch() {
  const { workflow, setWorkflow, currentActionId } = useContext(WorkflowContext);
  const action = currentActionId ? workflow.data[currentActionId] : {}
  const actionData = action.data?.action || {}
  const subType = actionData.subType || ""

  const handleTypeChange = (value: string) => {
    setWorkflow((prev: any) => {
      return {
        ...prev,
        data: {
          ...prev.data, [currentActionId]: {
            ...prev.data[currentActionId], data: {
              ...prev.data[currentActionId].data, action: {
                ...prev.data[currentActionId].data.action, subType: value
              }
            }
          }
        }
      }
    })
  }

  const displayForm = subType === 'coordinate' ? <ActionFormTouchCoordinate /> :
    subType === 'xpath' ? <ActionFormTouchXPath /> :
    subType === 'text' ? <ActionFormTouchText /> :
    subType === 'image' ? <ActionFormTouchImage /> : null

  return (
    <div>
      <Separator className="mb-5" />
      <div className="w-full flex flex-col gap-4 items-center">
        <div className="flex items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Type
          </Label>
          <Select onValueChange={handleTypeChange} value={subType || ""}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a sub type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="coordinate">Coordinate</SelectItem>
                <SelectItem value="xpath">XPath</SelectItem>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="image">Image</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Separator className="my-1" />
      </div>
      {displayForm}
    </div>
  )
}
