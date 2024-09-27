import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import { CirclePlus, RefreshCcw } from "lucide-react";
import { useState } from "react";
import ActionFormTouchCoordinate from "./ActionFormTouchCoordinate";
import ActionFormTouchXPath from "./ActionFormTouchXPath";
import ActionFormTouchText from "./ActionFormTouchText";
import ActionFormTouchImage from "./ActionFormTouchImage";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";


export default function ActionFormApk() {
  return (
    <div>
      <Separator className="mb-5" />
      <div className="flex gap-4 my-4 justify-between">
        <div className="flex flex-col gap-4 grow">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="content" className="text-right">
              Action
            </Label>
            <div className="flex gap-2 items-center justify-between w-full">
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a value" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="close">Close</SelectItem>
                    <SelectItem value="install">Install</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <Label htmlFor="humanize" className="text-right">
              Package name
            </Label>
            <Input id="package_name" />
          </div>
        </div>
      </div>
    </div>
  )
}