let SubscriberModel = require("../../Model/Subscriber/SubscriberModel");
var moment = require("moment");
module.exports = async function (req, res, next) {
  let user = await SubscriberModel.findOne({ user: req.body.id });
  if (user) {
    let a = moment(user.current.endDate);
    let b = moment(new Date());
    if (a.diff(b, "days") > 0)
      return res
        .status(400)
        .send(`Already have a Subscription ends in ${a.diff(b, "days")}!`);
    req.isValidated = true;
  }

  next();
};
