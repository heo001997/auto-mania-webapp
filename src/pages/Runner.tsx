import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { RunnerDialog } from "@/page_components/RunnerDialog"
import { databaseService } from '@/services/DatabaseService';
import type { Runner } from "@/types/Runner";
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { setRunners, deleteRunner, updateRunner } from '@/store/slices/runnersSlice';

export default function Runner() {
  const [openActionDialog, setOpenActionDialog] = useState(false);
  const [runnerForm, setRunnerForm] = useState({
    name: '',
    data: [{}]
  });

  const dispatch = useAppDispatch();
  const runners = useAppSelector((state) => state.runners.runners);

  const handleDelete = async (id: number) => {
    try {
      await databaseService.runners.deleteRunner(id);
      dispatch(deleteRunner(id));
      console.log(`Runner with id ${id} deleted successfully`);
    } catch (error) {
      console.error("Error deleting runner:", error);
    }
  };

  const handleRowClick = async (id: number) => {
    try {
      const runner = await databaseService.runners.getRunner(id);
      if (runner) {
        console.log("runner: ", runner);
        setRunnerForm(runner);
        setOpenActionDialog(true);
      }
    } catch (error) {
      console.error("Error fetching runner:", error);
    }
  };

  const handleAddRunner = () => {
    setRunnerForm({
      name: '',
      data: [{
        variable: '',
        type: '',
        value: ''
      }]
    });
    setOpenActionDialog(true);
  };

  function handleSetRunnerForm(updater: (prevRunner: Runner) => Runner, isSaved: boolean = true) {
    setRunnerForm((prevRunner: Runner) => {
      const currentRunner = updater(prevRunner);
      console.log("currentRunner: ", currentRunner);

      // Update the runner in the database and Redux store
      if (currentRunner && currentRunner.id) {
        databaseService.runners.updateRunner(currentRunner.id, currentRunner)
          .then(() => {
            console.log("Runner updated in database:", currentRunner);
            // Dispatch action to update Redux store
            dispatch(updateRunner({
              ...currentRunner,
              updatedAt: new Date().toISOString(),
              createdAt: currentRunner.createdAt.toISOString()
            }));
          })
          .catch((error) => {
            console.error("Error updating runner in database:", error);
          });
        return currentRunner;
      } else {
        if (isSaved) {
          console.error("Cannot update runner: missing id", currentRunner);
          return prevRunner;
        } else {
          console.log("Runner temporary updated:", currentRunner);
          return currentRunner;
        }
      }
    });
  };

  useEffect(() => {
    async function fetchRunners() {
      try {
        const fetchedRunners = await databaseService.runners.getAllRunners();
        const serializedRunners = fetchedRunners.map(runner => ({
          ...runner,
          updatedAt: runner.updatedAt.toISOString(),
          createdAt: runner.createdAt.toISOString(),
          data: Array.isArray(runner.data) ? runner.data : [runner.data]
        }));
        dispatch(setRunners(serializedRunners));
        console.log('All runners:', serializedRunners);
      } catch (error) {
        console.error('Error fetching runners:', error);
      }
    }
    
    fetchRunners();
  }, []);

  return (
    <Layout currentPage="Runners">
      <RunnerDialog
        open={openActionDialog}
        setOpen={setOpenActionDialog}
        runnerForm={runnerForm}
        setRunnerForm={handleSetRunnerForm}
      />
      <div className="w-full items-start gap-4">
        <div className="grid auto-rows-max items-start gap-4">
            <div className="flex items-center">
              <Button
                variant="outline"
                className="h-7 gap-1"
                onClick={handleAddRunner}
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only">Add Runner</span>
              </Button>
            </div>
              <Card x-chunk="dashboard-05-chunk-3">
                <CardHeader className="px-7">
                  <CardTitle>Runners</CardTitle>
                  <CardDescription>
                    Your runner storage
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
                            <TableHead className="hidden sm:table-cell max-w-52">
                              Data
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
                          {runners.map((runner, idx) => (
                            <TableRow 
                              key={runner.id} 
                              className={idx % 2 === 0 ? "bg-accent" : ""} 
                              onClick={() => handleRowClick(runner.id)}
                            >
                              <TableCell>{runner.id}</TableCell>
                              <TableCell>{runner.name}</TableCell>
                              <TableCell className="max-w-52 truncate">{JSON.stringify(runner.data)}</TableCell>
                              <TableCell>{new Date(runner.updatedAt).toLocaleString()}</TableCell>
                              <TableCell>{new Date(runner.createdAt).toLocaleString()}</TableCell>
                              <TableCell>
                                <Button 
                                  variant="ghost" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(runner.id);
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
