interface StalenessBadgeProps {
  lastUpdated: string;
}

const calculateStaleness = (lastUpdated: Date): 'fresh' | 'stale' | 'very_stale' => {
  const diffDays = Math.floor((Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 30) return 'fresh';
  if (diffDays <= 60) return 'stale';
  return 'very_stale';
};

export default function StalenessBadge({ lastUpdated }: StalenessBadgeProps) {
  const staleness = calculateStaleness(new Date(lastUpdated));
  
  const badges = {
    fresh: <span className="badge-fresh">Fresh</span>,
    stale: <span className="badge-stale">Stale</span>,
    very_stale: <span className="badge-very-stale">Outdated</span>,
  };

  return badges[staleness];
}
