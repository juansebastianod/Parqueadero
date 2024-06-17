import { pool } from "../db.js";
import {
    registrarIngresoVehiculoServices,
    registrarSalidaVehiculoServices,
    listadoParqueaderoServices,
    detalleVehiculoServices
} from '../services/sociosSevices.js'
import {IngresoVehiculo} from '../services/Entity/ingresoVehiculosEntity.js'
import { response } from "express";

export const registrarIngresoVehiculo = async (req, res) => {
    const { placa} = req.body;
    const {id:parqueaderoId} =req.params
    const socioId = req.user.id;
    const role=req.user.role;
    const response= await  registrarIngresoVehiculoServices(placa,socioId,parqueaderoId,role);
    res.status(response.status).json({
        message:response.message
    });

};

export const registrarSalidaVehiculo = async (req, res) => {
    const { placa } = req.body;
    const {id:parqueaderoId}=req.params
    const socioId = req.user.id;
    const role=req.user.role;
    const response =await registrarSalidaVehiculoServices(socioId,placa,parqueaderoId,role)

    res.status(response.status).json({
        message:response.message
    });
    
};

export const listParqueadero = async (req, res) => {
    const socioId = req.user.id; 
    const response=await listadoParqueaderoServices(socioId)
    res.status(response.status).json({
        message:response.message,
        data:response.data,
    });

};

export const detalleVehiculo = async (req, res) => {
    const socioId = req.user.id; 
    const role=req.user.role;
    const { id: parqueaderoId } = req.params; 
    const response=await detalleVehiculoServices(socioId,parqueaderoId,role)
    res.status(response.status).json({
        message:response.message,
        data:response.data,
    });
    
};

