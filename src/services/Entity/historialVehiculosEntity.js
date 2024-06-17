export class HistorialVehiculo {
    constructor(vehiculo_id, parqueadero_id, fecha_ingreso, fecha_salida, pago) {
        this.vehiculo_id = vehiculo_id; // Foreign Key to Vehiculos(id)
        this.parqueadero_id = parqueadero_id; // Foreign Key to Parqueaderos(id)
        this.fecha_ingreso = fecha_ingreso; // NOT NULL
        this.fecha_salida = fecha_salida; // Can be NULL
        this.pago = pago || 0; // Default value 0
    }
}