import React, { useState, useEffect } from 'react';
import StatsCard from './StatsCard';
import DomainForm from './DomainForm';
import CertificateList from './CertificateList';
import { validation } from '../utils/validation';

const Dashboard = ({ onToast }) => {
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      const result = await window.trickleListObjects('ssl-certificate', 100, true);
      setCertificates(result.items || []);
    } catch (error) {
      onToast('Failed to load certificates', 'error');
    }
  };

  const handleGenerateCertificate = async (domain) => {
    setIsLoading(true);
    try {
      const certificateData = {
        domain,
        issueDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        autoRenew: false,
        status: 'active'
      };
      
      await window.trickleCreateObject('ssl-certificate', certificateData);
      await loadCertificates();
      onToast(`SSL certificate generated for ${domain}`, 'success');
    } catch (error) {
      onToast('Failed to generate certificate', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCertificateAction = async (action, certificate) => {
    try {
      switch (action) {
        case 'renew':
          const renewData = {
            ...certificate.objectData,
            issueDate: new Date().toISOString(),
            expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
          };
          await window.trickleUpdateObject('ssl-certificate', certificate.objectId, renewData);
          onToast(`Certificate renewed for ${certificate.objectData.domain}`, 'success');
          break;
        case 'toggle-auto':
          const autoData = {
            ...certificate.objectData,
            autoRenew: !certificate.objectData.autoRenew
          };
          await window.trickleUpdateObject('ssl-certificate', certificate.objectId, autoData);
          onToast(`Auto-renewal ${autoData.autoRenew ? 'enabled' : 'disabled'}`, 'success');
          break;
        case 'delete':
          await window.trickleDeleteObject('ssl-certificate', certificate.objectId);
          onToast(`Certificate deleted for ${certificate.objectData.domain}`, 'success');
          break;
      }
      await loadCertificates();
    } catch (error) {
      onToast('Action failed. Please try again.', 'error');
    }
  };

  const stats = {
    total: certificates.length,
    expiring: certificates.filter(c => 
      validation.getDaysUntilExpiry(c.objectData?.expiryDate) <= 30
    ).length,
    autoRenew: certificates.filter(c => c.objectData?.autoRenew).length
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Certificates"
          value={stats.total}
          icon="shield"
          color="blue"
          description="Active certificates"
        />
        <StatsCard
          title="Expiring Soon"
          value={stats.expiring}
          icon="alert-triangle"
          color="yellow"
          description="Within 30 days"
        />
        <StatsCard
          title="Auto-Renewal"
          value={stats.autoRenew}
          icon="zap"
          color="green"
          description="Automated renewals"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div>
          <DomainForm onSubmit={handleGenerateCertificate} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-2">
          <CertificateList 
            certificates={certificates.map(c => ({
              id: c.objectId,
              domain: c.objectData?.domain,
              expiryDate: c.objectData?.expiryDate,
              autoRenew: c.objectData?.autoRenew,
              ...c.objectData
            }))} 
            onAction={handleCertificateAction} 
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
