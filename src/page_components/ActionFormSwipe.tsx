import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import { RefreshCcw } from "lucide-react";

export default function ActionFormSwipe() {
  return (
    <div className="flex gap-4">
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
      <div className="w-full flex flex-col gap-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Type
          </Label>
          <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select an action" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="touch">Touch</SelectItem>
                  <SelectItem value="typing">Typing</SelectItem>
                  <SelectItem value="swipe">Swipe</SelectItem>
                  <SelectItem value="openApk">Open APK</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="username" className="text-right">
            XPath
          </Label>
          <Input
            id="xpath"
            className="col-span-3"
          />
        </div>
      </div>
    </div>
  )
}