import express from 'express';
import userRouter from './routes/users.routes.js';
import indicadoresRouter from './routes/indicadores.routes.js'
import sociosRouter from './routes/socios.routes.js'
import cookieParser from 'cookie-parser';
const app= express();

app.listen(3000);
app.use(express.json());
app.use(cookieParser());
app.use('/api',userRouter);
app.use('/api',sociosRouter);
app.use('/api',indicadoresRouter);
console.log("se escucha desde el puerto ",3000);