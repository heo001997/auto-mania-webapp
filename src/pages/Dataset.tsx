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
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { setDatasets, deleteDataset } from '@/store/slices/datasetsSlice';

export default function Dataset() {
  const [openActionDialog, setOpenActionDialog] = useState(false);
  const [isNewDataset, setIsNewDataset] = useState(true);
  const [datasetName, setDatasetName] = useState('');
  const [datasetType, setDatasetType] = useState('');
  const [datasetSaved, setDatasetSaved] = useState(false);
  const [datasetInput, setDatasetInput] = useState('');
  const [datasetId, setDatasetId] = useState(0);
  const [datasetItems, setDatasetItems] = useState(['']);
  const [datasetParsed, setDatasetParsed] = useState<object[]>([]);

  const dispatch = useAppDispatch();
  const datasets = useAppSelector((state) => state.datasets.datasets);

  const handleDelete = async (id: number) => {
    try {
      await databaseService.deleteDataset(id);
      dispatch(deleteDataset(id));
      console.log(`Dataset with id ${id} deleted successfully`);
    } catch (error) {
      console.error("Error deleting dataset:", error);
    }
  };

  const handleRowClick = async (id: number) => {
    try {
      const dataset = await databaseService.getDataset(id);
      if (dataset) {
        setIsNewDataset(false);
        setDatasetName(dataset.name);
        setDatasetType(dataset.type);
        setDatasetSaved(true);
        setDatasetInput(dataset.data.map(item => Object.values(item).join(',')).join('\n'));
        setDatasetId(dataset.id);
        setDatasetItems(Object.keys(dataset.data[0] || {}));
        setDatasetParsed(dataset.data);
        setOpenActionDialog(true);
    }
    } catch (error) {
      console.error("Error fetching dataset:", error);
    }
  };

  useEffect(() => {
    async function fetchDatasets() {
      try {
        const fetchedDatasets = await databaseService.getAllDatasets();
        const serializedDatasets = fetchedDatasets.map(dataset => ({
          ...dataset,
          updatedAt: dataset.updatedAt.toISOString(),
          createdAt: dataset.createdAt.toISOString(),
          data: Array.isArray(dataset.data) ? dataset.data : [dataset.data]
        }));
        dispatch(setDatasets(serializedDatasets));
        console.log('All datasets:', serializedDatasets);
      } catch (error) {
        console.error('Error fetching datasets:', error);
      }
    }
    
    fetchDatasets();
  }, [dispatch]);

  const resetFormState = () => {
    setDatasetName('');
    setDatasetType('');
    setDatasetSaved(false);
    setDatasetInput('');
    setDatasetId(0);
    setDatasetItems(['']);
    setDatasetParsed([]);
  };

  const handleAddDataset = () => {
    setIsNewDataset(true);
    resetFormState();
    setOpenActionDialog(true);
  };

  return (
    <Layout currentPage="Datasets">
      <DatasetDialog
        open={openActionDialog}
        setOpen={setOpenActionDialog}
        isNewDataset={isNewDataset}
        datasetName={datasetName}
        setDatasetName={setDatasetName}
        datasetType={datasetType}
        setDatasetType={setDatasetType}
        datasetSaved={datasetSaved}
        setDatasetSaved={setDatasetSaved}
        datasetInput={datasetInput}
        setDatasetInput={setDatasetInput}
        datasetId={datasetId}
        setDatasetId={setDatasetId}
        datasetItems={datasetItems}
        setDatasetItems={setDatasetItems}
        datasetParsed={datasetParsed}
        setDatasetParsed={setDatasetParsed}
      />
      <div className="w-full items-start gap-4">
        <div className="grid auto-rows-max items-start gap-4">
            <div className="flex items-center">
              <Button
                variant="outline"
                className="h-7 gap-1"
                onClick={handleAddDataset}
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
                              <TableCell>{new Date(dataset.updatedAt).toLocaleString()}</TableCell>
                              <TableCell>{new Date(dataset.createdAt).toLocaleString()}</TableCell>
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