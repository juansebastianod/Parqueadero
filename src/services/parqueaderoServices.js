import {
    buscarParqueaderosRespository,
    registerParqueaderoRepository,
    NombreParqueaderoRepository,
    socioParqueaderoRepository,
    ExistParqueaderoRepository,
    editarParqueaderoRepository,
    eliminarParqueaderoRerpository,
    puedeEliminarRepository
} from "../repository/parqueaderoRepository.js";
import {Respuesta} from './Entity/response.Entity.js'


export const registerParqueaderoServices = async(parqueaderoEntity)=> {
    
    const nombre=await NombreParqueaderoRepository(parqueaderoEntity.nombre)
    if(nombre){
        return new Respuesta(200, "El nombre del parqueadero ya esta registrado",null )   
    }
    const socio=await socioParqueaderoRepository(parqueaderoEntity.socio_id);
    if(!socio){
        return new Respuesta(200, "Ese socio no existe",null )   
    }
    const response =await registerParqueaderoRepository(parqueaderoEntity)
    if(response){
        return new Respuesta(200, "Parqueadero registrado con exitos",null )   
    }
    return new Respuesta(404, "Error al registrar",null )
}

export const buscarParqueaderosServices = async(nombre)=> {

    const response = await buscarParqueaderosRespository(nombre)
    if(response.length!=0){
        return new Respuesta(200, "Lista de cocidencia del parqueadero",response )     
    }else{
        return new Respuesta(200, "No tiene parqueaderos con ese nombre",null )
    }
   
}

export const editarParqueaderoServices = async (parqueaderoEntity,id) => {
    const uso=await puedeEliminarRepository(id);
    if(uso){
        return new Respuesta(401,"Parqueadero en uso",null ) 
    }
    const existParqueadero= await ExistParqueaderoRepository(id)
    if(!existParqueadero){
          return new Respuesta(401,"El parqueadero no existe",null )  
    }

    const nombre=await NombreParqueaderoRepository(parqueaderoEntity.nombre)
    if(nombre){
        return new Respuesta(401, "El nombre del parqueadero ya esta registrado",null )   
    }
    const socio=await socioParqueaderoRepository(parqueaderoEntity.socio_id);
    if(!socio){
        return new Respuesta(401, "Ese socio no existe",null )   
    }

    const parqueadero =await editarParqueaderoRepository(parqueaderoEntity,id);
    if(!parqueadero){
        return new Respuesta(201,"Parqueadero Actualizado exitosamente",null )  
    }
    
};

export const eliminarParqueaderoServices = async (id) => {
    const uso=await puedeEliminarRepository(id);
    if(uso){
        return new Respuesta(401,"Parqueadero en uso",null ) 
    }
    const existParqueadero= await ExistParqueaderoRepository(id)
    if(!existParqueadero){
          return new Respuesta(401,"El parqueadero no existe",null )  
    }
    const response = await eliminarParqueaderoRerpository(id);
    if(response){
        return new Respuesta(401,"Parqueadero Eliminado Exitosamente",null )  
    }else{
        return new Respuesta(401,"Hubo un error antes de eliminar",null )  
    }
    
};

