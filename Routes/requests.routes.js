const router = require("express").Router();
const userControllers = require("../Controllers/user.controllers");
const providerControllers = require("../Controllers/serviceProvider.controller");
const authMiddleware = require("../Middlewares/auth.middleware");
const requestsController = require("../Controllers/requests.controller");

// get all requests
router.get(
  "/",
  authMiddleware.verifyTokenAndAdmin,
  userControllers.getAllRequests
);

// get all requests for one user  by user id
router.get(
  "/user/:id",
  authMiddleware.verifyTokenAndAuthorization,
  userControllers.getRequestById
);

// get all requests for one provider by provider id
router.get(
  "/provider/:id",
  authMiddleware.verifyTokenAndAuthorization,
  providerControllers.getRequestById
);

// create a request
router.post("/", authMiddleware.verifyToken, requestsController.createRequest);

// delete a request
router.delete("/:id", authMiddleware.verifyToken, requestsController.deleteRequest);

// update a request status
router.patch("/:id", authMiddleware.verifyToken, requestsController.updateStatus);
module.exports = router;
