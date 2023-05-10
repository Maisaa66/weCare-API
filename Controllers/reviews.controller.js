const reviewModel = require("../Models/review.model");

class Reviews {
  static createReview = async (req, res) => {
    try {
      const review = await reviewModel.create(req.body);
      res.setHeader("Access-Control-Allow-Origin", "https://wecare-pam6.onrender.com");
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, X-Requested-With, Accept"
      );
      res.status(200).json({
        status: "success",
        results: 1,
        requestedAt: req.requestTime,
        data: {
          review,
        },
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  static deleteReview = async (req, res) => {
    try {
      const review = await reviewModel.findByIdAndDelete(req.params.id);
      if (!review) {
        throw new Error("There is no review with this ID!");
      }
      res.setHeader("Access-Control-Allow-Origin", "https://wecare-pam6.onrender.com");
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, X-Requested-With, Accept"
      );

      res.status(200).json({
        status: "success",
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  static getReviewsMade = async (req, res) => {
    try {
      const reviews = await reviewModel.find({ reviewerId: req.params.id });
      res.status(200).json({
        status: "success",
        results: reviews.length,
        requestedAt: req.requestTime,
        data: {
          reviews,
        },
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  static getReviewsGiven = async (req, res) => {
    try {
      const reviews = await reviewModel.find({ revieweeId: req.params.id });
      res.status(200).json({
        status: "success",
        results: reviews.length,
        requestedAt: req.requestTime,
        data: {
          reviews,
        },
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

}

module.exports = Reviews;
