export class EntradasParqueadero {
    constructor(vehiculo_id, parqueadero_id, cantidad_entradas) {
        this.vehiculo_id = vehiculo_id; // Foreign Key to Vehiculos(id)
        this.parqueadero_id = parqueadero_id; // Foreign Key to Parqueaderos(id)
        this.cantidad_entradas = cantidad_entradas || 0; // Default value 0
    }
}