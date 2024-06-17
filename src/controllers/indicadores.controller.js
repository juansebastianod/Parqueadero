import { pool } from "../db.js";
import {
    gananciasServices,
    buscarVehiculoPorCoincidenciaServices,
    obtenerTopVehiculosRegistradosServices,
    obtenerVehiculosMasRegistradosServices,
    primeraVezParqueaderoServices,

} from '../services/indicadores.services.js'

//Terminado
export const ganancias = async (req, res) => {
    const { id: parqueaderoId } = req.params;
    const {time} =req.body
    const socioId = req.user.id;
    const role=req.user.role;
    const response=await gananciasServices(time,parqueaderoId,socioId,role)
    res.status(response.status).json({
        message:response.message,
        data:response.data,
    });
};

//Terminado
export const buscarVehiculoPorCoincidencia = async (req, res) => {
    const  { id:parqueaderoId }=req.params
    const { placa } = req.body;
    const socioId = req.user.id;
    const role=req.user.role;
    const response=await buscarVehiculoPorCoincidenciaServices(parqueaderoId,placa,socioId,role)
    res.status(response.status).json({
        message:response.message,
        data:response.data,
    });
   
};

//Terminado
export const obtenerTopVehiculosRegistrados = async (req, res) => {
    const response=await obtenerTopVehiculosRegistradosServices()
    res.status(response.status).json({
        message:response.message,
        data:response.data,
    });
};

//Terminada
export const obtenerVehiculosMasRegistrados = async (req, res) => {
    const { id:parqueaderoId } = req.params;
    const socioId = req.user.id;
    const role=req.user.role;
    const response=await obtenerVehiculosMasRegistradosServices(parqueaderoId,socioId,role)
    res.status(response.status).json({
        message:response.message,
        data:response.data,
    });
 
};



export const primeraVezParqueadero = async (req, res) => {
   
        const { id: parqueaderoId } = req.params;
        const socioId = req.user.id;
        const role=req.user.role;
        const response=await primeraVezParqueaderoServices(parqueaderoId)
        res.status(response.status).json({
            message:response.message,
            data:response.data,
        });

        
        
};