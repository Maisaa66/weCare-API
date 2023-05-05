const router = require("express").Router();
const userControllers = require("../Controllers/user.controllers");
const authMiddleware = require("../Middlewares/auth.middleware");
const reviewsControllers = require("../Controllers/reviews.controller");

router.get(
  "/",
  authMiddleware.verifyTokenAndAdmin,
  userControllers.getAllReviews
);

// get all requests for reviewer
router.get(
  "/reviewer/:id",
  authMiddleware.verifyTokenAndAuthorization,
  reviewsControllers.getReviewsMade
);

// get all requests for reviewee
router.get(
  "/reviewee/:id",
  reviewsControllers.getReviewsGiven
);

// create a review
router.post("/", authMiddleware.verifyToken, reviewsControllers.createReview);

// delete a review
router.delete(
  "/:id",
  authMiddleware.verifyToken,
  reviewsControllers.deleteReview
);
module.exports = router;
