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
import { DatasetDialog } from "@/page_components/DatasetDialog"
import { databaseService } from '@/services/DatabaseService';
import type { Dataset } from "@/types/Dataset";

export default function Dataset() {
  const [openActionDialog, setOpenActionDialog] = useState(false);
  const [datasets, setDatasets] = useState<Dataset[]>([]);

  const handleDelete = async (id: number) => {
    try {
      await databaseService.deleteDataset(id);
      // Update state by removing the deleted dataset
      setDatasets(prevDatasets => prevDatasets.filter(dataset => dataset.id !== id));
      console.log(`Dataset with id ${id} deleted successfully`);
    } catch (error) {
      console.error("Error deleting dataset:", error);
    }
  };

  const handleRowClick = async (id: number) => {
    try {
      const dataset = await databaseService.getDataset(id);
      console.log(dataset);
      // Do something with the dataset, e.g., set it to state
    } catch (error) {
      console.error("Error fetching dataset:", error);
    }
  };

  useEffect(() => {
    async function fetchDatasets() {
      try {
        const datasets = await databaseService.getAllDatasets();
        setDatasets(datasets);
        console.log('All datasets:', datasets);
      } catch (error) {
        console.error('Error fetching datasets:', error);
      }
    }
    
    fetchDatasets();
  }, []);

  return (
    <Layout currentPage="Datasets">
      <DatasetDialog open={openActionDialog} setOpen={setOpenActionDialog}/>
      <div className="w-full items-start gap-4">
        <div className="grid auto-rows-max items-start gap-4">
            <div className="flex items-center">
              <Button
                variant="outline"
                className="h-7 gap-1"
                onClick={() => setOpenActionDialog(true)}
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only">Add Dataset</span>
              </Button>
            </div>
              <Card x-chunk="dashboard-05-chunk-3">
                <CardHeader className="px-7">
                  <CardTitle>Datasets</CardTitle>
                  <CardDescription>
                    Your dataset storage
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
                            <TableHead className="hidden sm:table-cell">
                              Sample
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
                          {datasets.map((dataset) => (
                            <TableRow 
                              key={dataset.id} 
                              className={dataset.id % 2 === 0 ? "bg-accent" : ""} 
                              onClick={() => handleRowClick(dataset.id)}
                            >
                              <TableCell>{dataset.id}</TableCell>
                              <TableCell>{dataset.name}</TableCell>
                              <TableCell>{JSON.stringify(dataset.data)}</TableCell>
                              <TableCell>{dataset.updatedAt.toString()}</TableCell>
                              <TableCell>{dataset.createdAt.toString()}</TableCell>
                              <TableCell>
                                <Button 
                                  variant="ghost" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(dataset.id);
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
