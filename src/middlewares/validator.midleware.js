export const validateShema = (shema) => (req, res, next) => {
    try {
        shema.parse(req.body)
        next();
    } catch (error) {
        return res.status(400).json({ error: error.errors.map(error=> error.message) })
    }


}