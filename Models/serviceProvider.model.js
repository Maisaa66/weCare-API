const mongoose = require("mongoose");
const { isEmail, isMobilePhone } = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//& create ServicePovider schema
const ServiceProviderSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: [true, "firstName is required"] },
    lastName: { type: String, required: [true, "lastName is required"] },
    phoneNum: {
      type: String,
      trim: true,
      validate(value) {
        if (!isMobilePhone(value, "ar-EG"))
          throw new Error("Invalid Mobile Number");
      },
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      validate: [isEmail, "Please enter a valid email"],
    },
    password: { type: String, required: [true, "password is required"] },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: [true, "gender is required"],
    },
    address: {
      type: {
        country: { type: String, required: [true, "country is required"] },
        governate: { type: String, required: [true, "governate is required"] },
      },
    },
    nationalID: { type: String, required: [true, "nationalId is required"] },
    profileImg: { type: String },
    serviceType: 
      {
        type: String,
        enum: [
          "nurse",
          "companion",
          "nanny",
          "physiotherapist",
          "special-care:autism",
          "special-care:ADHD",
          "special-care:Alzheimer's and Dementia",
        ],
        required: true,
      },
    
    documents: [{ type: String }],
    status: {
      type: String,
      enum: ["pending", "rejected", "approved", "suspended"],
      default: "pending",
    },
    title: { type: String, required: true },
    experties: { type: String, required: true },
    rating: { type: Number },
    hourlyRate: { type: Number, required: true },
    nightShift: { type: Boolean, required: true },
    dateOfBirth: { type: Date, required: true },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    requests: {
      type: [Number],
      default: [],
    },
    reviewsMade: {
      type: [Number],
      default: [],
    },
    requestsGiven: {
      type: [Number],
      default: [],
    },
  },
  { timestamps: true }
);

//hashing passwords before save
ServiceProviderSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

ServiceProviderSchema.pre("findOneAndUpdate", async function (next) {
  if (this._update.password) {
    const salt = await bcrypt.genSalt();
    this._update.password = await bcrypt.hash(this._update.password, salt);
  }
  next();
});
//create token
ServiceProviderSchema.methods.createToken = async function () {
  const provider = this;
  //generate jwt
  const accessToken = jwt.sign(
    {
      id: provider._id,
      userType: "serviceProvider",
    },
    process.env.JWT_SEC,
    { expiresIn: "2d" }
  );
  return accessToken;
};

const serviceProviderModel = mongoose.model(
  "serviceProviders",
  ServiceProviderSchema
);

module.exports = serviceProviderModel;
