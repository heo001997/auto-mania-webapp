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
import { useState } from "react"
import ActionFormTouch from "./ActionFormTouch"
import ActionFormSwipe from "./ActionFormSwipe"
import { Separator } from "@/components/ui/separator"
import ActionFormTyping from "./ActionFormTyping"
import ActionFormProcessData from "./ActionFormProcessData"
import ActionFormApk from "./ActionFormApk"
import ActionFormRandomize from "./ActionFormRandomize"
import ActionFormJavascript from "./ActionFormJavascript"
import ActionFormWait from "./ActionFormWait"

export function ActionDialog({open, setOpen, btnTitle}: {open: boolean, setOpen: (open: boolean) => void, btnTitle?: string}) {
  const [actionForm, setActionForm] = useState<React.ReactNode>(null)

  const handleActionFormChange = (value: string) => {
    const form: Record<string, React.ReactNode> = {
      touch: <ActionFormTouch />,
      typing: <ActionFormTyping />,
      processData: <ActionFormProcessData />,
      apk: <ActionFormApk />,
      randomize: <ActionFormRandomize />,
      javascript: <ActionFormJavascript />,
      wait: <ActionFormWait />,
    }
    setActionForm(form[value])
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
            <Select onValueChange={handleActionFormChange}>
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
              className="w-[40%]"
            />
          </DialogTitle>
        </DialogHeader>
        {actionForm}
      </DialogContent>
    </Dialog>
  )
}
