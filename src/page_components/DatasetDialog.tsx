import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RefreshCcw, SaveIcon } from "lucide-react"
import { useEffect, useState } from "react"
import DatasetFormJavascript from "./DatasetFormJavascript"
import DatasetFormObject from "./DatasetFormObject"
import { databaseService } from '@/services/DatabaseService'
import { Badge } from "@/components/ui/badge"
import { useAppDispatch } from '@/hooks/reduxHooks';
import { addDataset } from '@/store/slices/datasetsSlice';
import { updateDataset } from '@/store/slices/datasetsSlice';
import { SerializableDataset } from "@/types/Dataset"

export interface DatasetDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  btnTitle?: string;
  isNewDataset: boolean;
  datasetName: string;
  setDatasetName: (name: string) => void;
  datasetType: string;
  setDatasetType: (type: string) => void;
  datasetSaved: boolean;
  setDatasetSaved: (saved: boolean) => void;
  datasetInput: string;
  setDatasetInput: (input: string) => void;
  datasetId: number;
  setDatasetId: (id: number) => void;
  datasetItems: string[];
  setDatasetItems: (items: string[]) => void;
  datasetParsed: object[];
  setDatasetParsed: (parsed: object[]) => void;
}

export function DatasetDialog({
  open,
  setOpen,
  btnTitle,
  isNewDataset,
  datasetName,
  setDatasetName,
  datasetType,
  setDatasetType,
  datasetSaved,
  setDatasetSaved,
  datasetInput,
  setDatasetInput,
  datasetId,
  setDatasetId,
  datasetItems,
  setDatasetItems,
  datasetParsed,
  setDatasetParsed
}: DatasetDialogProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isNewDataset) {
      setDatasetName('');
      setDatasetType('');
      setDatasetSaved(false);
      setDatasetInput('');
      setDatasetId(0);
      setDatasetItems(['']);
      setDatasetParsed([{}]);
    }
  }, [isNewDataset, open]);

  const parseDatasetInput = (items: string[], input: string): Record<string, string>[] => {
    const inputRows = input.split('\n').map(row => row.split(',').map(item => item.trim()));
    
    const result: Record<string, string>[] = [];
    inputRows.forEach((row) => {
      const newObj: Record<string, string> = {};
      row.forEach((currRow, currRowIndex) => {
        newObj[items[currRowIndex]] = currRow || '';
      });
      result.push(newObj);
    });
  
    return result;
  };

  const handleSave = async () => {
    try {
      const newDataset = await databaseService.createDataset({
        name: datasetName,
        type: datasetType,
        data: [{'': ''}],
      });
      setDatasetSaved(true);
      setDatasetId(newDataset);

      // Create a serializable dataset object
      const serializableDataset = {
        id: newDataset,
        name: datasetName,
        type: datasetType,
        data: [{'': ''}],
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      // Dispatch action to add the new dataset to Redux store
      dispatch(addDataset(serializableDataset));

      console.log("New dataset created:", serializableDataset);
    } catch (error) {
      console.error("Error saving dataset:", error);
    }
  };

  const handleUpdateDataset = async () => {
    try {
      const parsedData = parseDatasetInput(datasetItems, datasetInput);
      setDatasetParsed(parsedData)
      console.log("parsedData: ", parsedData)
      
      const updatedDatasetId = await databaseService.updateDataset(datasetId, {
        data: parsedData,
      });
      console.log("updatedDatasetId: ", updatedDatasetId);

      // Create a serializable dataset object
      const updatedDataset: SerializableDataset = {
        id: datasetId,
        name: datasetName,
        type: datasetType,
        data: parsedData,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(), // This should ideally be fetched from the existing dataset
      };

      // Dispatch action to update the dataset in Redux store
      dispatch(updateDataset(updatedDataset));

      console.log("Dataset updated in Redux store:", updatedDataset);
    } catch (error) {
      console.error("Error saving dataset:", error);
    }
  }

  useEffect(() => {
    handleUpdateDataset()
  }, [datasetInput, datasetItems])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={btnTitle ? "" : "hidden"}>{btnTitle}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[1200px] w-[70%]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            Dataset for &nbsp;
            {
              !datasetSaved ? 
              <Select onValueChange={(value) => setDatasetType(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="object">Object</SelectItem>
                    <SelectItem value="javascript">Javascript</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select> :
              <Badge className="text-lg" variant="outline">
                {datasetType}
              </Badge>
            }
            <Label htmlFor="name" className="ml-4 mr-2 text-right">
              Name
            </Label>
            { 
              !datasetSaved ?
              <Input
                id="name"
                className="w-[40%]"
                value={datasetName}
                onChange={(e) => setDatasetName(e.target.value)}
              /> :
              <Badge className="text-lg" variant="outline">
                {datasetName}
              </Badge>
            }
            {
              !datasetSaved &&
              <Button
                onClick={handleSave}
                className="ml-2 self-end"
                disabled={!datasetName || !datasetType}
              >
                <SaveIcon className="w-4 h-4 mr-2" />
                Save
              </Button>
            }
          </DialogTitle>
        </DialogHeader>
        {
          datasetSaved &&
          <div className="max-h-[60vh] overflow-auto">
            {datasetType === 'object' && (
              <DatasetFormObject 
                input={datasetInput} 
                setInput={setDatasetInput} 
                items={datasetItems} 
                setItems={setDatasetItems}
                sample={datasetParsed}
              />
            )}
            {datasetType === 'javascript' && <DatasetFormJavascript />}
          </div>
        }
      </DialogContent>
    </Dialog>
  )
}