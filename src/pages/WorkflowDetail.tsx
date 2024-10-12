import React, { useCallback, useEffect, useState, useRef, useContext } from "react";
import { ArrowBigLeft, CirclePlus, House, LayoutGrid, MoveDown, MoveLeft, MoveRight, Plus, PlusCircle, RefreshCcw, Sun } from "lucide-react"
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ActionDialog } from "@/page_components/ActionDialog"
import { RootState } from '../store';
import { addDevice, setCurrentDevice } from '@/store/slices/devicesSlice';
import { Device } from '@/types/Device';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import JSADBClient from "@/services/JSADBClient"
import { Toggle } from "@/components/ui/toggle"
import { useParams } from 'react-router-dom';
import { databaseService } from '@/services/DatabaseService';
import type { Workflow } from "@/types/Workflow";
import ScreenMirror from '@/components/ScreenMirror';
import '@xyflow/react/dist/style.css';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
  Edge,
} from '@xyflow/react';
import { AppNode, PositionLoggerNode } from '@/page_components/PositionLoggerNode';
import '@xyflow/react/dist/style.css';
import { WorkflowContext } from "@/contexts/WorkflowContext";
import { ActionContext } from "@/contexts/ActionContext";

export default function WorkflowDetail() {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const [workflow, setWorkflow] = useState<Workflow | object>({});
  const [actionId, setActionId] = useState<string>('');
  const [openActionDialog, setOpenActionDialog] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  );

  useEffect(() => {
    if (id) {
      const fetchWorkflow = async () => {
        try {
          const fetchedWorkflow = await databaseService.getWorkflow(Number(id));
          if (fetchedWorkflow) {
            console.log("fetchedWorkflow: ", fetchedWorkflow)
            if (fetchedWorkflow.data) {
              const newNode: AppNode = { id: 'starter', type: 'position-logger', position: { x: 0, y: 0 }, data: { label: 'Start', setWorkflow: setWorkflow, action: {} } }
              setWorkflow({ ...fetchedWorkflow, data: { 'starter': newNode } });
            } else {
              setWorkflow(fetchedWorkflow);
            }
          }
        } catch (error) {
          console.error("Error fetching workflow:", error);
        }
      };
      fetchWorkflow();
    }
  }, [id]);

  useEffect(() => {
    if (workflow && workflow.data) {
      const newNodes = Object.values(workflow.data);
      console.log("newNodes: ", newNodes);
      setNodes(newNodes);
    }
  }, [workflow])

  if (!workflow) {
    return <div>Loading...</div>;
  }

  function handleNodeClick(event: React.MouseEvent<Element, MouseEvent>, node: AppNode): void {
    console.log("handleNodeClick node clicked: ", node);
    console.log("workflow: ", workflow);
    setActionId(node.id);
    setOpenActionDialog(true)
  }

  return (
    <Layout currentPage="Workflows">
      <WorkflowContext.Provider value={{ workflow, setWorkflow }}>
        <ActionDialog open={openActionDialog} setOpen={setOpenActionDialog} actionId={actionId} />
        <ScreenMirror />
        <div className="w-full items-start gap-4 flex">
          <Card className="sm:col-span-2 flex-grow" x-chunk="dashboard-05-chunk-0">
            <CardHeader className="pb-3">
              <CardTitle className="flex justify-between">
                Flow: {workflow.name}
              </CardTitle>
              <CardDescription className="max-w-lg text-balance leading-relaxed">
                Build your flow here
              </CardDescription>
              <Separator className="my-2" />
            </CardHeader>
            <CardContent className="flex flex-col items-center px-6 py-0 text-sm gap-2 flex-wrap h-[600px]">
              <ReactFlow
                nodes={nodes}
                nodeTypes={{ 'position-logger': PositionLoggerNode }}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                edges={edges}
                edgeTypes={{}}
                onNodeClick={(event, node) => handleNodeClick(event, node)}
                onConnect={onConnect}
                proOptions={{ hideAttribution: true }}
                fitView
              >
                <Background />
                <MiniMap />
                <Controls />
              </ReactFlow>
            </CardContent>
            <CardFooter>
            </CardFooter>
          </Card>
        </div>
      </WorkflowContext.Provider>
    </Layout>
  )
}
