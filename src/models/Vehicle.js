class Vehicle {
    constructor(id, brand, model, price, status) {
        this.id = id;
        this.brand = brand;
        this.model = model;
        this.price = price;
        this.status = status; // Available, Rented, Maintenance
    }
}

module.exports = Vehicle;
