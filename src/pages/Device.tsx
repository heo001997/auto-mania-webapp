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
import { databaseService } from '@/services/DatabaseService';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';

export default function Device() {
  return (
    <Layout currentPage="Devices">
      <div className="w-full items-start gap-4">
        {/* <div className="grid auto-rows-max items-start gap-4">
          <div className="flex items-center">
            <Button
              variant="outline"
              className="h-7 gap-1"
              onClick={handleAddOrder}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">Add Order</span>
            </Button>
          </div>
          <Card>
            <CardHeader className="px-7">
              <CardTitle>Orders</CardTitle>
              <CardDescription>
                Your recent orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-auto">
                <div className="min-w-[800px] max-h-[75vh]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Id</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Status
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
                      {orders.map((order) => (
                        <TableRow 
                          key={order.id} 
                          className={order.id % 2 === 0 ? "bg-accent" : ""} 
                          onClick={() => handleRowClick(order.id)}
                        >
                          <TableCell>{order.id}</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell className="hidden sm:table-cell">{order.status}</TableCell>
                          <TableCell>{new Date(order.updatedAt).toLocaleString()}</TableCell>
                          <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(order.id);
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
        </div> */}
      </div>
    </Layout>
  )
}