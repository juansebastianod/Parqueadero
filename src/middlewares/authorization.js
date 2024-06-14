export const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 1) { 
        return res.status(403).json({ message: 'Acceso denegado, solo administradores' });
    }
    next();
};

export const authorizeUser = (req, res, next) => {
    if (req.user.role !== 2) { 
        return res.status(403).json({ message: 'Acceso denegado, solo usuarios' });
    }
    next();
};