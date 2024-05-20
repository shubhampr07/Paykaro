const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({message: "No token, authorization denied!"})
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(decoded.userId) {
            req.userId  = decoded.userId;
            next();
        }
        else {
            return res.status(401).json({message: "Invalid Auth Header!"})
        }
    } catch (err) {
        return res.status(401).json({message: "Invalid Auth Header!"})
    }
};

module.exports = {
    authMiddleware,
}