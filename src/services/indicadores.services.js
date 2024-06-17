import {
    gananciasRepository,
    buscarVehiculoPorCoincidenciaRepository,
    obtenerTopVehiculosRegistradosRepository,
    obtenerVehiculosMasRegistradosRepository,
    primeraVezParqueaderoRepository,
    listVehiculosPrimeraVez
} from '../repository/indicadoresRepository.js'
import {verificarSocioParqueadero} from '../repository/sociosRepository.js'
import {Respuesta} from './Entity/response.Entity.js'

export const gananciasServices = async (time,parqueaderoId,socioId,role) => {
    const socio= await verificarSocioParqueadero(socioId,parqueaderoId,role)
    if (!socio) {
          return new Respuesta(401, "No tienes permisos para revisar los vehiculos de este parqueadero",null )
          }
    let dateCondition;
    switch (time) {
        case 1: // Hoy
            dateCondition = "CURRENT_DATE";
            break;
        case 2: // Esta semana
            dateCondition = "date_trunc('week', CURRENT_DATE)";
            break;
        case 3: // Este mes
            dateCondition = "date_trunc('month', CURRENT_DATE)";
            break;
        case 4: // Este año
            dateCondition = "date_trunc('year', CURRENT_DATE)";
            break;
        default:
            return new Respuesta(401, "Tienes que escojer un valor del 1 al 4 ",null )          
    }
    const reponse = await gananciasRepository(dateCondition,parqueaderoId,time);

    return new Respuesta(200, "Ganancias del parqueadero en el periodo ",reponse )    


}

export const buscarVehiculoPorCoincidenciaServices = async (parqueaderoId,placa,socioId,role) => {
   const socio= await verificarSocioParqueadero(socioId,parqueaderoId,role)
   if (!socio) {
         return new Respuesta(401, "No tienes permisos para revisar los vehiculos de este parqueadero",null )
         }
    const response = await buscarVehiculoPorCoincidenciaRepository(parqueaderoId,placa)
    if(!response.verdad){
        return new Respuesta(201, "No tiene ninguna concidencia",null )    
    }
    return new Respuesta(201, "Lista de vehiculo por cocidencia",response.found ) 
}
export const obtenerTopVehiculosRegistradosServices = async()=>{

    const response= await obtenerTopVehiculosRegistradosRepository()
    return new Respuesta(200, "Vehiculos mas parqueado ",response )   

}

export const obtenerVehiculosMasRegistradosServices = async (parqueaderoId,socioId,role) => {
   const socio= await verificarSocioParqueadero(socioId,parqueaderoId,role)
   if (!socio) {
         return new Respuesta(401, "No tienes permisos para revisar los vehiculos de este parqueadero",null )
         }

  const response = await obtenerVehiculosMasRegistradosRepository(parqueaderoId);
  return new Respuesta(201, "Lista de vehiculos que mas han entrado a un parqueadero",response )

}

export const primeraVezParqueaderoServices =async(parqueaderoId)=>{

    const lista= await listVehiculosPrimeraVez(parqueaderoId)
    const response = await  primeraVezParqueaderoRepository(parqueaderoId,lista)
    return new Respuesta(201, "Carros que entran por primera vez",response )


}