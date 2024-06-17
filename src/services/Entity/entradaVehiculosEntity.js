export class EntradasVehiculo {
    constructor(placa, cantidad_entradas) {
        this.placa = placa; // Unique
        this.cantidad_entradas = cantidad_entradas || 0; // Default value 0
    }
}