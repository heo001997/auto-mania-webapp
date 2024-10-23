import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { WorkflowContext } from "@/contexts/WorkflowContext";
import { EnvService } from "@/services/EnvService";
import JSADBClient from "@/services/JSADBClient";
import { RootState } from "@/store";
import { FlaskConical, RefreshCcw, Search } from "lucide-react";
import { ReactNode, useEffect, useState, useRef, MouseEvent, useContext } from "react";
import { useSelector } from "react-redux";

export default function ActionFormSwipe() {
  const { workflow, setWorkflow, currentActionId, runner, datasets } = useContext(WorkflowContext);
  const action = currentActionId ? workflow.data[currentActionId] : {}
  const actionData = action.data?.action || {}
  const [screencapSrc, setScreencapSrc] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{ x: number | null, y: number | null }>({ x: null, y: null });
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [savedCoordinates, setSavedCoordinates] = useState<{ x: number | null, y: number | null }>({ x: null, y: null });
  const [bounds, setBounds] = useState<{ left: number, top: number, right: number, bottom: number } | null>(null);
  const [elementText, setElementText] = useState<string>(actionData.text || '');
  const [elementBounds, setElementBounds] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  const device = useSelector((state: RootState) => state.devices.currentDevice);
  const jsadb = new JSADBClient();

  const [swipeStart, setSwipeStart] = useState<{ x: number, y: number } | null>(actionData.start || null);
  const [swipeEnd, setSwipeEnd] = useState<{ x: number, y: number } | null>(actionData.end || null);
  const [swipeSpeed, setSwipeSpeed] = useState<number>(actionData.speed || 100); // Default speed in milliseconds
  const [isDrawing, setIsDrawing] = useState(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
    e.preventDefault(); // Prevent default browser behavior
    if (imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect();
      const x = Math.round((e.clientX - rect.left) * (imageDimensions.width / rect.width));
      const y = Math.round((e.clientY - rect.top) * (imageDimensions.height / rect.height));
      setSwipeStart({ x, y });
      setSwipeEnd(null);
      setIsDrawing(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    e.preventDefault(); // Prevent default browser behavior
    if (imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect();
      const x = Math.round((e.clientX - rect.left) * (imageDimensions.width / rect.width));
      const y = Math.round((e.clientY - rect.top) * (imageDimensions.height / rect.height));
      setCoordinates({ x, y });
      if (isDrawing) {
        setSwipeEnd({ x, y });
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLImageElement>) => {
    e.preventDefault(); // Prevent default browser behavior
    setIsDrawing(false);
    if (swipeStart && swipeEnd) {
      setWorkflow((prev: any) => ({
        ...prev,
        data: {
          ...prev.data,
          [currentActionId]: {
            ...prev.data[currentActionId],
            data: {
              ...prev.data[currentActionId].data,
              action: {
                ...prev.data[currentActionId].data.action,
                start: swipeStart,
                end: swipeEnd,
                speed: swipeSpeed
              }
            }
          }
        }
      }));
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLImageElement>) => {
    e.preventDefault(); // Prevent default browser behavior
    setIsDrawing(false);
  };

  const captureScreenshot = () => {
    jsadb.screenshot(device.id).then((data) => {
      setScreencapSrc(`data:image/png;base64,${data.result}`);
      // Reset bounds and related states
      setBounds(null);
      setElementBounds('');
      setSavedCoordinates({ x: null, y: null });
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
        setSavedCoordinates(coordinates);
        if (result.text) {
          setElementText(result.text.toLowerCase())
          setWorkflow((prev: any) => {
            return {
              ...prev, 
              data: {
                ...prev.data, [currentActionId]: {
                  ...prev.data[currentActionId], data: {
                    ...prev.data[currentActionId].data, 
                    action: {
                      ...prev.data[currentActionId].data.action,
                      text: result.text
                    }
                  }
                }
              }
            }
          })
        } else {
          setElementText('')
          setWorkflow((prev: any) => {
            return {
              ...prev, 
              data: {
                ...prev.data, [currentActionId]: {
                  ...prev.data[currentActionId], data: {
                    ...prev.data[currentActionId].data, 
                    action: {
                      ...prev.data[currentActionId].data.action,
                      text: ''
                    }
                  }
                }
              }
            }
          })
        } 
      }
    });
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

  const renderArrow = () => {
    if (!swipeStart || !swipeEnd || !imgRef.current) return null;

    const img = imgRef.current;
    const scaleX = img.clientWidth / imageDimensions.width;
    const scaleY = img.clientHeight / imageDimensions.height;

    const startX = swipeStart.x * scaleX;
    const startY = swipeStart.y * scaleY;
    const endX = swipeEnd.x * scaleX;
    const endY = swipeEnd.y * scaleY;

    const angle = Math.atan2(endY - startY, endX - startX);
    const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));

    return (
      <svg
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="0"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="red" />
          </marker>
        </defs>
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke="red"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />
      </svg>
    );
  };

  const handleCoordinateChange = (
    type: 'start' | 'end',
    value: string
  ) => {
    const [x, y] = value.split(',').map(Number);
    if (isNaN(x) || isNaN(y)) return;

    const newCoords = { x, y };
    const setter = type === 'start' ? setSwipeStart : setSwipeEnd;
    setter(newCoords);

    setWorkflow((prev: any) => ({
      ...prev,
      data: {
        ...prev.data,
        [currentActionId]: {
          ...prev.data[currentActionId],
          data: {
            ...prev.data[currentActionId].data,
            action: {
              ...prev.data[currentActionId].data.action,
              [type]: newCoords
            }
          }
        }
      }
    }));
  };

  return (
    <div className="flex flex-col gap-4 my-4 justify-between">
      <Separator />
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
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseLeave}
                  onLoad={handleImageLoad}
                />
                {renderBounds()}
                {renderArrow()}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 grow">
          <div className="flex flex-col gap-2">
            <Label className="pb-2">
              Action Properties
            </Label>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="swipe-start" className="text-right">
                Start
              </Label>
              <Input
                id="swipe-start"
                className="col-span-3"
                value={swipeStart ? `${swipeStart.x},${swipeStart.y}` : ''}
                onChange={(e) => handleCoordinateChange('start', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="swipe-end" className="text-right">
                End
              </Label>
              <Input
                id="swipe-end"
                className="col-span-3"
                value={swipeEnd ? `${swipeEnd.x},${swipeEnd.y}` : ''}
                onChange={(e) => handleCoordinateChange('end', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="swipe-speed" className="text-right">
                Speed (ms)
              </Label>
              <Input
                id="swipe-speed"
                className="col-span-3"
                type="number"
                value={swipeSpeed}
                onChange={(e) => {
                  const speed = parseInt(e.target.value);
                  setSwipeSpeed(speed);
                  setWorkflow((prev: any) => ({
                    ...prev,
                    data: {
                      ...prev.data,
                      [currentActionId]: {
                        ...prev.data[currentActionId],
                        data: {
                          ...prev.data[currentActionId].data,
                          action: {
                            ...prev.data[currentActionId].data.action,
                            speed: speed
                          }
                        }
                      }
                    }
                  }));
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
