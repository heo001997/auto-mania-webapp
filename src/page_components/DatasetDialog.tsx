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
import { useState } from "react"
import DatasetFormJavascript from "./DatasetFormJavascript"
import DatasetFormObject from "./DatasetFormObject"
import { databaseService } from '@/services/DatabaseService'
import { Badge } from "@/components/ui/badge"

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

export function DatasetDialog({open, setOpen, btnTitle}: {open: boolean, setOpen: (open: boolean) => void, btnTitle?: string}) {
  const [datasetName, setDatasetName] = useState<string>('')
  const [datasetType, setDatasetType] = useState<string>('')
  const [datasetSaved, setDatasetSaved] = useState<boolean>(false)
  const [datasetInput, setDatasetInput] = useState<string>('') // Add this line
  const [datasetId, setDatasetId] = useState<number>(0)
  const [datasetItems, setDatasetItems] = useState<string[]>([''])
  const [datasetParsed, setDatasetParsed] = useState<Record<string, string>[]>([])

  const handleSave = async () => {
    try {
      const dataset = await databaseService.createDataset({
        name: datasetName,
        type: datasetType,
        data: {},
      });
      setDatasetSaved(true)
      setDatasetId(dataset)
      console.log(dataset)
    } catch (error) {
      console.error("Error saving dataset:", error);
    }
  }

  const handleUpdateDataset = async () => {
    try {
      const parsedData = parseDatasetInput(datasetItems, datasetInput);
      setDatasetParsed(parsedData)
      console.log("parsedData: ", parsedData)
      
      const updatedDatasetId = await databaseService.updateDataset(datasetId, {
        data: parsedData,
      });
      console.log("updatedDatasetId: ", updatedDatasetId);
    } catch (error) {
      console.error("Error saving dataset:", error);
    }
  }

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
            <Button
              onClick={datasetSaved ? handleUpdateDataset : handleSave}
              className="ml-2 self-end"
              disabled={!datasetName || !datasetType}
            >
              <SaveIcon className="w-4 h-4 mr-2" />
              {datasetSaved ? 'Update' : 'Save'}
            </Button>
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
