import React from 'react';
import { Shield, AlertTriangle, Zap, Users } from 'lucide-react';

const StatsCard = ({ title, value, icon, color, description }) => {
  const iconMap = {
    shield: Shield,
    'alert-triangle': AlertTriangle,
    zap: Zap,
    users: Users
  };

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
    red: 'from-red-500 to-red-600'
  };

  const IconComponent = iconMap[icon] || Shield;

  return (
    <div className="glass-bg rounded-xl p-6 card-hover animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
        <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]}`}>
          <IconComponent className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
