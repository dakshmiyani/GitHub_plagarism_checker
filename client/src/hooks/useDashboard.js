import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:3000/open/api';

export const useDashboard = (repoUrl) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState(null);

  const [plagiarismJobId, setPlagiarismJobId] = useState(null);
  const [plagiarismStatus, setPlagiarismStatus] = useState('idle'); // idle | waiting | active | completed | failed
  const [plagiarismReport, setPlagiarismReport] = useState(null);
  const [plagiarismError, setPlagiarismError] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const fetchAnalytics = useCallback(async (url) => {
    setAnalyticsLoading(true);
    setAnalyticsError(null);
    try {
      const resp = await axios.post(`${API_BASE}/github/github_analytics`, { repoUrl: url });
      if (resp.data.success) {
        setAnalyticsData(resp.data.data);
      } else {
        setAnalyticsError('Failed to fetch analytics');
      }
    } catch (err) {
      setAnalyticsError(err.message || 'Error connecting to analytics engine');
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  const startPlagiarismScan = useCallback(async (url) => {
    setPlagiarismStatus('waiting');
    setPlagiarismError(null);
    setElapsedSeconds(0);
    try {
      const resp = await axios.post(`${API_BASE}/plagiarism/check`, { repoUrl: url });
      if (resp.data.success) {
        setPlagiarismJobId(resp.data.jobId);
        setPlagiarismStatus('active');
      } else {
        setPlagiarismError(resp.data.message || 'Failed to start scan');
        setPlagiarismStatus('failed');
      }
    } catch (err) {
      setPlagiarismError(err.message || 'Error starting plagiarism scan');
      setPlagiarismStatus('failed');
    }
  }, []);

  const pollJob = useCallback(async (jobId) => {
    try {
      const resp = await axios.get(`${API_BASE}/plagiarism/job/${jobId}`);
      const status = resp.data.status;
      
      if (status === 'completed') {
        setPlagiarismReport(resp.data.result);
        setPlagiarismStatus('completed');
      } else if (status === 'failed') {
        setPlagiarismError(resp.data.failedReason || 'Job failed on server');
        setPlagiarismStatus('failed');
      } else {
        setPlagiarismStatus(status); // waiting or active
      }
    } catch (err) {
      // Don't mark as failed immediately on single network error during polling
      console.error('Polling error:', err);
    }
  }, []);

  useEffect(() => {
    if (!repoUrl) return;
    fetchAnalytics(repoUrl);
    startPlagiarismScan(repoUrl);
  }, [repoUrl, fetchAnalytics, startPlagiarismScan]);

  useEffect(() => {
    if (!plagiarismJobId || plagiarismStatus === 'completed' || plagiarismStatus === 'failed') return;
    
    const interval = setInterval(() => {
      pollJob(plagiarismJobId);
      setElapsedSeconds(prev => prev + 3);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [plagiarismJobId, plagiarismStatus, pollJob]);

  return {
    analyticsData,
    analyticsLoading,
    analyticsError,
    plagiarismStatus,
    plagiarismReport,
    plagiarismError,
    elapsedSeconds,
    refresh: () => {
        fetchAnalytics(repoUrl);
        startPlagiarismScan(repoUrl);
    }
  };
};
