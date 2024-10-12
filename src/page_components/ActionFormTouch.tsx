import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import { useContext, useState } from "react";
import { Separator } from "@/components/ui/separator";
import ActionFormTouchCoordinate from "./ActionFormTouchCoordinate";
import ActionFormTouchXPath from "./ActionFormTouchXPath";
import ActionFormTouchText from "./ActionFormTouchText";
import ActionFormTouchImage from "./ActionFormTouchImage";
import { ActionContext } from "@/contexts/ActionContext";

export default function ActionFormTouch() {
  const { workflow, setWorkflow } = useContext(ActionContext);
  const action = workflow.data
  const subType = action.subType

  const handleTypeChange = (value: string) => {
    setWorkflow((prev: any) => ({...prev, data: {...prev.data, subType: value}}))
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
          <Select onValueChange={handleTypeChange}>
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
