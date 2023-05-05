const hireRequestModel = require("../Models/hireRequest.model");

class Requests {
  static createRequest = async (req, res) => {
    try {
      const request = await hireRequestModel.create(req.body);
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
      res.status(200).json({
        status: "success",
        results: 1,
        requestedAt: req.requestTime,
        data: {
          request,
        },
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  static deleteRequest = async (req, res) => {
    try {
      const request = await hireRequestModel.findByIdAndDelete(req.params.id);
      if (!request) {
        throw new Error("There is no request with this ID!");
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

      res.status(200).json({
        status: "success",
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  static updateStatus = async (req, res) => {
    try {
      const request = await hireRequestModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      if (!request) {
        throw new Error("There is no request with this ID!");
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

      res.status(200).json({
        status: "success",
        results: 1,
        requestedAt: req.requestTime,
        data: {
          request,
        },
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
}

module.exports = Requests;
