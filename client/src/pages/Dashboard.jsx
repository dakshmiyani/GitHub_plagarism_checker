import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboard } from '../hooks/useDashboard';
import { formatRepoName } from '../utils/formatters';

// Components
import DashboardHeader from '../components/dashboard/DashboardHeader';
import RepoIdentityCard from '../components/dashboard/RepoIdentityCard';

// Analytics
import TechStackDonut from '../components/dashboard/analytics/TechStackDonut';
import CommitsPerDayBar from '../components/dashboard/analytics/CommitsPerDayBar';
import AvgCommitGap from '../components/dashboard/analytics/AvgCommitGap';
import ContributorsLeaderboard from '../components/dashboard/analytics/ContributorsLeaderboard';
import CommitHeatmap from '../components/dashboard/analytics/CommitHeatmap';
import CommitTimeline from '../components/dashboard/analytics/CommitTimeline';

// Similarity
import SimilarityLoadingState from '../components/dashboard/similarity/SimilarityLoadingState';
import OverallScoreMeters from '../components/dashboard/similarity/OverallScoreMeters';
import ScoreRadarChart from '../components/dashboard/similarity/ScoreRadarChart';
import SimilarityDistribution from '../components/dashboard/similarity/SimilarityDistribution';
import MatchTypeDonut from '../components/dashboard/similarity/MatchTypeDonut';
import AllMatchesTable from '../components/dashboard/similarity/AllMatchesTable';
import TopMatchDeepDive from '../components/dashboard/similarity/TopMatchDeepDive';
import ForkCloneMatches from '../components/dashboard/similarity/ForkCloneMatches';

import NewAnalysisInput from '../components/dashboard/shared/NewAnalysisInput';

const Dashboard = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const repoUrl = searchParams.get('repo');
    
    const { 
        analyticsData, 
        analyticsLoading, 
        analyticsError,
        plagiarismStatus,
        plagiarismReport,
        plagiarismError,
        elapsedSeconds
    } = useDashboard(repoUrl);

    useEffect(() => {
        if (!repoUrl) {
            navigate('/');
        }
    }, [repoUrl, navigate]);

    if (!repoUrl) return null;

    return (
        <div className="min-h-screen bg-[#050810] text-white font-mono selection:bg-cyan-500/30">
            <DashboardHeader 
                repoUrl={repoUrl} 
                analyticsLoading={analyticsLoading}
                analyticsError={analyticsError}
                plagiarismStatus={plagiarismStatus}
                plagiarismError={plagiarismError}
            />
            
            <main className="max-w-7xl mx-auto px-4 md:px-6 pt-24 pb-20 space-y-8">
                {/* Section 1: Identity */}
                <RepoIdentityCard 
                    data={analyticsData} 
                    loading={analyticsLoading} 
                    error={analyticsError}
                    repoUrl={repoUrl}
                />

                {/* Section 2: Analytics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <TechStackDonut data={analyticsData?.techStack} loading={analyticsLoading} />
                    <div className="lg:col-span-2">
                        <CommitsPerDayBar data={analyticsData?.commitsPerDay} loading={analyticsLoading} />
                    </div>
                    
                    <AvgCommitGap gapTime={analyticsData?.averageCommitGapTime} loading={analyticsLoading} />
                    <ContributorsLeaderboard contributors={analyticsData?.contributors} loading={analyticsLoading} />
                    <div className="lg:col-span-2">
                         <CommitHeatmap data={analyticsData?.commitsPerDay} loading={analyticsLoading} />
                    </div>

                    <div className="lg:col-span-3">
                        <CommitTimeline history={analyticsData?.commitHistory} loading={analyticsLoading} />
                    </div>
                </div>

                {/* Section 3: Similarity Section */}
                <div className="pt-12 border-t border-white/5">
                    <div className="mb-8">
                        <h2 className="orbitron text-2xl font-black text-white flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-cyan-400 rounded-full" />
                            SIMILARITY ANALYSIS
                        </h2>
                    </div>

                    <AnimatePresence mode="wait">
                        {(plagiarismStatus === 'active' || plagiarismStatus === 'waiting' || plagiarismStatus === 'idle') ? (
                            <SimilarityLoadingState key="loading" elapsed={elapsedSeconds} status={plagiarismStatus} />
                        ) : plagiarismStatus === 'failed' ? (
                            <motion.div 
                                key="error"
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }}
                                className="glass-card p-12 border-crimson/30 bg-crimson/5 text-center"
                            >
                                <div className="text-crimson orbitron text-xl font-bold mb-4 uppercase">Scan Failed</div>
                                <p className="text-slate-400 font-mono mb-8">{plagiarismError}</p>
                                <button onClick={() => window.location.reload()} className="px-8 py-3 bg-crimson text-white rounded font-bold">Retry Scan</button>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="content"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-8"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <OverallScoreMeters report={plagiarismReport?.report} />
                                    <ScoreRadarChart topMatch={plagiarismReport?.report?.topMatch} />
                                    <div className="lg:col-span-2">
                                        <SimilarityDistribution matches={plagiarismReport?.report?.allMatches} />
                                    </div>
                                    <MatchTypeDonut matches={plagiarismReport?.report?.allMatches} metadata={plagiarismReport?.report} />
                                </div>
                                
                                <AllMatchesTable matches={plagiarismReport?.report?.allMatches} />
                                
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2">
                                        <TopMatchDeepDive topMatch={plagiarismReport?.report?.topMatch || plagiarismReport?.report?.allMatches?.[0]} />
                                    </div>
                                    <ForkCloneMatches matches={plagiarismReport?.report?.forkAndCloneMatches} />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Section 4: New Analysis */}
                <NewAnalysisInput currentRepo={repoUrl} />
            </main>
        </div>
    );
};

export default Dashboard;
