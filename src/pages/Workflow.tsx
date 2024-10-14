import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react";
import { PlusCircle, Trash } from "lucide-react"
import { WorkflowDialog } from "@/page_components/WorkflowDialog"
import { databaseService } from '@/services/DatabaseService';
import type { Workflow } from "@/types/Workflow";
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { setWorkflows, deleteWorkflow } from '@/store/slices/workflowsSlice';
import { useNavigate } from 'react-router-dom';

export default function Workflow() {
  const dispatch = useAppDispatch();
  const workflows = useAppSelector((state) => state.workflows.workflows);
  const [openWorkflowDialog, setOpenWorkflowDialog] = useState(false);
  const [isNewWorkflow, setIsNewWorkflow] = useState(true);
  const [workflowName, setWorkflowName] = useState('');
  const [workflowSaved, setWorkflowSaved] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async (id: number) => {
    try {
      await databaseService.deleteWorkflow(id);
      dispatch(deleteWorkflow(id));
      console.log(`Workflow with id ${id} deleted successfully`);
    } catch (error) {
      console.error("Error deleting workflow:", error);
    }
  };

  const handleRowClick = (id: number) => {
    navigate(`/workflow/${id}`);
  };

  useEffect(() => {
    async function fetchWorkflows() {
      try {
        const fetchedWorkflows = await databaseService.getAllWorkflows();
        const serializedWorkflows = fetchedWorkflows.map(workflow => ({
          ...workflow,
          updatedAt: workflow.updatedAt.toISOString(),
          createdAt: workflow.createdAt.toISOString(),
          data: workflow.data
        }));
        dispatch(setWorkflows(serializedWorkflows));
        console.log('Workflows:', serializedWorkflows);
      } catch (error) {
        console.error('Error fetching workflows:', error);
      }
    }
    
    fetchWorkflows();
  }, []);

  const resetFormState = () => {
    setWorkflowName('');
    setWorkflowSaved(false);
  };

  const handleAddWorkflow = () => {
    setIsNewWorkflow(true);
    setWorkflowName('');
    setWorkflowSaved(false);
    setOpenWorkflowDialog(true);
  };

  return (
    <Layout currentPage="Workflows">
      <WorkflowDialog
        open={openWorkflowDialog}
        setOpen={setOpenWorkflowDialog}
        isNewWorkflow={isNewWorkflow}
        workflowName={workflowName}
        setWorkflowName={setWorkflowName}
        workflowSaved={workflowSaved}
        setWorkflowSaved={setWorkflowSaved}
      />
      <div className="w-full items-start gap-4">
        <div className="grid auto-rows-max items-start gap-4">
            <div className="flex items-center">
              <Button
                variant="outline"
                className="h-7 gap-1"
                onClick={handleAddWorkflow}
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only">Add Workflow</span>
              </Button>
            </div>
              <Card x-chunk="dashboard-05-chunk-3">
                <CardHeader className="px-7">
                  <CardTitle>Workflows</CardTitle>
                  <CardDescription>
                    Your workflow storage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full overflow-auto">
                    <div className="min-w-[800px] max-h-[75vh]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Id</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="hidden sm:table-cell max-w-[400px] truncate">
                              Actions
                            </TableHead>
                            <TableHead className="hidden sm:table-cell">
                              Updated At
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                              Created At
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                              Delete
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {workflows.map((workflow) => (
                            <TableRow 
                              key={workflow.id} 
                              className={workflow.id % 2 === 0 ? "bg-accent" : ""} 
                              onClick={() => handleRowClick(workflow.id)}
                            >
                              <TableCell>{workflow.id}</TableCell>
                              <TableCell>{workflow.name}</TableCell>
                              <TableCell className="hidden md:table-cell truncate max-w-[400px]">
                                {JSON.stringify(workflow.data)}
                              </TableCell>
                              <TableCell>{new Date(workflow.updatedAt).toLocaleString()}</TableCell>
                              <TableCell>{new Date(workflow.createdAt).toLocaleString()}</TableCell>
                              <TableCell>
                                <Button 
                                  variant="ghost" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(workflow.id);
                                  }}
                                >
                                  <Trash className="h-3.5 w-3.5" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
        </div>
      </div>
    </Layout>
  )
}
