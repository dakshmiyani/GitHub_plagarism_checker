import { format, formatDistanceToNow } from 'date-fns';

export const formatRepoName = (url) => {
  if (!url) return 'Unknown Repository';
  try {
    const parts = url.replace(/\.git$/, '').split('/');
    return parts.slice(-2).join('/');
  } catch (e) {
    return url;
  }
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  return format(new Date(dateString), 'MMMM d, yyyy');
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
};

export const formatGapTime = (duration) => {
  if (!duration) return '00h 00m 00s';
  const parts = duration.split(':');
  if (parts.length === 3) {
    return `${parts[0]}h ${parts[1]}m ${parts[2]}s`;
  }
  return duration;
};

export const getGapColor = (duration) => {
  if (!duration) return 'text-slate-500';
  const parts = duration.split(':');
  const hours = parseInt(parts[0]);
  if (hours < 1) return 'text-emerald-400';
  if (hours < 12) return 'text-cyan-400';
  if (hours < 48) return 'text-amber-400';
  return 'text-crimson';
};

export const getVerdictStyles = (verdict) => {
  const v = verdict.toLowerCase();
  if (v.includes('high')) return { bg: 'bg-red-500/20', border: 'border-crimson/50', text: 'text-crimson', pulse: 'animate-pulse' };
  if (v.includes('moderate')) return { bg: 'bg-amber-500/20', border: 'border-amber-500/50', text: 'text-amber-500', pulse: 'none' };
  return { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-400', pulse: 'none' };
};
