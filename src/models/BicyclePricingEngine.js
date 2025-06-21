class BicyclePricingEngine {
  constructor() {
    this.basePrices = {
      Road: 10,
      Mountain: 12,
      Hybrid: 11,
      Electric: 20
    };

    this.MIN_DAILY_PRICE = 5;
  }

  calculatePrice({ Type, Gears }, Location = null) {
    let price = this.basePrices[Type] || 10;

    // Gear-based multiplier
    if (Gears < 7) price *= 0.95;
    else if (Gears > 18) price *= 1.15;
    // else ×1.0 by default

    return Math.max(Math.round(price), this.MIN_DAILY_PRICE);
  }
}

module.exports = BicyclePricingEngine;
