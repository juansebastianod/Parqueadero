import axios from 'axios'

export const enviarEmail = async (url,body) => {
    try {
        const response = await axios.post(url,body);
        return true;
    } catch (error) {
        return false
    }
};