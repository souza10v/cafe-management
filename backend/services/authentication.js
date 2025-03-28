const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(401).json({ message: "Token inválido." });
    }

    jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, user) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Token expirado. Faça login novamente." });
            } else {
                return res.status(403).json({ message: "Token inválido." });
            }
        }
        req.user = user;
        next();
    });
};

module.exports = { authenticateToken };
