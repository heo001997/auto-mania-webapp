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
import { RefreshCcw } from "lucide-react"
import { useContext, useEffect, useState } from "react"
import ActionFormTouch from "./ActionFormTouch"
import ActionFormSwipe from "./ActionFormSwipe"
import { Separator } from "@/components/ui/separator"
import ActionFormTyping from "./ActionFormTyping"
import ActionFormProcessData from "./ActionFormProcessData"
import ActionFormApk from "./ActionFormApk"
import ActionFormRandomize from "./ActionFormRandomize"
import ActionFormJavascript from "./ActionFormJavascript"
import ActionFormWait from "./ActionFormWait"
import { WorkflowContext } from "@/contexts/WorkflowContext"
import { ActionContext } from "@/contexts/ActionContext"

export function ActionDialog({open, setOpen, btnTitle, actionId}: {open: boolean, setOpen: (open: boolean) => void, btnTitle?: string, actionId: string}) {
  const { workflow, setWorkflow } = useContext(WorkflowContext);
  const action = actionId ? workflow.data[actionId] : {}

  const handleActionTypeChange = (value: string) => {
    setWorkflow((prev: any) => ({...prev, data: {...prev.data, type: value}}))
  }

  const handleActionLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;
    setWorkflow((prevWorkflow: any) => ({
      ...prevWorkflow,
      data: {
        ...prevWorkflow.data,
        [actionId]: {
          ...prevWorkflow.data[actionId],
          data: {
            ...prevWorkflow.data[actionId].data,
            label: newLabel
          }
        }
      }
    }));
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={btnTitle ? "" : "hidden"}>{btnTitle}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[1200px] w-[70%]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            Step for &nbsp;
            <Select onValueChange={handleActionTypeChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select an action" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="touch">Touch</SelectItem>
                  <SelectItem value="typing">Typing</SelectItem>
                  <SelectItem value="processData">Process Data</SelectItem>
                  <SelectItem value="apk">APK</SelectItem>
                  <SelectItem value="randomize">Randomize</SelectItem>
                  <SelectItem value="javascript">Javascript</SelectItem>
                  <SelectItem value="wait">Wait</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Label htmlFor="name" className="ml-4 mr-2 text-right">
              Name
            </Label>
            <Input
              id="name"
              className="w-[40%] font-normal"
              value={action.data?.label}
              onChange={handleActionLabelChange}
            />
          </DialogTitle>
        </DialogHeader>
        {
          action.data && (
            <>
              {action.data.type === 'touch' && <ActionFormTouch />}
              {action.data.type === 'typing' && <ActionFormTyping />}
              {action.data.type === 'processData' && <ActionFormProcessData />}
              {action.data.type === 'apk' && <ActionFormApk />}
              {action.data.type === 'javascript' && <ActionFormJavascript />}
              {action.data.type === 'wait' && <ActionFormWait />}
              {action.data.type === 'randomize' && <ActionFormRandomize />}
            </>
          )
        }
      </DialogContent>
    </Dialog>
  )
}
