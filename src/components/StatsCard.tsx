import React from 'react';

interface StatsCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, value, label }) => {
  return (
    <div className="glass-card stats-card rounded-xl p-6 flex flex-col items-center text-center">
      <div className="mb-3 text-[#35CAA4]">{icon}</div>
      <div className="text-3xl font-bold mb-1 bg-gradient-to-r from-[#35CAA4] to-[#4A9EE8] bg-clip-text text-transparent">{value}</div>
      <div className="text-[#8BA1B1] text-sm">{label}</div>
    </div>
  );
};

export default StatsCard;