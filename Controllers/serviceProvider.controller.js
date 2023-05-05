const serviceProviderModel = require("../Models/serviceProvider.model");
const hireRequestModel = require("../Models/hireRequest.model");

const bcrypt = require("bcrypt");
class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    const queryObj = { ...this.queryStr };
    const queryFields = ["limit", "sort", "page", "fields"];
    queryFields.forEach((field) => delete queryObj[field]);
    //Advanced query
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (matched) => `$${matched}`
    );
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    if (this.queryStr.sort) {
      const sorting = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sorting);
    } else {
      this.query = this.query.sort("_id");
    }
    return this;
  }
  limit() {
    if (this.queryStr.limit) {
      this.query = this.query.limit(5);
    }
    return this;
  }
}
class ServiceProvider {
  static login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const sProvider = await serviceProviderModel.findOne({ email });
      if (!sProvider) {
        throw new Error("Invalid email or password");
      }
      const auth = await bcrypt.compare(password, sProvider.password);
      if (!auth) {
        throw new Error("Invalid email or password");
      }
      const sProviderToken = await sProvider.createToken();
      res.cookie("jwt", sProviderToken, {
        httpOnly: true,
        maxAge: 2 * 24 * 60 * 60 * 1000,
      });
      res.status(200).json({
        status: "success",
        message: "SProvider Loged in successfuly",
        cookie: sProviderToken,
      });
    } catch (err) {
      res.status(401).send(err.message);
    }
  };

  static getRequestById = async (req, res) => {
    try {
      // get all requests for a specific user
      const requests = await hireRequestModel.find({
        providerId: req.params.id,
      });
      res.status(200).json({
        status: "success",
        results: requests.length,
        requestedAt: req.requestTime,
        data: {
          requests,
        },
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  static addNewProvider = async (req, res) => {
    try {
      const sProvider = await serviceProviderModel.create(req.body);
      const providerToken = await sProvider.createToken();
      res.cookie("jwt", providerToken, {
        httpOnly: true,
        maxAge: 2 * 24 * 60 * 60 * 1000,
      });
      const { password, ...other } = sProvider._doc;
      res.status(200).json({
        status: "success",
        results: 1,
        requestedAt: req.requestTime,
        data: {
          ...other,
        },
        cookie: providerToken,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  static getProviders = async (req, res) => {
    try {
      const features = new APIFeatures(serviceProviderModel.find(), req.query);
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
      res.setHeader("Access-Control-Allow-Credentials", "true");
      features.filter().sort().limit();
      const providers = await features.query;
      res.status(200).json({
        status: "success",
        results: providers.length,
        requestedAt: req.requestTime,
        data: {
          providers,
        },
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  static getProviderById = async (req, res) => {
    try {
      const provider = await serviceProviderModel.findById(req.params.id);

      if (!provider) {
        throw new Error("There is no provider with this ID!");
      }

      const { password, ...other } = provider._doc;

      res.status(200).json({
        status: "success",
        results: 1,
        requestedAt: req.requestTime,
        data: {
          ...other,
        },
      });
    } catch (err) {
      res.status(404).json({
        status: "fail",
        message: err.message,
      });
    }
  };
  static getUserProfile = async (req, res, next) => {
    try {
      const user = await serviceProviderModel.findById(req.params.id);
      if (!user) {
        throw new Error("There is no user with this ID!");
      }
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, X-Requested-With, Accept"
      );
      const {
        password,
        email,
        phoneNum,
        reviewsMade,
        nationalID,
        requests,
        documents,
        status,
        ...other
      } = user._doc;

      res.status(200).json({
        status: "success",
        results: 1,
        requestedAt: req.requestTime,
        data: {
          ...other,
        },
      });
    } catch (err) {
      res.status(404).json({
        status: "fail",
        message: err.message,
      });
    }
  };

  static updateProviderById = async (req, res) => {
    try {
      const provider = await serviceProviderModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      if (!provider) {
        throw new Error("There is no provider with this ID!");
      }
      const { password, ...other } = provider._doc;

      res.status(200).json({
        status: "success",
        results: 1,
        requestedAt: req.requestTime,
        data: {
          ...other,
        },
      });
    } catch (err) {
      res.status(404).json({
        status: "fail",
        message: err.message,
      });
    }
  };

  static deleteProviderById = async (req, res) => {
    try {
      const provider = await serviceProviderModel.findByIdAndDelete(
        req.params.id
      );
      if (!provider) {
        throw new Error("There is no provider with this ID!");
      }
      res.status(201).json({
        status: "success",
      });
    } catch (err) {
      res.status(401).json({
        status: "fail",
        message: err.message,
      });
    }
  };
}

module.exports = ServiceProvider;
