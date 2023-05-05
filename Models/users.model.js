const mongoose = require("mongoose");
const { isEmail, isMobilePhone } = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//& create User schema
const UserSchema = new mongoose.Schema(
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
    isAdmin: { type: Boolean, default: false },
    address: {
      type: {
        country: { type: String, required: [true, "country is required"] },
        governate: { type: String, required: [true, "governate is required"] },
        area: { type: String, required: [true, "area is required"] },
        street: { type: String, required: [true, "street is required"] },
        buildingNum: {
          type: Number,
          required: [true, "buildingNum is required"],
        },
        apartmentNum: {
          type: Number,
          required: [true, "apartmentNum is required"],
        },
      },
    },
    nationalID: { type: String, required: [true, "nationalId is required"] },
    profileImg: { type: String },
    requests: {
      type: [Number],
      default: [],
    },
    rating: {
      type: Number,
      require: true,
      default: 5,
    },
    reviewsMade: {
      type: [Number],
      default: [],
    },
    reviewsGiven: {
      type: [Number],
      default: [],
    },
  },
  { timestamps: true }
);

//hashing passwords before save
UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
UserSchema.pre("findOneAndUpdate", async function (next) {
  console.log("Hashing update");
  console.log(this._update.password);
  if (this._update.password) {
    const salt = await bcrypt.genSalt();
    this._update.password = await bcrypt.hash(this._update.password, salt);
  }
  next();
});
//create token
UserSchema.methods.createToken = async function () {
  const user = this;
  //generate jwt
  const accessToken = jwt.sign(
    {
      id: user._id,
      isAdmin: user.isAdmin,
      userType: "user",
    },
    process.env.JWT_SEC,
    { expiresIn: "2d" }
  );

  return accessToken;
};

const userModel = mongoose.model("users", UserSchema);

module.exports = userModel;
