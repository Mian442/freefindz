let SubscriberModel = require("../../Model/Subscriber/SubscriberModel");
var moment = require("moment");
module.exports = async function (req, res, next) {
  let sub = await SubscriberModel.findOne({ user: req.body.id }).populate(
    "user"
  );
  if (!sub) {
    return res.status(400).send(`You have No Subscription`);
  } else if (sub && sub.user.type.text === "Business") {
    let a = moment(sub.current.endDate);
    let b = moment(new Date());
    if (a.diff(b, "days") === 0)
      return res
        .status(400)
        .send(`You have No Subscription! please Add Subscription`);
    req.isValidated = true;
  }
  next();
};
