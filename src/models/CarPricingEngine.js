class CarPricingEngine {
    constructor() {
        this.brandBasePrices = {
            'Toyota': 35, 'Honda': 32, 'Nissan': 30, 'Mazda': 28,
            'Hyundai': 25, 'Kia': 23, 'Mitsubishi': 22, 'Suzuki': 20,
            'Volkswagen': 40, 'Subaru': 38, 'Ford': 35, 'Chevrolet': 33,
            'Buick': 45, 'Chrysler': 42, 'Dodge': 40,
            'BMW': 85, 'Mercedes': 95, 'Audi': 80, 'Lexus': 75,
            'Infiniti': 70, 'Acura': 65, 'Volvo': 60, 'Genesis': 55,
            'Porsche': 250, 'Jaguar': 180, 'Land Rover': 150, 'Cadillac': 120,
            'Lincoln': 100, 'Tesla': 130,
            'Ferrari': 800, 'Lamborghini': 750, 'McLaren': 700, 
            'Bentley': 400, 'Rolls-Royce': 1000, 'Maserati': 300
        };

        this.fuelTypeAdjustments = {
            'Electric': { multiplier: 1.15, premium: 8 },
            'Hybrid': { multiplier: 1.10, premium: 5 },
            'Diesel': { multiplier: 1.05, premium: 3 },
            'Petrol': { multiplier: 1.0, premium: 0 }
        };

        this.seatAdjustments = {
            2: 0.95,
            4: 1.0,
            5: 1.05,
            7: 1.25,
            8: 1.30,
            9: 1.35
        };

        this.modelCategories = {
            luxury: {
                keywords: ['S-Class', 'X5', 'A8', 'Model S'],
                multiplier: 1.4,
                premium: 50  // much smaller premium, since daily price
            },
            sport: {
                keywords: ['GT', 'AMG', 'M3', '911'],
                multiplier: 1.3,
                premium: 40
            },
            economy: {
                keywords: ['Civic', 'Corolla', 'Yaris'],
                multiplier: 0.85,
                premium: -5  // small discount, not -2000
            }
        };

    }

    calculatePrice({ Brand, Model, Year, FuelType, Seats }, Location = null) {
        let price = this.brandBasePrices[Brand] || 30;

        const currentYear = new Date().getFullYear();
        const age = currentYear - Year;

        // Depreciation
        if (age <= 0) {
            // New or future model year, no depreciation
            price = price;
        } else if (age === 1) {
            price *= 0.80;
        } else if (age <= 3) {
            price *= 0.80 * Math.pow(0.85, age - 1);
        } else if (age <= 7) {
            price *= 0.80 * Math.pow(0.85, 2) * Math.pow(0.88, age - 3);
        } else if (age <= 15) {
            price *= 0.80 * Math.pow(0.85, 2) * Math.pow(0.88, 4) * Math.pow(0.92, age - 7);
        } else {
            // Floor price for very old cars - $20 per day minimum
            price = Math.max(price * 0.10, 20);
        }

        // Fuel adjustment
        const fuelAdj = this.fuelTypeAdjustments[FuelType] || this.fuelTypeAdjustments['Petrol'];
        price = price * fuelAdj.multiplier + fuelAdj.premium;

        // Seat adjustment
        const seatMultiplier = this.seatAdjustments[Seats] || 1.0;
        price *= seatMultiplier;

        // Model category adjustment
        const modelLower = Model.toLowerCase();
        for (const category of Object.values(this.modelCategories)) {
            if (category.keywords.some(keyword => modelLower.includes(keyword.toLowerCase()))) {
                price = price * category.multiplier + category.premium;
                break;
            }
        }

        // Final floor price (minimum daily rental)
        const MIN_DAILY_PRICE = 20;
        price = Math.max(Math.round(price), MIN_DAILY_PRICE);

        return price;
    }
}

module.exports = CarPricingEngine;
