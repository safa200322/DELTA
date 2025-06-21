class MotorcyclePricingEngine {
  constructor() {
    this.brandBasePrices = {
      'Yamaha': 40,
      'Honda': 38,
      'Kawasaki': 42,
      'Suzuki': 36,
      'Harley-Davidson': 60,
      'BMW': 65,
      'Ducati': 75,
      'KTM': 50,
      'Triumph': 58,
      'Royal Enfield': 35
    };

    this.typeMultipliers = {
      Sport: 1.3,
      Cruiser: 1.2,
      Touring: 1.25,
      Standard: 1.0
    };


    this.MIN_DAILY_PRICE = 20;
  }

  calculatePrice({ Brand, Engine, Year, Type }, Location = null) {
    let price = this.brandBasePrices[Brand] || 35;

    // Depreciation based on Year
    const currentYear = new Date().getFullYear();
    const age = currentYear - Year;

    if (age <= 1) price *= 0.85;
    else if (age <= 5) price *= Math.pow(0.88, age);
    else price *= 0.5;

    // Engine size adjustment
    if (Engine >= 1000) price *= 1.4;
    else if (Engine >= 750) price *= 1.25;
    else if (Engine >= 500) price *= 1.1;
    // else leave price as-is

    // Type multiplier
    const typeMultiplier = this.typeMultipliers[Type] || 1.0;
    price *= typeMultiplier;


    return Math.max(Math.round(price), this.MIN_DAILY_PRICE);
  }
}

module.exports = MotorcyclePricingEngine;
