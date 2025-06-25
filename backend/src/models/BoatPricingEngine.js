class BoatPricingEngine {
  constructor() {
    this.classifiedBasePrices = {
      'dinghy': 200,
      'skiff': 250,
      'jon': 220,
      'pontoon': 400,
      'runabout': 600,
      'bowrider': 650,
      'centerconsole': 700,
      'utility': 300,
      'fishing': 300,
      'inflatable': 250,
      'sailboat': 500,
      'yacht': 5000,
      'jetboat': 550,
      "jet-ski": 150
    };

    this.capacityMultiplier = qty =>
      qty <= 4 ? 1 :
      qty <= 8 ? 1.2 : 1.5;

    this.MIN_DAILY_PRICE = 100;
  }

  calculatePrice({ BoatType, Capacity, EngineType }) {
    const typeKey = BoatType.toLowerCase();
    let price = this.classifiedBasePrices[typeKey] || 300;

    price *= this.capacityMultiplier(Number(Capacity));

    // Adjust pricing based on EngineType
    switch (EngineType) {
      case 'Inboard':
        price *= 1.1; // Inboard engines add 10% to the base price
        break;
      case 'Outboard':
        price *= 1.05; // Outboard engines add 5% to the base price
        break;
      case 'Sail':
        price *= 0.9; // Sail-powered boats are 10% cheaper
        break;
      default:
        // Handle unexpected EngineType values
        console.warn(`Unexpected EngineType: ${EngineType}`);
        break;
    }

    return Math.max(Math.round(price), this.MIN_DAILY_PRICE);
  }
}

module.exports = BoatPricingEngine;

