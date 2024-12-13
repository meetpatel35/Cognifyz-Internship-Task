const jwt = require("jsonwebtoken");
const JWT_SECRET = "jwtsecret";

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token required" });
  
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: "Invalid token" });
      req.user = user;
      next();
    });
}

module.exports = verifyToken;
