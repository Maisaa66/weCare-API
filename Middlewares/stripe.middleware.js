const stripeMiddleware = async (req, res, next) => {
  const { requestDetails } = req.body;
  const { reqData } = requestDetails;
  const { hourlyRate, totalHrs } = reqData;
};

module.exports = stripeMiddleware;
