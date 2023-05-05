const jwt = require("jsonwebtoken");

class Auth {
  static verifyToken = (req, res, next) => {
    try {
      console.log("cookie: ", req.cookies.jwt)
      console.log("bearer: ", req.headers);
      console.log("token", req.header("authorization").replace("Bearer ", ""))
      const authHeader = req.headers.authorization || req.headers.Authorization

      if (!authHeader?.startsWith('Bearer ')) {
          return res.status(401).json({ message: 'Unauthorized' })
      }
      const token = authHeader.split(' ')[1]
      if (token) {
        jwt.verify(token, process.env.JWT_SEC, (err, userToken) => {
          if (err) {
            res.status(403).send("token is not valid");
          }
          req.userToken = userToken;
          next();
        });
      } else {
        res.status(400).send("you need to login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  static verifyTokenAndAuthorization = (req, res, next) => {
    console.log("req.params.id: ",req.params.id);
    this.verifyToken(req, res, () => {
      if (req.userToken.id === req.params.id || req.userToken.isAdmin) {
        next();
      } else {
        res.status(403).json("You are not authorized to do that!");
      }
    });
  };

  static verifyTokenAndAdmin = (req, res, next) => {
    this.verifyToken(req, res, () => {
      if (req.userToken.isAdmin) {
        next();
      } else {
        res.status(403).json("You are not allowed to do that!");
      }
    });
  };
}

module.exports = Auth;
