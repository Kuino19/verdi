"use client";

import { motion } from "framer-motion";
import { 
  Network, 
  Search, 
  Filter, 
  Info, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut,
  MousePointer2,
  GitBranch,
  History
} from "lucide-react";
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [
  { 
    id: '1', 
    type: 'input',
    data: { label: 'Donoghue v Stevenson (1932)' }, 
    position: { x: 250, y: 0 },
    className: 'flow-node-landmark'
  },
  { 
    id: '2', 
    data: { label: 'Grant v Australian Knitting Mills (1936)' }, 
    position: { x: 100, y: 150 },
    className: 'flow-node'
  },
  { 
    id: '3', 
    data: { label: 'Hedley Byrne v Heller (1964)' }, 
    position: { x: 400, y: 150 },
    className: 'flow-node'
  },
  { 
    id: '4', 
    data: { label: 'Spartan Steel v Martin (1973)' }, 
    position: { x: 400, y: 300 },
    className: 'flow-node'
  },
  { 
    id: '5', 
    data: { label: 'Anns v Merton LBC (1978)' }, 
    position: { x: 250, y: 450 },
    className: 'flow-node-overruled'
  },
  { 
    id: '6', 
    type: 'output',
    data: { label: 'Caparo v Dickman (1990)' }, 
    position: { x: 250, y: 600 },
    className: 'flow-node-landmark'
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', label: 'Followed', markerEnd: { type: MarkerType.ArrowClosed, color: '#10B981' }, style: { stroke: '#10B981' } },
  { id: 'e1-3', source: '1', target: '3', label: 'Extended', markerEnd: { type: MarkerType.ArrowClosed, color: '#3B82F6' }, style: { stroke: '#3B82F6' } },
  { id: 'e3-4', source: '3', target: '4', label: 'Distinguished', markerEnd: { type: MarkerType.ArrowClosed, color: '#F59E0B' }, style: { stroke: '#F59E0B' } },
  { id: 'e1-5', source: '1', target: '5', label: 'Applied', markerEnd: { type: MarkerType.ArrowClosed, color: '#3B82F6' }, style: { stroke: '#3B82F6' } },
  { id: 'e5-6', source: '5', target: '6', label: 'Overruled', markerEnd: { type: MarkerType.ArrowClosed, color: '#EF4444' }, style: { stroke: '#EF4444' } },
];

export default function CaseFlowPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-6">
      <header className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Case<span className="text-gradient">Flow</span></h1>
          <p className="text-muted italic text-sm">Visualize case relationships and legal evolutions across decades.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 glass rounded-xl flex items-center gap-2 text-[10px] font-black text-muted uppercase tracking-widest">
              <History className="w-3.5 h-3.5" /> Law of Tort: Negligence
           </div>
           <button className="px-6 py-3 bg-primary text-background font-black rounded-xl text-xs flex items-center gap-2 hover:scale-105 transition-all">
              <Search className="w-4 h-4" /> Switch Area
           </button>
        </div>
      </header>

      <div className="flex-grow glass rounded-[40px] border-white/5 overflow-hidden relative group">
        <style>{`
          .react-flow__node {
            background: rgba(30, 41, 59, 0.7);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #F8FAFC;
            font-size: 11px;
            font-weight: 800;
            border-radius: 12px;
            padding: 15px;
            width: 180px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            font-style: italic;
          }
          .flow-node-landmark {
            border: 2px solid #C9A227 !important;
            box-shadow: 0 0 20px rgba(201, 162, 39, 0.2);
          }
          .flow-node-overruled {
            opacity: 0.6;
            border: 1px dashed #EF4444 !important;
            text-decoration: line-through;
          }
          .react-flow__edge-path {
            stroke-width: 2px;
          }
          .react-flow__edge-text {
            fill: #94A3B8;
            font-size: 9px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .react-flow__background {
            background-color: #0b1120;
          }
          .react-flow__controls button {
            background: rgba(30, 41, 59, 0.7);
            border: 1px solid rgba(255,255,255,0.1);
            color: #fff;
            border-radius: 8px;
            margin-bottom: 4px;
          }
          .react-flow__controls button:hover {
            background: #C9A227;
          }
          .react-flow__minimap {
            background-color: rgba(30, 41, 59, 0.8);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 20px;
          }
        `}</style>
        
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          className="bg-slate-950"
        >
          <Background color="rgba(255,255,255,0.05)" gap={20} />
          <Controls />
          <MiniMap nodeStrokeWidth={3} zoomable pannable />
        </ReactFlow>

        {/* Legend */}
        <div className="absolute bottom-6 left-6 glass p-6 rounded-3xl border-white/5 space-y-4 pointer-events-none">
           <h4 className="text-[10px] font-black text-muted uppercase tracking-widest mb-2 italic">Edge Legend</h4>
           <div className="space-y-3">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-[2px] bg-emerald-500"></div>
                 <span className="text-[10px] font-bold text-muted uppercase">Followed</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-8 h-[2px] bg-sky-500"></div>
                 <span className="text-[10px] font-bold text-muted uppercase">Applied / Extended</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-8 h-[2px] bg-amber-500"></div>
                 <span className="text-[10px] font-bold text-muted uppercase">Distinguished</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-8 h-[2px] bg-rose-500"></div>
                 <span className="text-[10px] font-bold text-muted uppercase">Overruled</span>
              </div>
           </div>
        </div>

        {/* Quick Actions overlay */}
        <div className="absolute top-6 right-6 flex flex-col gap-2">
           <button className="p-3 glass rounded-xl text-muted hover:text-primary transition-all"><Maximize2 className="w-5 h-5" /></button>
           <button className="p-3 glass rounded-xl text-muted hover:text-primary transition-all"><GitBranch className="w-5 h-5" /></button>
           <button className="p-3 glass rounded-xl text-muted hover:text-primary transition-all"><Info className="w-5 h-5" /></button>
        </div>
      </div>
    </div>
  );
}
