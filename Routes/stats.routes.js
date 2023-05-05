const router = require("express").Router();
const authMiddleware = require("../Middlewares/auth.middleware");
const getStats = require("../Controllers/stats.controller");

router.get("/", authMiddleware.verifyTokenAndAdmin, getStats);
module.exports = router;
