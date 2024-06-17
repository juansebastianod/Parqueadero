import {z} from 'zod'

export const registerUserSchema = z.object({
    email: z.string({
        required_error: "El email es requerido"
    }).email({
        message: "Email inválido"
    }),
    password: z.string({
        required_error: "La contraseña es requerida"
    }).min(5, {
        message: "La contraseña debe tener al menos 5 caracteres"
    })
});

export const RegistrarParqueaderoShema = z.object({
    nombre: z.string({
        required_error: "El nombre es requerido"
    }),
    capacidad: z.number({
        required_error: "La capacidad es requerida"
    }).min(1, {
        message: "La capacidad debe ser al menos 1"
    }),
    costo_hora: z.number({
        required_error: "El costo por hora es requerido"
    }).min(0.01, {
        message: "El costo por hora debe ser mayor que 0"
    }),
    socio_id: z.number({
        required_error: "El socio_id es requerido"
    }).int({
        message: "El socio_id debe ser un número entero"
    })
});


export const nombreSchema = z.object({
    nombre: z.string().optional().or(z.literal('')),
});


export const timeSchema = z.object({
    time: z.number({
        required_error: "El tiempo es requerido"
    }).min(1, {
        message: "El tiempo debe ser al menos 1"
    }).max(4, {
        message: "El tiempo debe ser como máximo 4"
    })
});

export const vehiculoShema = z.object({
    placa: z.string({
        required_error: "El vehiculo es requerido"
    }).min(6, {
        message: "minimo debe tener 6 letras o numeros "
    }).max(6,{
        message: "Maximo debe tener 6 letras o numeros "
    })
});