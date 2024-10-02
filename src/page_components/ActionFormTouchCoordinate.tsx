import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import JSADBClient from "@/services/JSADBClient";
import { RootState } from "@/store";
import { RefreshCcw } from "lucide-react";
import { ReactNode, useEffect, useState, useRef, MouseEvent } from "react";
import { useSelector } from "react-redux";

export default function ActionFormTouchCoordinate() {
  const [screencapSrc, setScreencapSrc] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [savedCoordinates, setSavedCoordinates] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);
  const device = useSelector((state: RootState) => state.devices.currentDevice);
  const jsadb = new JSADBClient();

  const handleMouseMove = (e: MouseEvent<HTMLImageElement>) => {
    if (imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect();
      const x = Math.round((e.clientX - rect.left) * (imageDimensions.width / rect.width));
      const y = Math.round((e.clientY - rect.top) * (imageDimensions.height / rect.height));
      setCoordinates({ x, y });
    }
  };

  const captureScreenshot = () => {
    jsadb.screenshot(device.id).then((data) => {
      setScreencapSrc(`data:image/png;base64,${data.result}`);
    });
  };

  useEffect(() => {
    captureScreenshot();
  }, []);

  const handleImageClick = () => {
    setSavedCoordinates(coordinates);
  };

  const handleImageLoad = () => {
    if (imgRef.current) {
      setImageDimensions({
        width: imgRef.current.naturalWidth,
        height: imgRef.current.naturalHeight
      });
    }
  };

  return (
    <div className="flex gap-4 my-4 justify-between">
      <div className="min-w-[450px] max-w-[450px]">
        <div className="bg-gray-200 p-4 rounded-md flex justify-between items-center">
          <h3 className="text-lg font-medium">Screencap</h3>
          <div className="text-sm font-medium">
            X: {coordinates.x}, Y: {coordinates.y}
          </div>
          <Button size="sm" variant="outline" className="h-8 gap-2" onClick={captureScreenshot}>
            <RefreshCcw className="h-3.5 w-3.5" />
            <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
              Refresh
            </span>
          </Button>
        </div>
        <div style={{ width: '100%', height: '60vh', overflow: 'auto', position: 'relative' }}>
          {screencapSrc && (
            <>
              <img 
                ref={imgRef}
                src={screencapSrc}
                alt="Device screenshot" 
                style={{ 
                  display: 'block',
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain'
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setCoordinates({ x: 0, y: 0 })}
                onClick={handleImageClick}
                onLoad={handleImageLoad}
              />
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4 grow">
        <div className="flex flex-col gap-2">
          <Label htmlFor="element-xpath" className="pb-2">
            Action Properties
          </Label>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="x" className="text-right">
              X
            </Label>
            <Input
              id="x"
              className="col-span-3"
              value={savedCoordinates.x}
              readOnly
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="y" className="text-right">
              Y
            </Label>
            <Input
              id="y"
              className="col-span-3"
              value={savedCoordinates.y}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  )
}