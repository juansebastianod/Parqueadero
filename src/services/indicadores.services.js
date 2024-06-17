
import {gananciasRepository} from '../repository/indicadoresRepository.js'
import {Respuesta} from './Entity/response.Entity.js'

export const gananciasServices = async (time,parqueaderoId) => {
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
    console.log(reponse)
    
    return new Respuesta(200, "Ganancias del parqueadero en el periodo ",reponse )    


}