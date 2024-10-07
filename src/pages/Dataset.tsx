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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useState } from "react";
import { PlusCircle } from "lucide-react"
import { ActionDialog } from "@/page_components/ActionDialog"


export default function Dataset() {
  const [openActionDialog, setOpenActionDialog] = useState(false);

  return (
    <Layout currentPage="Datasets">
      <ActionDialog open={openActionDialog} setOpen={setOpenActionDialog}/>
      <div className="w-full items-start gap-4">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <Tabs defaultValue="available">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="available">Available</TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 gap-1 text-sm"
                  onClick={() => setOpenActionDialog(true)}
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only">Add</span>
                </Button>
              </div>
            </div>
            <TabsContent value="available">
              <Card x-chunk="dashboard-05-chunk-3">
                <CardHeader className="px-7">
                  <CardTitle>Datasets</CardTitle>
                  <CardDescription>
                    Your dataset storage
                  </CardDescription>
                </CardHeader>
                <CardContent>
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
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="bg-accent">
                        <TableCell className="hidden sm:table-cell">
                          1
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          Dog Followee
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {`{"username": "prodog123", "name": "Pro Dog 123"}`}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          2023-10-03
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          2023-09-30
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="hidden sm:table-cell">
                          2
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          Cat Likee
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {`{"username": "procat123", "name": "Pro Cat 123"}`}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          2023-10-02
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          2023-09-29
                        </TableCell>
                      </TableRow>
                      <TableRow className="bg-accent">
                        <TableCell className="hidden sm:table-cell">
                          3
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          Chick Followee
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {`{"username": "prochick123", "name": "Pro Chick 123"}`}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          2023-10-01
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          2023-09-28
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  )
}