import express from 'express';
import userRouter from './routes/users.routes.js';
import sociosRouter from './routes/socios.routes.js'
const app= express();

app.listen(3000);
app.use(express.json())
app.use('/api',userRouter)
app.use('/api',sociosRouter)
console.log("se escucha desde el puerto ",3000)