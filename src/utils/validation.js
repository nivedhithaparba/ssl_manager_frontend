export const validation = {
  validateDomain(domain) {
    if (!domain || typeof domain !== 'string') return false;
    
    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    const cleanDomain = domain.trim().toLowerCase();
    
    if (cleanDomain.length === 0 || cleanDomain.length > 255) return false;
    if (cleanDomain.startsWith('.') || cleanDomain.endsWith('.')) return false;
    if (cleanDomain.includes('..')) return false;
    
    return domainRegex.test(cleanDomain);
  },

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validatePassword(password) {
    return password && password.length >= 6;
  },

  getDaysUntilExpiry(expiryDate) {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  getStatusInfo(expiryDate, autoRenew) {
    const days = this.getDaysUntilExpiry(expiryDate);
    
    if (days <= 0) {
      return { text: 'Expired', color: 'red', urgent: true };
    }
    if (days <= 7) {
      return { text: 'Critical', color: 'red', urgent: true };
    }
    if (days <= 30) {
      return { text: 'Expiring Soon', color: 'yellow', urgent: false };
    }
    
    return { 
      text: autoRenew ? 'Auto-Renew' : 'Valid', 
      color: autoRenew ? 'purple' : 'green',
      urgent: false 
    };
  },

  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
};
