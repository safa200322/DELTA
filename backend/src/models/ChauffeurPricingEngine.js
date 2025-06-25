// src/models/ChauffeurPricingEngine.js

class ChauffeurPricingEngine {
  constructor() {
    this.dailyRate = 40; // Standard daily fee in USD
  }

  // Calculate total chauffeur fee based on number of days
  calculateFee(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    // Always at least 1 day
    const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    return days * this.dailyRate;
  }
}

module.exports = ChauffeurPricingEngine;
