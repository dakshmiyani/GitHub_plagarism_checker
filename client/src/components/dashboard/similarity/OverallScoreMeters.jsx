import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { GlassCard } from '../shared/Components';
import { getVerdictStyles } from '../../../utils/formatters';

const OverallScoreMeters = ({ report }) => {
    const [score, setScore] = useState(0);
    const [unique, setUnique] = useState(0);

    const verdict = report?.verdict || "No Plagiarism Detected";
    const styles = getVerdictStyles(verdict);

    useEffect(() => {
        const timer = setTimeout(() => {
            setScore(report?.plagiarismScore || 0);
            setUnique(report?.uniquenessScore || 0);
        }, 500);
        return () => clearTimeout(timer);
    }, [report]);

    const metadata = [
        { label: 'Files Analyzed', value: report?.totalFilesAnalyzed },
        { label: 'Tokens', value: report?.totalTokens?.toLocaleString() },
        { label: 'Fingerprints', value: report?.totalFingerprintsGenerated?.toLocaleString() },
        { label: 'K-Gram Size', value: report?.kGramSizeUsed },
        { label: 'Scan Time', value: `${report?.timeTakenSeconds}s` },
        { label: 'Candidates', value: report?.candidatesChecked }
    ];

    return (
        <GlassCard className="h-full flex flex-col min-h-[400px]">
            <h3 className="orbitron text-sm font-bold text-white mb-8 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1 h-4 bg-crimson rounded-full" />
                Score Matrix Verdict
            </h3>

            <div className="flex items-center justify-around mb-10">
                <div className="w-32 h-32 text-center">
                    <CircularProgressbar
                        value={score}
                        text={`${score}%`}
                        strokeWidth={10}
                        styles={buildStyles({
                            pathColor: '#FF4365',
                            textColor: '#FF4365',
                            trailColor: 'rgba(255,255,255,0.05)',
                            textSize: '20px',
                            pathTransitionDuration: 1.5
                        })}
                    />
                    <span className="font-mono text-[10px] text-slate-500 uppercase mt-4 block">Similarity</span>
                </div>

                <div className="w-32 h-32 text-center">
                    <CircularProgressbar
                        value={unique}
                        text={`${unique}%`}
                        strokeWidth={10}
                        styles={buildStyles({
                            pathColor: '#10F587',
                            textColor: '#10F587',
                            trailColor: 'rgba(255,255,255,0.05)',
                            textSize: '20px',
                            pathTransitionDuration: 1.5
                        })}
                    />
                    <span className="font-mono text-[10px] text-slate-500 uppercase mt-4 block">Originality</span>
                </div>
            </div>

            <div className={`w-full py-4 rounded-xl text-center orbitron text-xs font-black tracking-widest border transition-all duration-1000 ${styles.bg} ${styles.border} ${styles.text} ${styles.pulse}`}>
                {verdict.toUpperCase()}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-y-4 gap-x-8">
                {metadata.map(m => (
                    <div key={m.label} className="flex flex-col">
                        <span className="font-mono text-[9px] text-slate-500 uppercase tracking-tighter">{m.label}</span>
                        <span className="orbitron text-[10px] font-bold text-white uppercase">{m.value}</span>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
};

export default OverallScoreMeters;
