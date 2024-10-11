import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { Node, BuiltInNode } from '@xyflow/react';
import { debug } from 'console';
import { Play, Plus, PlusCircle, X } from 'lucide-react';
import { useId } from 'react';

export type PositionLoggerNode = Node<{ label: string; setNodes?: (nodes: AppNode[]) => void }, 'position-logger'>;
export type AppNode = BuiltInNode | PositionLoggerNode;

export function PositionLoggerNode({
  positionAbsoluteX,
  positionAbsoluteY,
  data,
}: NodeProps<PositionLoggerNode>) {
  const x = Math.round(positionAbsoluteX);
  const y = Math.round(positionAbsoluteY);
  const displayX = x + 'px';
  const displayY = y + 'px';

  function handleAddNode(event: React.MouseEvent, x: number, y: number) {
    event.stopPropagation();

    const position = {
      x: x + 200,
      y: y,
    };
    const newNode = {
      id: crypto.randomUUID(),
      type: 'position-logger',
      position: position,
      data: { label: `New Action`, setNodes: data.setNodes },
    };

    data.setNodes && data.setNodes((prevNodes) => {
      console.log("prevNodes: ", prevNodes)
      console.log("newNode: ", newNode)
      return [...prevNodes, newNode]
    });

    console.log('clicked add new node')
  }

  return (
    // We add this class to use the same styles as React Flow's default nodes.
    <div className="group react-flow__node-default relative">
      {data.label && <div>{data.label}</div>}

      <div className="absolute top-[-20px] left-0 right-0 h-[20px] hidden group-hover:block">
        <button className="absolute left-0 bg-white rounded-full shadow-md w-4 h-4 flex items-center justify-center"
          onClick={(event) => {
            event?.stopPropagation();
            console.log('clicked delete')
          }}
        >
          <X className="w-4 h-4" />
        </button>
        <button className="absolute right-5 bg-white rounded-full shadow-md w-4 h-4 flex items-center justify-center"
          onClick={(event) => {
            event?.stopPropagation();
            console.log('clicked run')
          }}
        >
          <Play className="w-4 h-4" />
        </button>
        <button className="absolute right-0 bg-white rounded-full shadow-md w-4 h-4 flex items-center justify-center"
          onClick={(e) => handleAddNode(e, x, y)}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div>
        {displayX} {displayY}
      </div>

      <Handle 
        id="target-left" 
        type="target" 
        position={Position.Left} 
        isConnectable={true} 
        className="w-3 h-3 bg-green-600"
      />
      <Handle 
        id="source-right" 
        type="source" 
        position={Position.Right} 
        isConnectable={true} 
        className="w-3 h-3 bg-green-600"
      />
      <Handle 
        id="source-bottom" 
        type="source" 
        position={Position.Bottom} 
        isConnectable={true} 
        className="w-3 h-3 bg-red-600"
      />
    </div>
  );
}
