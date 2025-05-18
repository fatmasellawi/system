import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Récupère le token depuis l'en-tête

    if (!token) {
        return res.status(403).json({ message: 'Token requis' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Ajoute l'utilisateur décodé dans la requête
        next(); // Permet de passer à la prochaine middleware/route
    } catch (error) {
        console.error("Erreur de token:", error);
        res.status(403).json({ message: "Token invalide" });
    }
}
// middlewares/authMiddleware.js
export const authMiddleware=(req, res, next) =>{
  // ici, tu mets ta logique d'authentification, par ex:
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  // vérifier le token, etc.
  next();
}


export const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Accès non autorisé' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Token invalide' });
    }
  };
  

export default verifyToken;
