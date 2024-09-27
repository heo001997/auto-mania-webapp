import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";
import ActionFormTouchCoordinate from "./ActionFormTouchCoordinate";
import ActionFormTouchXPath from "./ActionFormTouchXPath";
import ActionFormTouchText from "./ActionFormTouchText";
import ActionFormTouchImage from "./ActionFormTouchImage";
import { Separator } from "@/components/ui/separator";


export default function ActionFormTouch() {
  const [type, setType] = useState<string>('')

  const handleTypeChange = (value: string) => {
    setType(value)
  }

  const displayForm = type === 'coordinate' ? <ActionFormTouchCoordinate /> : 
    type === 'xpath' ? <ActionFormTouchXPath /> :
    type === 'text' ? <ActionFormTouchText /> :
    type === 'image' ? <ActionFormTouchImage /> : null

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
              <SelectValue placeholder="Select a type" />
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