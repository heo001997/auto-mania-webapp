import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { WorkflowContext } from "@/contexts/WorkflowContext";
import JSADBClient from "@/services/JSADBClient";
import { RootState } from "@/store";
import { RefreshCcw, Search } from "lucide-react";
import { ReactNode, useEffect, useState, useRef, MouseEvent, useContext } from "react";
import { useSelector } from "react-redux";

export default function ActionFormTouchXPath() {
  const { workflow, setWorkflow, currentActionId } = useContext(WorkflowContext);
  const action = currentActionId ? workflow.data[currentActionId] : {}
  const actionData = action.data?.action || {}

  const [screencapSrc, setScreencapSrc] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{ x: number | null, y: number | null }>({ x: null, y: null });
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [savedCoordinates, setSavedCoordinates] = useState<{ x: number | null, y: number | null }>({ x: null, y: null });
  const [bounds, setBounds] = useState<{ left: number, top: number, right: number, bottom: number } | null>(null);
  const [elementXPath, setElementXPath] = useState<string>(actionData.xpath || '');
  const [elementBounds, setElementBounds] = useState<string>('');
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
    jsadb.findNearestNode(device.id, coordinates.x ?? 0, coordinates.y ?? 0).then(({result}) => {
      // Parse the bounds string
      const boundsMatch = result.bounds.match(/\[(\d+),(\d+)\]\[(\d+),(\d+)\]/);
      if (boundsMatch) {
        const newBounds = {
          left: parseInt(boundsMatch[1]),
          top: parseInt(boundsMatch[2]),
          right: parseInt(boundsMatch[3]),
          bottom: parseInt(boundsMatch[4])
        };
        setBounds(newBounds);
        setElementBounds(result.bounds);
      }

      // Set the XPath (assuming it's returned as 'xpath' in the result)
      if (result.xpath) {
        setSavedCoordinates(coordinates);
        setElementXPath(result.xpath);
        setWorkflow((prev: any) => {
          return {
            ...prev, 
            data: {
              ...prev.data, [currentActionId]: {
                ...prev.data[currentActionId], data: {
                  ...prev.data[currentActionId].data, 
                  action: {
                    ...prev.data[currentActionId].data.action,
                    xpath: result.xpath
                  }
                }
              }
            }
          }
        })
      }
    });
  };

  const handleSearchClick = () => {
    jsadb.findNodeByXPath(elementXPath, device.id).then(({result}) => {
      if (result) {
        // Parse the bounds string
        const boundsMatch = result.bounds.match(/\[(\d+),(\d+)\]\[(\d+),(\d+)\]/);
        if (boundsMatch) {
          const newBounds = {
            left: parseInt(boundsMatch[1]),
            top: parseInt(boundsMatch[2]),
            right: parseInt(boundsMatch[3]),
            bottom: parseInt(boundsMatch[4])
          };
          setBounds(newBounds);
          setElementBounds(result.bounds);

          // Set the coordinates to the center of the found element
          const centerX = Math.round((newBounds.left + newBounds.right) / 2);
          const centerY = Math.round((newBounds.top + newBounds.bottom) / 2);
          setSavedCoordinates({ x: centerX, y: centerY });
        }
      } else {
        // Handle case when no node is found
        alert("No node found for the given XPath");
      }
    }).catch(error => {
      console.error("Error searching for node:", error);
      alert("An error occurred while searching for the node");
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  const renderBounds = () => {
    if (!bounds || !imgRef.current) return null;

    const img = imgRef.current;

    const scaleX = img.clientWidth / imageDimensions.width;
    const scaleY = img.clientHeight / imageDimensions.height;

    const left = bounds.left * scaleX;
    const top = bounds.top * scaleY;
    const width = (bounds.right - bounds.left) * scaleX;
    const height = (bounds.bottom - bounds.top) * scaleY;

    return (
      <div style={{
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
        border: '2px solid red',
        pointerEvents: 'none'
      }} />
    );
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
        <div className="bg-gray-200 p-4 rounded-md flex justify-between items-center rounded-b-none">
          <h3 className="text-lg font-medium">Screencap</h3>
          <div className="text-sm font-medium">
            X: {coordinates.x ?? 0}, Y: {coordinates.y ?? 0}
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
            <div style={{ position: 'relative' }}>
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
                onMouseLeave={() => setCoordinates({ x: null, y: null })}
                onClick={handleImageClick}
                onLoad={handleImageLoad}
              />
              {renderBounds()}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4 grow">
        <div className="flex flex-col gap-2">
          <Label htmlFor="element-xpath" className="pb-2">
            Action Properties
          </Label>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="element-xpath" className="text-right">
              XPath
            </Label>
            <Input
              id="element-xpath"
              className="col-span-2"
              value={elementXPath}
              onChange={(e) => setElementXPath(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <Button size="sm" variant="outline" className="col-span-1 h-8 gap-2" onClick={handleSearchClick}>
              <Search className="h-3.5 w-5" />
              <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                Search
              </span>
            </Button>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-2">
          <Label htmlFor="element-xpath" className="pb-2">
            Inspecting Element
          </Label>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="x" className="text-right">
              X
            </Label>
            <Input
              readOnly={true}
              id="x"
              className="col-span-3"
              value={savedCoordinates.x ?? ''}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="y" className="text-right">
              Y
            </Label>
            <Input
              readOnly={true}
              id="y"
              className="col-span-3"
              value={savedCoordinates.y ?? ''}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="element-bounds" className="text-right">
              Bound
            </Label>
            <Input
              readOnly={true}
              id="element-bounds"
              className="col-span-3"
              value={elementBounds}
            />
          </div>
        </div>
      </div>
    </div>
  )
}