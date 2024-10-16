import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Check, ChevronsUpDown, CircleMinus, CirclePlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Runner } from "@/types/Runner";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandItem,
  CommandList,
  CommandGroup,
  CommandInput,
  CommandEmpty
 } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { databaseService, DatabaseService } from "@/services/DatabaseService";
import { Dataset } from "@/types/Dataset";

export default function RunnerFormObject({ runner, setRunner }: { runner: Runner, setRunner: (runner: Runner) => void }) {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [openPopoverId, setOpenPopoverId] = useState<number | null>(null);

  useEffect(() => {
    console.log("runner changed: ", runner);
    const databaseService = new DatabaseService();
    databaseService.datasets.getAllDatasets().then((datasets) => {
      setDatasets(datasets);
    });
  }, [runner]);

  const displaySample = (idx: number) => {
    const currRunnerData = runner.data[idx];
    
    if (currRunnerData.type === "dataset" && currRunnerData.value !== "") {
      const sample = datasets.find((dataset) => dataset.id.toString() === currRunnerData.value)?.data[0];
      return JSON.stringify(sample || '');
    } else if (currRunnerData.type === "variable") {
      const [variableName, ...propertyPath] = currRunnerData.value.split('.');
      
      // Find the matching variable in runner.data
      const matchingVariable = runner.data.find(data => data.variable === variableName);
      
      if (matchingVariable) {
        let value;
        if (matchingVariable.type === "dataset" && matchingVariable.value !== "") {
          // If the matched variable is a dataset, get its sample
          value = datasets.find((dataset) => dataset.id.toString() === matchingVariable.value)?.data[0];
        } else {
          // For other types, use the value directly
          value = matchingVariable.value;
        }

        // If there's a property path, traverse the object
        if (propertyPath.length > 0 && typeof value === 'object' && value !== null) {
          try {
            value = propertyPath.reduce((obj, prop) => obj[prop], value);
          } catch (error) {
            console.error('Error accessing nested property:', error);
            return '';
          }
        }

        return JSON.stringify(value || '');
      }
      return '';
    }
    return currRunnerData.value;
  }

  const handleVariableChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    let sanitizedValue = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
    
    // Ensure the first character is not a number
    if (/^\d/.test(sanitizedValue)) {
      sanitizedValue = sanitizedValue.replace(/^\d+/, '');
    }

    const currentValue = runner.data[idx].variable;

    if (sanitizedValue !== currentValue) {
      setRunner((prevRunner: Runner) => {
        return { 
          ...prevRunner, 
          data: prevRunner.data.map((item, index) => 
            index === idx ? { ...item, variable: sanitizedValue } : item
          )
        };
      });
    }
  };

  const handleTypeChange = (idx: number) => (value: string) => {
    setRunner((prevRunner: Runner) => {
      return { 
        ...prevRunner, 
        data: prevRunner.data.map((item, index) => 
          index === idx ? { ...item, type: value } : item
        )
      };
    });
  };

  const handleValueChange = (value: string, idx: number) => {
    const currRunnerData = runner.data[idx];
    let newValue = value;

    if (currRunnerData.type === "variable") {
      // Apply sanitization for variable type
      newValue = value.replace(/[^a-zA-Z0-9.]/g, '');
      
      // Ensure the first character is not a number or a dot
      newValue = newValue.replace(/^[0-9.]+/, '');

      // Remove multiple consecutive dots
      newValue = newValue.replace(/\.{2,}/g, '.');
    } else if (currRunnerData.type === "dataset") {
      // For dataset type, keep the toggle behavior
      newValue = currRunnerData.value === value ? "" : value;
    } else {
      newValue = value;
    }

    // Only update if the new value is different from the current value
    if (newValue !== currRunnerData.value) {
      setOpenPopoverId(null);
      setRunner((prevRunner: Runner) => {
        return { 
          ...prevRunner, 
          data: prevRunner.data.map((item, index) => 
            index === idx ? { ...item, value: newValue } : item
          )
        };
      });
    }
  };

  const handleRemoveRunnerData = (idx: number) => {
    setRunner((prevRunner: Runner) => {
      return { 
        ...prevRunner, 
        data: prevRunner.data.filter((_, index) => index !== idx)
      };
    });
  };

  const handleAddRunnerData = (index: number) => {
    setRunner((prevRunner: Runner) => {
      const newData = [...prevRunner.data];
      newData.splice(index + 1, 0, { variable: '', type: '', value: '' });
      return { 
        ...prevRunner, 
        data: newData
      };
    });
  };

  return (
    <div className="ml-1 flex flex-col gap-4">
      <div className="flex flex-col gap-4 max-w-full">
        <Separator className="mt-2 w-full block" />
        <div>
          <div className="mb-5">
            <Label>
              Structure
            </Label>
          </div>
          <div className="flex flex-col gap-4 pb-2">
            {Array.isArray(runner?.data) ? runner.data.map((currRunnerData, index) => {
              return <div className="flex items-center justify-between gap-4" key={index}>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 h-8">
                    <Button className="min-w-8 min-h-8 p-1" onClick={() => handleRemoveRunnerData(index)}>
                      <CircleMinus className="min-w-4 min-h-4" />
                    </Button>
                    <Label className="text-right">
                      Variable
                    </Label>
                    <div className="flex items-center gap-2 min-w-28">
                      <Input
                        id="variable"
                        value={currRunnerData.variable}
                        onChange={(e) => handleVariableChange(e, index)}
                        pattern="[a-zA-Z0-9.]*"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 h-8">
                    <Label className="text-right">
                      Type
                    </Label>
                    <div className="flex items-center gap-2">
                      <Select value={currRunnerData.type} onValueChange={handleTypeChange(index)}>
                        <SelectTrigger className="min-w-[200px]">
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="dataset">Dataset</SelectItem>
                            <SelectItem value="static">Static</SelectItem>
                            <SelectItem value="javascript">Javascript</SelectItem>
                            <SelectItem value="variable">Variable</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 h-8">
                    <Label className="text-right">
                      Value
                    </Label>
                    {
                      (currRunnerData.type === "dataset" || currRunnerData.type === "") &&
                      <div className="flex items-center gap-2">
                        <Popover open={openPopoverId === index} onOpenChange={(open) => setOpenPopoverId(open ? index : null)}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openPopoverId === index}
                              className="w-[200px] justify-between"
                            >
                              {
                                currRunnerData.value ? 
                                  datasets.find((dataset) => dataset.id.toString() === currRunnerData.value)?.name : 
                                  "Select a dataset"
                              }
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput placeholder="Search a dataset" />
                              <CommandList>
                                <CommandEmpty>No dataset found.</CommandEmpty>
                                <CommandGroup>
                                  {
                                    datasets.map((dataset) => (
                                      <CommandItem
                                        key={dataset.id}
                                        value={dataset.id.toString()}
                                        onSelect={(value) => handleValueChange(value, index)}
                                        className={cn(
                                          currRunnerData.value === dataset.id.toString() && "bg-accent"
                                        )}
                                      >
                                        {dataset.name}
                                        <Check
                                          className={cn(
                                            "ml-auto h-4 w-4",
                                            currRunnerData.value === dataset.id.toString() ? "opacity-100" : "opacity-0"
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
                    }
                    {
                      (currRunnerData.type === "static" || currRunnerData.type === "javascript" || currRunnerData.type === "variable") &&
                      <div className="flex items-center gap-2 min-w-[200px]">
                        <Input
                          id="variable"
                          value={currRunnerData.value}
                          onChange={(e) => handleValueChange(e.target.value, index)}
                        />
                      </div>
                    }
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 h-8">
                    <Label htmlFor="humanize" className="text-right">
                      Sample
                    </Label>
                    <div className="flex items-center gap-2 min-w-28">
                      <Input
                        value={displaySample(index)}
                        readOnly={true}
                      />
                    </div>
                    <Button className="min-w-8 min-h-8 p-1" onClick={() => handleAddRunnerData(index)}>
                      <CirclePlus className="min-w-4 min-h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            }) : (
              <p>No data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
