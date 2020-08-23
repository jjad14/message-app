const jwt = require("jsonwebtoken");

// Check if user has authorization
module.exports = (req, res, next) => {
    try {
        // get token using split (Bearer token)
        const token = req.headers.authorization.split(" ")[1];

        // verify token validity, verify returns decodedToken, 2nd param is secret key
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        // create new object with userData
        req.userData = {
            email: decodedToken.email,
            userId: decodedToken.userId
        };

        // continue execution, request will be able to travel on to next middleware etc.
        next();

    } catch(error) {
        res.status(401).json({
            message: "You are not authenticated."
        });
    }


};