const mongoose = require("mongoose");

//create hire request schema
const ReviewSchema = new mongoose.Schema(
  {
    postDate: {
      type: Date,
      required: [true, "Request must have a post date"],
    },
    reviewerId: {
      type: String,
      required: [true, "Review must have a reviewer"],
    },
    revieweeId: {
      type: String,
      required: [true, "Review must have a reviewee"],
    },
    rate: {
      type: Number,
      required: [true, "Review must have a rate"],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, "Review must have a comment"],
    },
  },
  { timestamps: true }
);

const reviewModel = mongoose.model("reviews", ReviewSchema);
module.exports = reviewModel;
