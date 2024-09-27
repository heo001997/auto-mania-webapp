import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import { CircleMinus, CirclePlus, PlusIcon, RefreshCcw } from "lucide-react";
import { useState } from "react";
import ActionFormTouchCoordinate from "./ActionFormTouchCoordinate";
import ActionFormTouchXPath from "./ActionFormTouchXPath";
import ActionFormTouchText from "./ActionFormTouchText";
import ActionFormTouchImage from "./ActionFormTouchImage";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";


export default function ActionFormProcessData() {
  return (
    <div>
      <Separator className="mb-5" />
      <div className="flex gap-4 my-4 justify-between">
        <div className="flex flex-col gap-4 grow">
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="flex gap-2 items-center justify-between w-full">
              <Button>
                <CircleMinus />
              </Button>
              <Label htmlFor="humanize" className="text-right">
                Variable
              </Label>
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a variable" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="varA">Var A</SelectItem>
                  <SelectItem value="varB">Var B</SelectItem>
                  <SelectItem value="varC">Var C</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Label htmlFor="content" className="text-right">
              Set value to
            </Label>
            <div className="flex gap-2 items-center justify-between w-full">
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a value" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="previous">Previous</SelectItem>
                    <SelectItem value="next">Next</SelectItem>
                    <SelectItem value="equal">Equal</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button>
                <CirclePlus />
              </Button>
            </div>
          </div>
          <Separator className="my-2" />
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="flex gap-2 items-center justify-between w-full">
              <Button>
                <CircleMinus />
              </Button>
              <Label htmlFor="humanize" className="text-right">
                Variable
              </Label>
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a variable" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="varA">Var A</SelectItem>
                  <SelectItem value="varB">Var B</SelectItem>
                  <SelectItem value="varC">Var C</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Label htmlFor="content" className="text-right">
              Set value to
            </Label>
            <div className="flex gap-2 items-center justify-between w-full">
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a value" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="previous">Previous</SelectItem>
                    <SelectItem value="next">Next</SelectItem>
                    <SelectItem value="equal">Equal</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button>
                <CirclePlus />
              </Button>
            </div>
          </div>
          <Separator className="my-2" />
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="flex gap-2 items-center justify-between w-full">
              <Button>
                <CircleMinus />
              </Button>
              <Label htmlFor="humanize" className="text-right">
                Variable
              </Label>
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a variable" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="varA">Var A</SelectItem>
                  <SelectItem value="varB">Var B</SelectItem>
                  <SelectItem value="varC">Var C</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Label htmlFor="content" className="text-right">
              Set value to
            </Label>
            <div className="flex gap-2 items-center justify-between w-full">
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a value" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="previous">Previous</SelectItem>
                    <SelectItem value="next">Next</SelectItem>
                    <SelectItem value="equal">Equal</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button>
                <CirclePlus />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}