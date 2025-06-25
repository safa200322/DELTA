const jwt = require('jsonwebtoken');

const authChauffeur = (req, res, next) => {
  // Extract token from the 'Authorization' header
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.chauffeur = decoded;  // Attach chauffeur data to the request object
    next();  // Pass the request to the next middleware or controller
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = authChauffeur;
