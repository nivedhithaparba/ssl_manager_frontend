import { useState } from "react";

const DomainInput = ({ onSubmit, isLoading }) => {

        const [domain, setDomain] = useState('');
        const [error, setError] = useState('');
        const [focused, setFocused] = useState(false);

        const handleSubmit = async (e) => {
            e.preventDefault();
            setError('');

            if (!validateDomain(domain)) {
                setError('Please enter a valid domain (e.g., example.com)');
                return;
            }

            try {
                await onGenerate(domain);
                setDomain('');
            } catch (err) {
                setError('Failed to generate SSL certificate. Please try again.');
            }
        };

        return (
            <div 
                className="glass-effect rounded-2xl p-6 card-glow slide-in-right"
                data-name="domain-input"
                data-file="components/DomainInput.js"
            >
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <i data-lucide="plus-circle" className="w-5 h-5 mr-2 text-blue-600"></i>
                    Generate SSL Certificate
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Domain Name
                        </label>
                        <div className={`relative transition-all duration-200 ${focused ? 'transform scale-105' : ''}`}>
                            <input
                                type="text"
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                                onFocus={() => setFocused(true)}
                                onBlur={() => setFocused(false)}
                                placeholder="example.com"
                                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                disabled={isLoading}
                            />
                            <i data-lucide="globe" className="absolute right-4 top-4 w-5 h-5 text-gray-400"></i>
                        </div>
                        {error && (
                            <p className="text-red-600 text-sm mt-2 bounce-in">{error}</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading || !domain.trim()}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                    >
                        {isLoading ? (
                            <LoadingSpinner size="sm" color="white" />
                        ) : (
                            <i data-lucide="shield-check" className="w-5 h-5 mr-2"></i>
                        )}
                        {isLoading ? 'Generating Certificate...' : 'Generate SSL Certificate'}
                    </button>
                </form>
            </div>
        );
    };

export default DomainInput;

