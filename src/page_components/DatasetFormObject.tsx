import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { CirclePlus, X } from "lucide-react";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function DatasetFormObject({ input, setInput, items, setItems, sample }: { input: string, setInput: (input: string) => void, items: string[], setItems: (items: React.SetStateAction<string[]>) => void, sample: Record<string, string>[] }) {
  const addItem = () => {
    setItems([...items, '']);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) {
      // If it's the last item, clear its input instead of removing it
      setItems(['']);
    } else {
      // Otherwise, remove the item as before
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    }
  };

  const handleItemOnChange = (value: string, index: number) => {
    setItems((prevItems: string[]) => {
      const newItems = [...prevItems];
      newItems[index] = value;
      return newItems;
    });
  }

  return (
    <div className="ml-1 flex flex-col gap-4">
      <div className="flex flex-col gap-4 max-w-full">
        <Separator className="mt-2 w-full block" />
        <div>
          <div className="mb-2">
            <Label>
              Structure
            </Label>
          </div>
          <div className="flex gap-2 flex-wrap pb-2">
            {items.map((item, index) => (
              <div key={index} className="flex-shrink-0">
                <div className="relative group">
                  <Input
                    placeholder="Name"
                    value={item}
                    className="w-[150px]"
                    onChange={(e) => handleItemOnChange(e.target.value, index)}
                  />
                  <div className="absolute right-0 top-0 h-full flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1 mr-[2px]">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeItem(index)}
                      className="h-8 w-8"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={addItem}
                      className="h-8 w-8"
                    >
                      <CirclePlus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-2">
            <Label>
              Input
            </Label>
          </div>
          <div className="flex gap-2 flex-wrap pb-2">
            <Textarea 
              id="input"
              placeholder="Type your input here." 
              className="h-32 w-full mr-1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
        </div>
        {sample.length > 0 && (
          <div className="w-full">
            <div className="mb-2">
              <Label>
                Sample
              </Label>
            </div>
            <div className="w-full overflow-auto">
              <div className="min-w-max">
                <Table className="border-collapse">
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      {items.map((item, index) => (
                        <TableHead key={index} className="border-x border-gray-200 font-semibold">
                          {item}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sample.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {items.map((item, colIndex) => (
                          <TableCell key={colIndex} className="border-x border-gray-200">
                            {row[item] || ''}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}