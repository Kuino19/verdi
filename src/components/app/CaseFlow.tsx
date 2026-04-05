"use client";

import React, { useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  Edge, 
  Node, 
  MarkerType,
  Handle,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'framer-motion';
import { Scale, Gavel, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// --- CUSTOM NODES ---

const CaseNode = ({ data }: any) => {
  const isCurrent = data.isCurrent;
  
  return (
    <div className={`
      px-6 py-4 rounded-3xl border shadow-2xl backdrop-blur-xl transition-all
      ${isCurrent 
        ? 'bg-primary/20 border-primary/40 min-w-[220px]' 
        : 'bg-slate-900/80 border-white/10 min-w-[180px] hover:border-white/30'
      }
    `}>
      <Handle type="target" position={Position.Top} className="opacity-0" />
      
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
           {isCurrent ? (
             <div className="p-1.5 bg-primary/20 rounded-lg">
                <Star className="w-3.5 h-3.5 text-primary fill-primary" />
             </div>
           ) : (
             <div className="p-1.5 bg-white/5 rounded-lg">
                <Scale className="w-3.5 h-3.5 text-muted" />
             </div>
           )}
           <span className="text-[10px] font-black text-muted uppercase tracking-widest">{data.year || 'N/A'}</span>
        </div>
        
        <h4 className={`text-xs font-bold leading-tight line-clamp-2 ${isCurrent ? 'text-foreground' : 'text-muted'}`}>
          {data.label}
        </h4>
        
        {!isCurrent && (
          <Link 
            href={`/cases/${data.id}`}
            className="mt-2 flex items-center gap-1.5 text-[9px] font-black text-primary uppercase tracking-widest hover:underline"
          >
            Explore <ArrowRight className="w-2.5 h-2.5" />
          </Link>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
};

const nodeTypes = {
  caseNode: CaseNode,
};

// --- MAIN COMPONENT ---

interface CaseFlowProps {
  currentCase: {
    id: string;
    title: string;
    year?: number;
  };
  links: {
    caseId: string;
    caseName: string;
    type: string;
    year?: number;
  }[];
}

export default function CaseFlow({ currentCase, links }: CaseFlowProps) {
  
  const { nodes, edges } = useMemo(() => {
    const initialNodes: Node[] = [];
    const initialEdges: Edge[] = [];

    // 1. Central Node (Current Case)
    initialNodes.push({
      id: 'current',
      type: 'caseNode',
      data: { 
        label: currentCase.title, 
        id: currentCase.id, 
        year: currentCase.year,
        isCurrent: true 
      },
      position: { x: 250, y: 150 },
    });

    // 2. Peripheral Nodes
    links.forEach((link, idx) => {
      const angle = (idx / links.length) * 2 * Math.PI;
      const radius = 250;
      const x = 250 + radius * Math.cos(angle);
      const y = 150 + radius * Math.sin(angle);

      initialNodes.push({
        id: link.caseId,
        type: 'caseNode',
        data: { 
          label: link.caseName, 
          id: link.caseId, 
          year: link.year,
          isCurrent: false 
        },
        position: { x, y },
      });

      // 3. Edges
      const isReverse = link.type.includes('by');
      const label = link.type.replace('_', ' ').toUpperCase();
      
      initialEdges.push({
        id: `e-${idx}`,
        source: isReverse ? link.caseId : 'current',
        target: isReverse ? 'current' : link.caseId,
        label: label,
        labelStyle: { fill: '#94a3b8', fontSize: 10, fontWeight: 900, fontStyle: 'italic' },
        labelBgPadding: [8, 4],
        labelBgBorderRadius: 4,
        labelBgStyle: { fill: '#0f172a', fillOpacity: 0.8 },
        animated: true,
        style: { stroke: isReverse ? '#10b981' : '#3b82f6', strokeWidth: 2, opacity: 0.6 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isReverse ? '#10b981' : '#3b82f6',
        },
      });
    });

    return { nodes: initialNodes, edges: initialEdges };
  }, [currentCase, links]);

  return (
    <div className="w-full h-[600px] border border-white/5 rounded-[48px] overflow-hidden bg-slate-950/50 backdrop-blur-sm relative">
      <div className="absolute top-8 left-8 z-10 space-y-2">
         <h3 className="text-xl font-bold italic flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Gavel className="w-5 h-5 text-primary" />
            </div>
            CaseFlow <span className="text-primary italic">Interactive Map</span>
         </h3>
         <p className="text-xs text-muted italic ml-13">Visualize the evolution of legal precedent.</p>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        className="bg-transparent"
        minZoom={0.5}
        maxZoom={1.5}
      >
        <Background color="#334155" gap={24} size={1} />
        <Controls className="bg-slate-900 border-white/10 fill-white" />
      </ReactFlow>

      {/* Legend */}
      <div className="absolute bottom-8 right-8 z-10 glass p-4 rounded-2xl border-white/5 space-y-2">
         <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-muted">
            <div className="w-2 h-2 rounded-full bg-blue-500" /> This Case Cited/Overruled
         </div>
         <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-muted">
            <div className="w-2 h-2 rounded-full bg-emerald-500" /> Cited By / Overruled By
         </div>
      </div>
    </div>
  );
}
