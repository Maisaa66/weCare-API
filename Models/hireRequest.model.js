const mongoose = require("mongoose");

//create hire request schema
const HireRequestSchema = new mongoose.Schema(
  {
    reqStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      required: [true, "Request must have a status"],
      default: "pending",
    },
    startDate: {
      type: Date,
      required: [true, "Request must have a start date"],
    },
    endDate: {
      type: Date,
      required: [true, "Request must have an end date"],
    },
    customerId: {
      type: String,
      required: [true, "Request must have a customer"],
    },
    providerId: {
      type: String,
      required: [true, "Request must have a provider"],
    },
    totalHrs: {
      type: Number,
      required: [true, "Request must have number of hrs"],
    },
    hourlyRate: {
      type: Number,
      required: [true, "Request must have an hourly rate"],
    },
    reqDescription: {
      type: String,
      required: [true, "Request must have a description"],
    },
    recurring: {
      type: Boolean,
      required: [true, "Request must have a recurring value"],
      default:false
  },
  },
  { timestamps: true }
);

//To calculate total price
HireRequestSchema.virtual("totalPrice").get(function () {
  return this.totalHrs * this.hourlyRate;
});

const hireRequestModel = mongoose.model("hirerequests", HireRequestSchema);
module.exports = hireRequestModel;
