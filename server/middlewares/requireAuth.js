// middleware/requireAuth.js
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js'; // adapte le chemin selon ta structure

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  const token = authorization.split(' ')[1];

  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);

    // Récupérer l'utilisateur associé
    req.user = await User.findById(_id).select('_id role email');

    if (!req.user) {
      return res.status(401).json({ error: 'User not found' });
    }

    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    res.status(401).json({ error: 'Request is not authorized' });
  }
};

export default requireAuth;
