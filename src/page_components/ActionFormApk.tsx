import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import { FlaskConical } from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import JSADBClient from "@/services/JSADBClient";
import { Separator } from "@/components/ui/separator";
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function ActionFormApk() {
  const [packageName, setPackageName] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [installedApps, setInstalledApps] = useState<string[]>([]);
  const device = useSelector((state: RootState) => state.devices.currentDevice);
  const jsadb = new JSADBClient();
  const [selectedAction, setSelectedAction] = useState<string>('open');

  useEffect(() => {
    if (device) {
      fetchInstalledApps();
    }
  }, [device]);

  const fetchInstalledApps = async () => {
    if (device) {
      try {
        const { result } = await jsadb.listInstalledApps(device.id, false);
        setInstalledApps(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error("Error fetching installed apps:", error);
        setInstalledApps([]);
      }
    }
  };

  const handleTestClick = async () => {
    if (!device || !packageName) {
      console.error("Device or package name is missing");
      return;
    }

    try {
      let result;
      switch (selectedAction) {
        case 'open':
          result = await jsadb.openApp(packageName, device.id);
          break;
        case 'close':
          result = await jsadb.closeApp(packageName, device.id);
          break;
        case 'install':
          // Assuming you have an installApp method in JSADBClient
          result = await jsadb.installApp(packageName, device.id);
          break;
        default:
          throw new Error("Invalid action selected");
      }
      console.log(`App ${selectedAction} successfully:`, result);
      // You might want to add some user feedback here
    } catch (error) {
      console.error(`Error ${selectedAction} app:`, error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <div>
      <Separator className="mb-5" />
      <div className="flex flex-col gap-4 grow">
        <div className="flex flex-col gap-2">
          <Label className="pb-2">
            Action Properties
          </Label>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="content" className="text-right">
              Action
            </Label>
            <div className="flex gap-2 items-center justify-between w-full">
              <Select onValueChange={(value) => setSelectedAction(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select an action" />
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
            <div className="col-span-2 flex gap-2 items-center w-full">
              <Label htmlFor="humanize" className="text-right w-full">
                Package name
              </Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                  >
                    {packageName || "Select package..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search package..." />
                    <CommandList>
                      <CommandEmpty>No package found.</CommandEmpty>
                      <CommandGroup>
                        {installedApps.map((app) => (
                          <CommandItem
                            key={app}
                            onSelect={(currentValue) => {
                              const newPackageName = currentValue === packageName ? "" : currentValue;
                              setPackageName(newPackageName);
                              console.log("Selected package:", newPackageName);
                              setOpen(false);
                            }}
                            className="pointer-events-auto cursor-pointer hover:bg-accent"
                          >
                            {app}
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                packageName === app ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 gap-2"
                onClick={handleTestClick}
              >
                <FlaskConical className="h-3.5 w-5" />
                <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                  Test
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}