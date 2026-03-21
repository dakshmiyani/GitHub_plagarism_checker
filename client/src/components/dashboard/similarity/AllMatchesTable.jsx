import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { GlassCard } from '../shared/Components';
import { ChevronDown, ChevronUp, ExternalLink, AlertTriangle } from 'lucide-react';

const AllMatchesTable = ({ matches }) => {
    const [sortKey, setSortKey] = useState('similarity');
    const [sortOrder, setSortOrder] = useState('desc');
    const [expandedRow, setExpandedRow] = useState(null);
    const [page, setPage] = useState(0);
    const pageSize = 8;

    const data = [...(matches || [])].sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];
        if (sortOrder === 'desc') return valB - valA;
        return valA - valB;
    });

    const paginatedData = data.slice(page * pageSize, (page + 1) * pageSize);

    const toggleSort = (key) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
        } else {
            setSortKey(key);
            setSortOrder('desc');
        }
    };

    return (
        <GlassCard className="p-0 overflow-visible">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="orbitron text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1 h-4 bg-emerald-500 rounded-full" />
                    Global Repository Correlation Index
                </h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                    <thead>
                        <tr className="bg-white/2 border-b border-white/5">
                            <th onClick={() => toggleSort('repository')} className="px-6 py-4 cursor-pointer hover:text-cyan-400 uppercase tracking-tighter">Candidate Source</th>
                            <th className="px-6 py-4 uppercase tracking-tighter">Vector</th>
                            <th onClick={() => toggleSort('similarity')} className="px-6 py-4 cursor-pointer hover:text-cyan-400 uppercase tracking-tighter">Sim %</th>
                            <th onClick={() => toggleSort('structuralScore')} className="px-6 py-4 cursor-pointer hover:text-cyan-400 uppercase tracking-tighter">AST Delta</th>
                            <th onClick={() => toggleSort('containment')} className="px-6 py-4 cursor-pointer hover:text-cyan-400 uppercase tracking-tighter">Containment</th>
                            <th className="px-6 py-4 uppercase tracking-tighter">Flags</th>
                            <th className="px-4 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/2">
                        {paginatedData.map((m, i) => (
                            <React.Fragment key={m.repository}>
                                <tr 
                                    className={`group hover:bg-white/[0.03] transition-all cursor-pointer ${expandedRow === i ? 'bg-cyan-500/5' : ''}`}
                                    onClick={() => setExpandedRow(expandedRow === i ? null : i)}
                                >
                                    <td className="px-6 py-4 max-w-[200px] truncate">
                                        <div className="flex items-center gap-2">
                                            <span className="text-white group-hover:text-cyan-400 transition-colors">{m.repository.split('/').slice(-2).join('/')}</span>
                                            <a href={m.repository} target="_blank" rel="noopener noreferrer" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ExternalLink size={12} className="text-slate-500 hover:text-cyan-400" />
                                            </a>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                            m.matchType === 'code-search' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                                        }`}>
                                            {m.matchType.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1 w-20">
                                            <span className={`font-bold ${m.similarity > 30 ? 'text-crimson' : m.similarity > 15 ? 'text-amber-500' : 'text-cyan-400'}`}>
                                                {m.similarity}%
                                            </span>
                                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                                <div className={`h-full ${m.similarity > 30 ? 'bg-crimson' : m.similarity > 15 ? 'bg-amber-500' : 'bg-cyan-400'}`} style={{ width: `${m.similarity}%` }} />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-400">{m.structuralScore}%</td>
                                    <td className="px-6 py-4 text-slate-400">{m.containment}%</td>
                                    <td className="px-6 py-4">
                                        {m.lineMatchFlagged ? (
                                            <div className="flex items-center gap-1 text-amber-500" title="Significant line-by-line overlap detected">
                                                <AlertTriangle size={12} />
                                                <span className="text-[9px]">LITERAL</span>
                                            </div>
                                        ) : (
                                            <span className="text-slate-700">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        {expandedRow === i ? <ChevronUp size={16} className="text-cyan-400" /> : <ChevronDown size={16} className="text-slate-600 group-hover:text-white" />}
                                    </td>
                                </tr>
                                <AnimatePresence>
                                    {expandedRow === i && (
                                        <tr>
                                            <td colSpan="7" className="p-0 bg-black/40 border-b border-white/5">
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-6 space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="text-[10px] text-slate-500 uppercase tracking-widest">Matched Source Fragments</div>
                                                            <div className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">Strategy: {m.matchType}</div>
                                                        </div>
                                                        <div className="rounded-xl overflow-hidden border border-white/5 shadow-inner">
                                                            <SyntaxHighlighter 
                                                                language="javascript" 
                                                                style={vscDarkPlus}
                                                                customStyle={{ margin: 0, padding: '20px', background: 'rgba(0,0,0,0.3)', fontSize: '10px' }}
                                                            >
                                                                {m.sampleMatchedLines?.join('\n') || '// No direct line matches in metadata'}
                                                            </SyntaxHighlighter>
                                                        </div>
                                                        <div className="flex gap-4">
                                                            <div className="flex flex-col">
                                                                <span className="text-[8px] text-slate-600 uppercase">Literal Score</span>
                                                                <span className="text-xs text-white">{m.literalScore}%</span>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[8px] text-slate-600 uppercase">Matched Lines</span>
                                                                <span className="text-xs text-white font-bold text-cyan-400">{m.matchedLineCount} / {m.baseLineCount}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </td>
                                        </tr>
                                    )}
                                </AnimatePresence>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-white/5 flex items-center justify-between">
                <div className="text-[10px] text-slate-600">Showing {page * pageSize + 1} - {Math.min((page + 1) * pageSize, data.length)} of {data.length} Candidates</div>
                <div className="flex gap-2">
                    <button 
                        disabled={page === 0}
                        onClick={() => setPage(p => p - 1)}
                        className="px-3 py-1 bg-white/5 rounded text-[10px] disabled:opacity-30 hover:bg-white/10 transition-colors"
                    >
                        PREV
                    </button>
                    <button 
                        disabled={(page + 1) * pageSize >= data.length}
                        onClick={() => setPage(p => p + 1)}
                        className="px-3 py-1 bg-white/5 rounded text-[10px] disabled:opacity-30 hover:bg-white/10 transition-colors"
                    >
                        NEXT
                    </button>
                </div>
            </div>
        </GlassCard>
    );
};

export default AllMatchesTable;
