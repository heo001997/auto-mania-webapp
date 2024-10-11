import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { Node, BuiltInNode } from '@xyflow/react';
import { Play, Plus, PlusCircle, X } from 'lucide-react';

export type PositionLoggerNode = Node<{ label: string }, 'position-logger'>;
export type AppNode = BuiltInNode | PositionLoggerNode;

export function PositionLoggerNode({
  positionAbsoluteX,
  positionAbsoluteY,
  data,
}: NodeProps<PositionLoggerNode>) {
  const x = `${Math.round(positionAbsoluteX)}px`;
  const y = `${Math.round(positionAbsoluteY)}px`;

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
          onClick={(event) => {
            event?.stopPropagation();
            console.log('clicked add new node')
          }}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div>
        {x} {y}
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
