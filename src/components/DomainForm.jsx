import React, { useState } from 'react';
import { PlusCircle, Globe, ShieldCheck } from 'lucide-react';
import { validation } from '../utils/validation';
import LoadingSpinner from './LoadingSpinner';
import { apiService } from '../utils/api';

const DomainForm = ({ onSubmit, isLoading }) => {
        const [domain, setDomain] = useState('');
        const [error, setError] = useState('');
        const [step, setStep] = useState(1); // 1: Enter domain, 2: DNS record, 3: Verify, 4: Generate SSL
        const [dnsRecord, setDnsRecord] = useState(null);
        const [isVerifying, setIsVerifying] = useState(false);
        const [isVerified, setIsVerified] = useState(false);
        const [isGeneratingDNS, setIsGeneratingDNS] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validation.validateDomain(domain)) {
      setError('Please enter a valid domain (e.g., example.com)');
      return;
    }

            setIsGeneratingDNS(true);
            try {
                console.log('Generate DNS Record Request:', { domain });
                const response = await apiService.generateDNSRecord(domain);
                console.log('Generate DNS Record Response:', response);
                
                if (response) {
                    setDnsRecord(response);
                    setStep(2);
                } else {
                    throw new Error('Failed to generate DNS record');
                }
            } catch (err) {
                setError(err.message || 'Failed to generate DNS record');
            } finally {
                setIsGeneratingDNS(false);
            }
        };

        const handleCopyToClipboard = (text) => {
            navigator.clipboard.writeText(text).then(() => {
                // Could add a brief toast here
            });
        };

        const handleVerifyDNS = async () => {
            setIsVerifying(true);
            setError('');
            
            try {
                console.log('Verify DNS Record Request:', { domain, name: dnsRecord.name, value: dnsRecord.value });
                const response = await apiService.verifyDNSRecord(domain, dnsRecord.name, dnsRecord.value);
                console.log('Verify DNS Record Response:', response);
                
                if (response?.verified) {
                    setIsVerified(response.verified);
                    setStep(3);
                } else {
                    throw new Error('DNS record verification failed');
                }
            } catch (err) {
                  console.error('Verify DNS Error:', err); // ✅ log the real error
                setError(err.message || 'DNS record not found. Please ensure the TXT record is properly configured.');
            } finally {
                setIsVerifying(false);
            }
        };

        const handleGenerateSSL = async () => {
            try {
                await onSubmit(domain, dnsRecord);
                // Reset form
                setDomain('');
                setStep(1);
                setDnsRecord(null);
                setIsVerified(false);
            } catch (err) {
                setError(err.message || 'Failed to generate SSL certificate');
            }
        };

        const resetForm = () => {
            setDomain('');
            setStep(1);
            setDnsRecord(null);
            setIsVerified(false);
            setError('');
        };

        return (
            <div className="glass-bg rounded-xl p-6 slide-up">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <i data-lucide="shield-check" className="w-5 h-5 mr-2 text-blue-600"></i>
                    Generate SSL Certificate
                </h3>

                {/* Step 1: Enter Domain */}
                {step === 1 && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Domain Name
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={domain}
                                    onChange={(e) => setDomain(e.target.value)}
                                    placeholder="example.com"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                                    disabled={isGeneratingDNS}
                                />
                                <i data-lucide="globe" className="absolute right-3 top-3 w-5 h-5 text-gray-400"></i>
                            </div>
                        </div>
                        
                        <button
                            type="submit"
                            disabled={isGeneratingDNS || !domain.trim()}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                        >
                            {isGeneratingDNS ? (
                                <LoadingSpinner size= 'sm' color= 'white' />
                            ) : (
                                <i data-lucide="dns" className="w-4 h-4 mr-2"></i>
                            )}
                            {isGeneratingDNS ? 'Generating DNS Record...' : 'Generate DNS Record'}
                        </button>
                    </form>
                )}

                {/* Step 2: Show DNS TXT Record */}
                {step === 2 && dnsRecord && (
                    <div className="space-y-4">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <h4 className="font-semibold text-yellow-800 mb-2">Add DNS TXT Record</h4>
                            <p className="text-sm text-yellow-700 mb-3">
                                Add the following TXT record to your domain's DNS settings:
                            </p>
                            
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Name/Host:</label>
                                    <div className="flex items-center bg-white border rounded px-3 py-2">
                                        <code className="flex-1 text-sm font-mono">{dnsRecord.name}</code>
                                        <button
                                            onClick={() => handleCopyToClipboard(dnsRecord.name)}
                                            className="ml-2 p-1 text-gray-500 hover:text-blue-600"
                                            title="Copy to clipboard"
                                        >
                                            <i data-lucide="copy" className="w-4 h-4"></i>
                                        </button>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Value:</label>
                                    <div className="flex items-center bg-white border rounded px-3 py-2">
                                        <code className="flex-1 text-sm font-mono break-all">{dnsRecord.value}</code>
                                        <button
                                            onClick={() => handleCopyToClipboard(dnsRecord.value)}
                                            className="ml-2 p-1 text-gray-500 hover:text-blue-600"
                                            title="Copy to clipboard"
                                        >
                                            <i data-lucide="copy" className="w-4 h-4"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={resetForm}
                                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleVerifyDNS}
                                disabled={isVerifying}
                                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
                            >
                                {isVerifying ? (
                                    <LoadingSpinner size= 'sm' color= 'white' />
                                ) : (
                                    <i data-lucide="check-circle" className="w-4 h-4 mr-2"></i>
                                )}
                                {isVerifying ? 'Verifying...' : 'Verify DNS Record'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Verified - Show Generate SSL Button */}
                {step === 3 && isVerified && (
                    <div className="space-y-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center">
                                <i data-lucide="check-circle" className="w-5 h-5 text-green-600 mr-2"></i>
                                <h4 className="font-semibold text-green-800">DNS Record Verified!</h4>
                            </div>
                            <p className="text-sm text-green-700 mt-1">
                                Your domain {domain} is ready for SSL certificate generation.
                            </p>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={resetForm}
                                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300"
                            >
                                Start Over
                            </button>
                            <button
                                onClick={handleGenerateSSL}
                                disabled={isLoading}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <LoadingSpinner size= 'sm' color= 'white' />
                                ) : (
                                    <i data-lucide="shield-check" className="w-4 h-4 mr-2"></i>
                                )}
                                {isLoading ? 'Generating SSL...' : 'Generate SSL Certificate'}
                            </button>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}
            </div>
        );
};

export default DomainForm;
