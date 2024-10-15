import { WorkflowContext } from '@/contexts/WorkflowContext';
import ActionRunnerService from '@/services/ActionRunnerService';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { Node, BuiltInNode } from '@xyflow/react';
import { debug } from 'console';
import { Play, Plus, PlusCircle, X } from 'lucide-react';
import { useContext, useId } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export type PositionLoggerNode = Node<{
    label: string;
    action: object;
  }, 'position-logger'
>;
export type AppNode = BuiltInNode | PositionLoggerNode;

export function PositionLoggerNode({
  id,
  positionAbsoluteX,
  positionAbsoluteY,
  data,
}: NodeProps<PositionLoggerNode>) {
  const { setWorkflow } = useContext(WorkflowContext);
  const currentDevice = useSelector((state: RootState) => state.devices.currentDevice);
  const x = Math.round(positionAbsoluteX);
  const y = Math.round(positionAbsoluteY);
  const displayX = x + 'px';
  const displayY = y + 'px';

  function handleRemoveNode(event: React.MouseEvent, id: string) {
    event.stopPropagation();
    if (id === 'start') return

    console.log("remove node", id);
    setWorkflow((prevWorkflow: any) => {
      const newData = { ...prevWorkflow.data };
      delete newData[id];
      return {
        ...prevWorkflow,
        data: newData
      };
    });
  }

  async function handlePlayNode(event: React.MouseEvent, id: string) {
    event.stopPropagation();
    console.log("handlePlayNode called", id);

    const service = new ActionRunnerService(data.action, currentDevice);
    const { success, result, error } = await service.execute();
    if (success) {
      console.log("Action executed successfully", result);
    } else {
      if (error) {
        console.error("Unxpected error in handlePlayNode", error);
      } else {
        console.error("Action executed failed", result);
      }
    }
  }

  function handleAddNode(event: React.MouseEvent, x: number, y: number) {
    event.stopPropagation();

    const position = {
      x: x + 200,
      y: y,
    };
    const newNode: AppNode = {
      id: crypto.randomUUID(),
      type: 'position-logger',
      position: position,
      data: { label: `New Action`, action: {} },
    };

    setWorkflow((prevWorkflow: any) => {
      const newData = { ...prevWorkflow.data, [newNode.id]: newNode };
      return {
        ...prevWorkflow,
        data: newData
      };
    });
  }

  return (
    // We add this class to use the same styles as React Flow's default nodes.
    <div className="group react-flow__node-default relative">
      {data.label && <div>{data.label}</div>}

      <div className="absolute top-[-20px] left-0 right-0 h-[20px] hidden group-hover:block">
        {
          id !== 'start' && 
          <button className="absolute left-0 bg-white rounded-full shadow-md w-4 h-4 flex items-center justify-center"
            onClick={(e) => handleRemoveNode(e, id)}
          >
            <X className="w-4 h-4" />
          </button>
        }
        {
          id !== 'start' && 
          <button className="absolute right-5 bg-white rounded-full shadow-md w-4 h-4 flex items-center justify-center"
            onClick={(e) => handlePlayNode(e, id)}
          >
            <Play className="w-4 h-4" />
          </button>
        }
        <button className="absolute right-0 bg-white rounded-full shadow-md w-4 h-4 flex items-center justify-center"
          onClick={(e) => handleAddNode(e, x, y)}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div>
        {displayX} {displayY}
      </div>

      {
        id !== 'start' && 
        <Handle 
          id="target-left" 
          type="target" 
          position={Position.Left} 
          isConnectable={true} 
          className="w-3 h-3 bg-green-600"
        />
      }
      <Handle 
        id="source-right" 
        type="source" 
        position={Position.Right} 
        isConnectable={true} 
        className="w-3 h-3 bg-green-600"
      />
      {
        id !== 'start' && 
        <Handle 
          id="source-bottom" 
          type="source" 
          position={Position.Bottom} 
          isConnectable={true} 
          className="w-3 h-3 bg-red-600"
        />
      }
    </div>
  );
}
