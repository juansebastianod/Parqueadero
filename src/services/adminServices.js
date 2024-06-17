
import {
    resgisterUser,
    consultarUsuario,
    verificaUser,
    verificaPassword,
    loginRepository,

} from "../repository/AdminRepository.js";
import {enviarEmail} from '../repository/emailClientRest.js'
import {Respuesta} from './Entity/response.Entity.js'


export const registerServis = async(userEntity,res)=> {
    let user = await consultarUsuario(userEntity.email)
    if(user){ 
        return new Respuesta(400, "Usuario ya existe",null )   
    }
    let response = await resgisterUser(userEntity)
    if(response){
        return new Respuesta(200, "USuario resgistrado con exito",null )     
    }
    return new Respuesta(400, "Error al registrar",null )

}

export const loginServices = async (email, password) => {

    const user= await verificaUser(email);
    if(user.verdad){
        return new Respuesta(400, "Usuario no existente",null )
    }
    const comparePassword = await verificaPassword(password,email);
    if(!comparePassword){
        return new Respuesta(400, "Contraseña incorrecta",null )
    }
    const response= await loginRepository(email,password)

    return response
    
  };

export const enviarEmailServices=async(email)=>{
    const url ="http://localhost:3001/sendEmail"
     const response=enviarEmail(url,email);
     return new Respuesta(200, "Solicitud procesada",response )
}