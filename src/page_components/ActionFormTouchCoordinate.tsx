import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import JSADBClient from "@/services/JSADBClient";
import { RootState } from "@/store";
import { RefreshCcw } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function ActionFormTouchCoordinate() {
  const [screencap, setScreencap] = useState<ReactNode>(null);
  const device = useSelector((state: RootState) => state.devices.currentDevice);
  const jsadb = new JSADBClient();

  const captureScreenshot = () => {
    jsadb.screenshot(device.id).then((data) => {
      setScreencap(
        <div style={{ width: '100%', height: '60vh', overflow: 'auto' }}>
          <img 
            src={`data:image/png;base64,${data.result}`} 
            alt="Device screenshot" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '100%', 
              width: 'auto', 
              height: 'auto', 
              objectFit: 'contain' 
            }}
          />
        </div>
      );
    });
  };

  useEffect(() => {
    captureScreenshot();
  }, []);

  return (
    <div className="flex gap-4 my-4 justify-between">
      <div className="min-w-[400px]">
        <div className="bg-gray-200 p-4 rounded-md flex justify-between items-center">
          <h3 className="text-lg font-medium">Screencap</h3>
          <Button size="sm" variant="outline" className="h-8 gap-2" onClick={captureScreenshot}>
            <RefreshCcw className="h-3.5 w-3.5" />
            <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
              Refresh
            </span>
          </Button>
        </div>
        <div>
          {screencap}
        </div>
      </div>
      <div className="flex flex-col gap-4 grow">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="x" className="text-right">
            X
          </Label>
          <Input
            id="x"
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="y" className="text-right">
            Y
          </Label>
          <Input
            id="y"
            className="col-span-3"
          />
        </div>
      </div>
    </div>
  )
}