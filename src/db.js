import pg from 'pg'

export const  pool = new pg.Pool({
    user:"postgres",
    host:"localhost",
    password:"postgres",
    database:"parqueadero",
    port:"5432",
})

