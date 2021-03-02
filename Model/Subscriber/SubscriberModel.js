var mongoose = require("mongoose");
var Joi = require("joi");
var subscriberSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  previous: Array,
  current: {
    day: Number,
    startDate: Date,
    endDate: Date,
    amount: Number,
  },
});

subscriberSchema.statics.getSubscriberById = async function (id) {
  let Subscriber = await SubscriberModel.findOne({
    user: id,
  });
  return Subscriber;
};

subscriberSchema.statics.addSubscriber = async function (id, data) {
  // Add Subscriber
  let Subscriber = await SubscriberModel.findOne({ user: id });
  if (!Subscriber) {
    Subscriber = new SubscriberModel({
      user: id,
      previous: [],
      current: data,
    });
  } else {
    Subscriber.previous.push(Subscriber.current);
    Subscriber.current = data;
  }

  Subscriber = await Subscriber.save();
  return Subscriber;
};

subscriberSchema.statics.validate = async function (data) {
  //  Validating
  return validateSubscriber(data);
};

function validateSubscriber(data) {
  const schema = Joi.object({
    previous: Joi.string().required(),
    website: Joi.string().required(),
    short_description: Joi.string().required(),
  });
  return schema.validate(data, { abortEarly: false });
}

var SubscriberModel = mongoose.model("Subscriber", subscriberSchema);
module.exports = SubscriberModel;
