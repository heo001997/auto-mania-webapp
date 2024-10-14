import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { SaveIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { databaseService } from '@/services/DatabaseService'
import { useAppDispatch } from '@/hooks/reduxHooks';
import { addWorkflow } from "@/store/slices/workflowsSlice"

export interface WorkflowDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  btnTitle?: string;
  isNewWorkflow: boolean;
  workflowName: string;
  setWorkflowName: (name: string) => void;
  workflowSaved: boolean;
  setWorkflowSaved: (saved: boolean) => void;
}

export function WorkflowDialog({
  open,
  setOpen,
  btnTitle,
  isNewWorkflow,
  workflowName,
  setWorkflowName,
  workflowSaved,
  setWorkflowSaved,
}: WorkflowDialogProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isNewWorkflow) {
      setWorkflowName('');
      setWorkflowSaved(false);
    }
  }, [isNewWorkflow, open]);

  const handleSave = async () => {
    try {
      if (!workflowName) {
        console.error("Workflow name is required");
        return;
      }

      const newWorkflow = await databaseService.createWorkflow({
        name: workflowName,
        data: {},
        edges: [],
      });

      setWorkflowSaved(true);

      // Create a serializable workflow object
      const serializableWorkflow = {
        id: newWorkflow,
        name: workflowName,
        data: {},
        edges: {},
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      // Dispatch action to add the new workflow to Redux store
      dispatch(addWorkflow(serializableWorkflow));

      console.log("New workflow created:", serializableWorkflow);

      setOpen(false);
    } catch (error) {
      console.error("Error saving workflow:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={btnTitle ? "" : "hidden"}>{btnTitle}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[1200px] w-[70%]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            Workflow
            <Label htmlFor="name" className="ml-4 mr-2 text-right">
              Name
            </Label>
            {!workflowSaved ? (
              <Input
                id="name"
                className="w-[40%]"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
              />
            ) : (
              <Badge className="text-lg" variant="outline">
                {workflowName}
              </Badge>
            )}
            {!workflowSaved && (
              <Button
                onClick={handleSave}
                className="ml-2 self-end"
                disabled={!workflowName}
              >
                <SaveIcon className="w-4 h-4 mr-2" />
                Save
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
