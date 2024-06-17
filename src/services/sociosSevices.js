import {Respuesta} from './Entity/response.Entity.js'
import {
    verificarSocioParqueadero,
    cantidadParqueadero,
    verificarPlacaParqueadero,
    crearVehiculo,
    registrarIngresoVehiculoRepository,
    vehiculoSalidaParqueado,
    registrarSalidaVehiculoRepository,
    listParqueaderoRepository,
    detalleVehiculoRepository

 } from '../repository/sociosRepository.js'
import { response } from 'express'

 export const registrarIngresoVehiculoServices =async(placa,socioId,parqueaderoId,role)=>{

   const socio= await verificarSocioParqueadero(socioId,parqueaderoId,role)
   if (!socio) {
         return new Respuesta(401, "No tienes permisos para registrar en este parqueadero",null )
         }
   const cantidad = await cantidadParqueadero(parqueaderoId)
   if (!cantidad) {
      return new Respuesta(401, "Parqueadero esta lleno",null )
      }

   const vehiculoId = await crearVehiculo(placa);
   const vehiculoEnOtroParqueadero = await verificarPlacaParqueadero(vehiculoId)
   if(!vehiculoEnOtroParqueadero){
      return new Respuesta(401, "Ya existe este vehiculo en este o otro parqueadero",null )
   }

   const response = await registrarIngresoVehiculoRepository(vehiculoId,placa,parqueaderoId)
   if(response){
      return new Respuesta(201, "Veiculo Ingresado",null )
   }
 }

 export const registrarSalidaVehiculoServices = async (socioId,placa,parqueaderoId,role) => {
   
   const socio= await verificarSocioParqueadero(socioId,parqueaderoId,role)
   if (!socio) {
         return new Respuesta(401, "No tienes permisos para registrar en este parqueadero",null )
         }
   const vehiculosEncontrados= await vehiculoSalidaParqueado(placa,parqueaderoId)
   if (vehiculosEncontrados.verdad) {
      return new Respuesta(401, "No se puede registrar salida, no existe la placa en el parqueadero",null )
   }
      
   
   const ingresoId =vehiculosEncontrados.found[0].ingreso_id;
   const fechaIngreso=vehiculosEncontrados.found[0].fecha_ingreso;

   const salida= await registrarSalidaVehiculoRepository(parqueaderoId,ingresoId,fechaIngreso,vehiculosEncontrados)
   if(!salida){
      return new Respuesta(401, "Hubo un error a la hora de resgistrar la salida",null )
   }else{
      return new Respuesta(201, "Salida Exitosa",null )
   }
  
};

export const  listadoParqueaderoServices =async(socioId)=>{
   const response =await  listParqueaderoRepository(socioId)
   if(!response.verdad){
      return new Respuesta(200, "Este usuario no tiene parqueaderos",null ) 
   }else{
      return new Respuesta(200, "Listado de parqueadero del usuario",response.found ) 
   }

}


export const detalleVehiculoServices = async (socioId,parqueaderoId,role) => {
   const socio= await verificarSocioParqueadero(socioId,parqueaderoId,role)
   if (!socio) {
         return new Respuesta(401, "No tienes permisos para registrar en este parqueadero",null )
         }

   const reponse =await detalleVehiculoRepository(parqueaderoId)
   if(!reponse.verdad){
      return new Respuesta(401, "No se encontraron vehículos en este parqueadero o todos han salido",null )
   }else{
      return new Respuesta(401, "Detalles de los vehiculos en el parqueadero",reponse.found )
   }

}
 