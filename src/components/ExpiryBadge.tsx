import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { getTimeRemaining } from '../utils/time';

interface ExpiryBadgeProps {
  expiresAt: number;
}

const ExpiryBadge: React.FC<ExpiryBadgeProps> = ({ expiresAt }) => {
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(expiresAt));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(getTimeRemaining(expiresAt));
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [expiresAt]);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800/50 text-sm text-gray-300">
      <Clock size={14} />
      <span>Expires in {timeRemaining}</span>
    </div>
  );
};

export default ExpiryBadge;