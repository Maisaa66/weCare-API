const userModel = require("../Models/users.model");
const serviceProviderModel = require("../Models/serviceProvider.model");

const getStats = async function (req, res) {
  const { start, end } = req.query;

  try {
    const serviceTypeStats = await serviceProviderModel.aggregate([
      {
        $group: {
          _id: "$serviceType",
          count: { $sum: 1 },
        },
      },
      { $project: { label: "$_id", count: 1, _id: 0 } },
    ]);
    const serviceLocationsStats = await serviceProviderModel.aggregate([
      {
        $group: {
          _id: "$address.governate",
          count: { $sum: 1 },
        },
      },
      { $project: { label: "$_id", count: 1, _id: 0 } },
    ]);
    const providersOverPassedWeek = await serviceProviderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${start}`),
            $lte: new Date(`${end}`),
          },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          label: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 1] }, then: "Sunday" },
                { case: { $eq: ["$_id", 2] }, then: "Monday" },
                { case: { $eq: ["$_id", 3] }, then: "Tuesday" },
                { case: { $eq: ["$_id", 4] }, then: "Wednesday" },
                { case: { $eq: ["$_id", 5] }, then: "Thursday" },
                { case: { $eq: ["$_id", 6] }, then: "Friday" },
                { case: { $eq: ["$_id", 7] }, then: "Saturday" },
              ],
            },
          },
          count: 1,
          _id: 0,
        },
      },
    ]);
    const usersOverPassedWeek = await userModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${start}`),
            $lte: new Date(`${end}`),
          },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          label: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 1] }, then: "Sunday" },
                { case: { $eq: ["$_id", 2] }, then: "Monday" },
                { case: { $eq: ["$_id", 3] }, then: "Tuesday" },
                { case: { $eq: ["$_id", 4] }, then: "Wednesday" },
                { case: { $eq: ["$_id", 5] }, then: "Thursday" },
                { case: { $eq: ["$_id", 6] }, then: "Friday" },
                { case: { $eq: ["$_id", 7] }, then: "Saturday" },
              ],
            },
          },
          count: 1,
          _id: 0,
        },
      },
    ]);
    res.status(200).json({
      status: "success",
      stats: {
        serviceTypeStats,
        serviceLocationsStats,
        resultP: providersOverPassedWeek.length,
        providersOverPassedWeek,
        resultU: usersOverPassedWeek.length,
        usersOverPassedWeek,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      error: err.message,
    });
  }
};
module.exports = getStats;
