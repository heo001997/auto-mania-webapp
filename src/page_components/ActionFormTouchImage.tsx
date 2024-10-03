import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import JSADBClient from "@/services/JSADBClient";
import { RootState } from "@/store";
import { RefreshCcw, Scan, Search, Upload, X } from "lucide-react";
import { ReactNode, useEffect, useState, useRef, MouseEvent } from "react";
import { useSelector } from "react-redux";
import { templateMatchingWithNMS } from "@/services/ImageFinder";

export default function ActionFormTouchImage() {
  const [screencapSrc, setScreencapSrc] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [bounds, setBounds] = useState<{ left: number, top: number, right: number, bottom: number } | null>(null);
  const [elementBounds, setElementBounds] = useState<string>('');
  const [cropStart, setCropStart] = useState<{ x: number, y: number } | null>(null);
  const [cropEnd, setCropEnd] = useState<{ x: number, y: number } | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const device = useSelector((state: RootState) => state.devices.currentDevice);
  const jsadb = new JSADBClient();
  const [searchArea, setSearchArea] = useState<{ startX: number, startY: number, endX: number, endY: number } | null>(null);
  const [isSelectingSearchArea, setIsSelectingSearchArea] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLImageElement>) => {
    if (imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect();
      const x = Math.round((e.clientX - rect.left) * (imageDimensions.width / rect.width));
      const y = Math.round((e.clientY - rect.top) * (imageDimensions.height / rect.height));
      
      if (isSelectingSearchArea && searchArea) {
        setSearchArea({ ...searchArea, endX: x, endY: y });
      } else if (isDragging) {
        setCropEnd({ x, y });
      }
    }
  };

  const handleMouseDown = (e: MouseEvent<HTMLImageElement>) => {
    e.preventDefault();

    if (imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect();
      const x = Math.round((e.clientX - rect.left) * (imageDimensions.width / rect.width));
      const y = Math.round((e.clientY - rect.top) * (imageDimensions.height / rect.height));
      
      if (isSelectingSearchArea) {
        setSearchArea({ startX: x, startY: y, endX: x, endY: y });
      } else {
        setCropStart({ x, y });
        setCropEnd({ x, y });
        setIsDragging(true);
      }
    }
  };

  const handleMouseUp = () => {
    if (isSelectingSearchArea) {
      setIsSelectingSearchArea(false);
    } else if (cropStart && cropEnd) {
      cropImage();
    }
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const captureScreenshot = () => {
    // Reset bounds and related states
    setElementBounds('');
    setCropStart(null);
    setCropEnd(null);
    setBounds(null);
    setSearchArea(null);

    jsadb.screenshot(device.id).then((data) => {
      setScreencapSrc(`data:image/png;base64,${data.result}`);
    });
  };

  useEffect(() => {
    captureScreenshot();
  }, []);

  const handleSearchClick = async () => {
    setElementBounds('');
    setBounds(null);

    if (screencapSrc && croppedImage) {
      try {
        const screencapImg = new Image();
        screencapImg.onload = async () => {
          console.log('Screencap dimensions:', screencapImg.width, 'x', screencapImg.height);

          const croppedImg = new Image();
          croppedImg.onload = async () => {
            console.log('Cropped image dimensions:', croppedImg.width, 'x', croppedImg.height);

            if (croppedImg.width <= screencapImg.width && croppedImg.height <= screencapImg.height) {
              const results = await templateMatchingWithNMS(
                screencapSrc,
                croppedImage,
                1, // matching numbers
                0.8, // threshold
                searchArea || {
                  startX: 0,
                  startY: 0,
                  endX: screencapImg.width,
                  endY: screencapImg.height
                }
              );

              if (results.length > 0) {
                const match = results[0];
                const newBounds = {
                  left: match.x,
                  top: match.y,
                  right: match.x + croppedImg.width,
                  bottom: match.y + croppedImg.height
                };
                setBounds(newBounds);
                setElementBounds(`[${newBounds.left},${newBounds.top}][${newBounds.right},${newBounds.bottom}]`);
              } else {
                console.log('No matches found');
                setBounds(null);
                setElementBounds('');
              }
            } else {
              console.error('Cropped image is larger than screencap');
            }
          };
          croppedImg.src = croppedImage;
        };
        screencapImg.src = screencapSrc;
      } catch (error) {
        console.error('Error in template matching:', error);
      }
    }
  };

  const renderBounds = () => {
    const img = imgRef.current;
    if (!img) return null;

    const scaleX = img.clientWidth / imageDimensions.width;
    const scaleY = img.clientHeight / imageDimensions.height;

    const elements: ReactNode[] = [];

    // Render crop bounds (red)
    if (cropStart && cropEnd) {
      const left = Math.min(cropStart.x, cropEnd.x) * scaleX;
      const top = Math.min(cropStart.y, cropEnd.y) * scaleY;
      const width = Math.abs(cropEnd.x - cropStart.x) * scaleX;
      const height = Math.abs(cropEnd.y - cropStart.y) * scaleY;

      elements.push(
        <div key="crop" style={{
          position: 'absolute',
          left: `${left}px`,
          top: `${top}px`,
          width: `${width}px`,
          height: `${height}px`,
          border: '2px solid red',
          pointerEvents: 'none'
        }} />
      );
    }

    // Render template matching bounds (green)
    if (bounds) {
      const left = bounds.left * scaleX;
      const top = bounds.top * scaleY;
      const width = (bounds.right - bounds.left) * scaleX;
      const height = (bounds.bottom - bounds.top) * scaleY;

      elements.push(
        <div key="match" style={{
          position: 'absolute',
          left: `${left}px`,
          top: `${top}px`,
          width: `${width}px`,
          height: `${height}px`,
          border: '2px solid green',
          pointerEvents: 'none'
        }} />
      );
    }

    // Add this block to render search area (blue)
    if (searchArea) {
      const left = Math.min(searchArea.startX, searchArea.endX) * scaleX;
      const top = Math.min(searchArea.startY, searchArea.endY) * scaleY;
      const width = Math.abs(searchArea.endX - searchArea.startX) * scaleX;
      const height = Math.abs(searchArea.endY - searchArea.startY) * scaleY;

      elements.push(
        <div key="searchArea" style={{
          position: 'absolute',
          left: `${left}px`,
          top: `${top}px`,
          width: `${width}px`,
          height: `${height}px`,
          border: '2px solid blue',
          pointerEvents: 'none'
        }} />
      );
    }

    return elements;
  };

  const handleImageLoad = () => {
    if (imgRef.current) {
      setImageDimensions({
        width: imgRef.current.naturalWidth,
        height: imgRef.current.naturalHeight
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCropStart(null);
      setCropEnd(null);
      setElementBounds('');

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCroppedImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const cropImage = () => {
    if (imgRef.current && cropStart && cropEnd) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const x = Math.min(cropStart.x, cropEnd.x);
      const y = Math.min(cropStart.y, cropEnd.y);
      const width = Math.abs(cropEnd.x - cropStart.x);
      const height = Math.abs(cropEnd.y - cropStart.y);
      
      // Set canvas dimensions to match the cropped area
      canvas.width = width;
      canvas.height = height;
      
      // Draw the cropped portion of the image onto the canvas
      ctx?.drawImage(
        imgRef.current,
        x, y, width, height,  // Source rectangle
        0, 0, width, height   // Destination rectangle (same size as source)
      );
      
      const croppedDataUrl = canvas.toDataURL('image/png');
      setCroppedImage(croppedDataUrl);

      // Calculate and set the element bounds
      const bounds = `[${x},${y}][${x + width},${y + height}]`;
      setElementBounds(bounds);
    }
  };

  const handleSearchAreaClick = () => {
    if (searchArea) {
      // Clear the search area if it's already set
      setSearchArea(null);
    } else {
      // Start selecting a new search area
      setIsSelectingSearchArea(true);
    }
  };

  const handleSearchAreaInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const match = value.match(/\[(\d+),(\d+)\]\[(\d+),(\d+)\]/);
    if (match) {
      const [, startX, startY, endX, endY] = match.map(Number);
      setSearchArea({ startX, startY, endX, endY });
    }
  };

  return (
    <div className="flex gap-4 my-4 justify-between">
      <div className="min-w-[450px] max-w-[450px]">
        <div className="bg-gray-200 p-4 rounded-md flex justify-between items-center rounded-b-none">
          <h3 className="text-lg font-medium">Screencap</h3>
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
                  objectFit: 'contain',
                  userSelect: 'none', // Prevent text selection
                }}
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onLoad={handleImageLoad}
                draggable={false} // Disable default dragging
              />
              {renderBounds()}
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
            <Label htmlFor="search-image" className="text-right">
              Image
            </Label>
            <div className="col-span-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                ref={fileInputRef}
              />
              {croppedImage ? (
                <img 
                  className="cursor-pointer"
                  src={croppedImage} 
                  alt="Cropped area" 
                  style={{ maxWidth: '100%', maxHeight: '200px' }}
                  onClick={() => fileInputRef.current?.click()} 
                />
              ) : (
                <div className="flex flex-col items-center">
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="h-8 gap-2 w-full"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Upload
                  </Button>
                </div>
              )}
            </div>
            <Button size="sm" variant="outline" className="col-span-1 h-8 gap-2" onClick={handleSearchClick}>
              <Search className="h-3.5 w-5" />
              <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                Search
              </span>
            </Button>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="search-area" className="text-right">
              Area
            </Label>
            <Input
              id="search-area"
              className="col-span-2"
              value={searchArea ? `[${searchArea.startX},${searchArea.startY}][${searchArea.endX},${searchArea.endY}]` : ''}
              onChange={handleSearchAreaInputChange}
              placeholder="All screen"
            />
            <Button 
              size="sm" 
              variant="outline" 
              className="col-span-1 h-8 gap-2" 
              onClick={handleSearchAreaClick}
            >
              {searchArea ? (
                <>
                  <X className="h-3.5 w-5" />
                  <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                    Clear
                  </span>
                </>
              ) : (
                <>
                  <Scan className="h-3.5 w-5" />
                  <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                    Set
                  </span>
                </>
              )}
            </Button>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-2">
          <Label htmlFor="inspecting-element" className="pb-2">
            Inspecting Element
          </Label>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="element-bounds" className="text-right">
              Bound
            </Label>
            <Input
              id="element-bounds"
              className="col-span-3"
              value={elementBounds}
              readOnly={true}
            />
          </div>
        </div>
      </div>
    </div>
  )
}