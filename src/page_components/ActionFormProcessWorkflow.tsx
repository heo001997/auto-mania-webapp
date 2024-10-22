import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import { Check, ChevronsUpDown, CircleMinus, CirclePlus, FlaskConical, PlusIcon, RefreshCcw } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import ActionFormTouchCoordinate from "./ActionFormTouchCoordinate";
import ActionFormTouchXPath from "./ActionFormTouchXPath";
import ActionFormTouchText from "./ActionFormTouchText";
import ActionFormTouchImage from "./ActionFormTouchImage";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { RunnerData } from "@/types/Runner";
import { WorkflowContext } from "@/contexts/WorkflowContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { databaseService } from "@/services/DatabaseService";
import { cn } from "@/lib/utils";
import { Workflow } from "@/types/Workflow";


export default function ActionFormProcessWorkflow() {
  const { workflow, setWorkflow, currentActionId } = useContext(WorkflowContext);
  const action = currentActionId ? workflow.data[currentActionId] : {}
  const actionData = action.data?.action || {}
  const [open, setOpen] = useState(false);
  const [installedWorkflows, setInstalledWorkflows] = useState<Workflow[]>([]);
  const [runnerData, setRunnerData] = useState<RunnerData[]>(actionData.data || {
    id: "",
  });

  const onSelectWorkflowName = (value: string, selectedWorkflow: Workflow) => {
    setOpen(false);
    setWorkflow((prev: any) => {
      const newWorkflow = {
        ...prev,
        data: { 
          ... prev.data, 
          [currentActionId]: { 
            ...prev.data[currentActionId], 
            data: { 
              ...prev.data[currentActionId].data, 
              action: { 
                ...actionData, 
                id: selectedWorkflow.id
              } 
            } 
          } 
        }
      }
      console.log("newWorkflow: ", newWorkflow);

      return newWorkflow;
    });
  }

  useEffect(() => {
    const fetchWorkflows = async () => {
      const workflows = await databaseService.workflows.getAllWorkflows();
      setInstalledWorkflows(workflows);
    };
    fetchWorkflows();
  }, []);

  return (
    <div>
      <Separator className="mb-5" />
      <div className="flex gap-4 my-4 justify-between">
        <div className="flex flex-col gap-6 grow">
          <div className="col-span-2 flex gap-2 items-center w-full justify-center">
            <Label htmlFor="humanize">
              Workflow
            </Label>
            <div className="flex items-center gap-2">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                  >
                    {
                      actionData.id ? 
                        installedWorkflows.find((currentWorkflow) => currentWorkflow.id === actionData.id)?.name : 
                        "Select a workflow"
                    }
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search a workflow" />
                    <CommandList>
                      <CommandEmpty>No workflow found.</CommandEmpty>
                      <CommandGroup>
                        {
                          installedWorkflows.map((currentWorkflow) => (
                            <CommandItem
                              key={currentWorkflow.id}
                              value={currentWorkflow.id.toString()}
                              onSelect={(value) => onSelectWorkflowName(value, currentWorkflow)}
                              className={cn(
                                actionData.id === currentWorkflow.id && "bg-accent"
                              )}
                            >
                              {currentWorkflow.name}
                              <Check
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  actionData.id === currentWorkflow.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))
                        }
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}