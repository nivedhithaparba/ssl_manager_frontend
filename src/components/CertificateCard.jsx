import React from 'react';
import { Globe, RefreshCw, Zap, Trash2 } from 'lucide-react';
import { validation } from '../utils/validation';

const CertificateCard = ({ certificate, onAction }) => {
  const status = validation.getStatusInfo(certificate.expiryDate, certificate.autoRenew);
  const expiryDays = validation.getDaysUntilExpiry(certificate.expiryDate);

  const statusColors = {
    red: 'bg-red-100 text-red-800 border-red-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200'
  };

  return (
    <div className="glass-bg rounded-xl p-6 card-hover animate-bounce-in">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <Globe className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{certificate.domain}</h3>
            <p className="text-sm text-gray-500">
              Expires: {validation.formatDate(certificate.expiryDate)}
            </p>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusColors[status.color]}`}>
          {status.text}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {expiryDays > 0 ? `${expiryDays} days left` : 'Expired'}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onAction('renew', certificate)}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Renew Certificate"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => onAction('toggle-auto', certificate)}
            className={`p-2 rounded-lg transition-colors ${certificate.autoRenew ? 'text-purple-600 hover:bg-purple-50' : 'text-gray-600 hover:bg-gray-50'}`}
            title="Toggle Auto-Renewal"
          >
            <Zap className="w-4 h-4" />
          </button>
          <button
            onClick={() => onAction('delete', certificate)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Certificate"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateCard;
