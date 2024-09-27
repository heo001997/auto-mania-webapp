import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";

export default function ActionFormTouchText() {
  return (
    <div className="flex gap-4 my-4 justify-between">
      <div className="min-w-[400px]">
        <div className="bg-gray-200 p-4 rounded-md flex justify-between items-center">
          <h3 className="text-lg font-medium">Screencap</h3>
          <Button size="sm" variant="outline" className="h-8 gap-2">
            <RefreshCcw className="h-3.5 w-3.5" />
            <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
              Refresh
            </span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-4 grow">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="text" className="text-right">
            Text
          </Label>
          <Input
            id="text"
            className="col-span-3"
          />
        </div>
      </div>
    </div>
  )
}