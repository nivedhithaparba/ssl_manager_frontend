import React from 'react';
import { ShieldOff } from 'lucide-react';
import CertificateCard from './CertificateCard';

const CertificateList = ({ certificates, onAction }) => {
  if (certificates.length === 0) {
    return (
      <div className="glass-bg rounded-xl p-12 text-center animate-slide-up">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldOff className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No SSL Certificates</h3>
        <p className="text-gray-600">Generate your first SSL certificate to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Your Certificates ({certificates.length})
      </h3>
      {certificates.map((certificate) => (
        <CertificateCard
          key={certificate.id}
          certificate={certificate}
          onAction={onAction}
        />
      ))}
    </div>
  );
};

export default CertificateList;
