var express = require("express");
const Auth = require("../../Middleware/Auth/Auth");
const SubscriberModel = require("../../Model/Subscriber/SubscriberModel");
var router = express.Router();
const paypal = require("paypal-rest-sdk");
var moment = require("moment");
const SubscriberValidator = require("../../Middleware/Subscriber/SubscriberValidator");

paypal.configure({
  mode: process.env.MODE, //sandbox or live
  client_id: process.env.PAY_PAL_CLIENT_ID,
  client_secret: process.env.PAY_PAL_CLIENT_SECRET,
});

/* GET users listing. */
router.post(
  "/payment",
  Auth,
  SubscriberValidator,
  async function (req, res, next) {
    try {
      var create_payment_json = {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        redirect_urls: {
          return_url:
            "http://192.168.8.100:3000/subscriber/success?price=" +
            req.body.price +
            "&day=" +
            req.body.day +
            "&id=" +
            req.body.id,
          cancel_url: "http://192.168.8.100:3000/subscriber/cancel",
        },
        transactions: [
          {
            item_list: {
              items: [
                {
                  name: "Subscription",
                  sku: "Subscription",
                  price: req.body.price,
                  currency: "USD",
                  quantity: 1,
                },
              ],
            },
            amount: {
              currency: "USD",
              total: req.body.price,
            },
            description: "FreeFindz Payment Subscriber!",
          },
        ],
      };

      paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
          throw error;
        } else {
          console.log("Create Payment Response");
          console.log(payment);
          res.status(200).send(payment.links[1].href);
        }
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err.message);
    }
  }
);

router.get("/success", (req, res) => {
  try {
    var PayerID = req.query.PayerID;
    var paymentId = req.query.paymentId;
    var token = req.query.token;
    var price = req.query.price;
    var day = req.query.day;
    var id = req.query.id;
    console.log(req.query);
    var execute_payment_json = {
      payer_id: PayerID,
      transactions: [
        {
          amount: {
            currency: "USD",
            total: price,
          },
        },
      ],
    };

    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      async function (error, payment) {
        if (error) {
          console.log(error.response);
          throw error;
        } else {
          console.log("Get Payment Response");
          console.log(JSON.stringify(payment));
          res.locals.PayerID = PayerID;
          res.locals.PaymentId = paymentId;
          res.locals.Price = price;
          res.locals.Subscription = day;
          res.locals.Token = token;

          let data = {
            day: day,
            amount: price,
            startDate: new Date(),
            endDate: moment(new Date()).add(day, "d"),
          };
          await SubscriberModel.addSubscriber(id, data);

          res.render("success");
        }
      }
    );
  } catch (err) {
    res.locals.error = err;
    res.locals.message = req.query;
    res.render("error");
  }
});

router.get("/error", function (req, res) {
  try {
    res.locals.error = "Invalid!";
    res.locals.message = req.query;
    res.render("error");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

/* GET users listing. */
router.get("/:id", async function (req, res, next) {
  try {
    console.log("ss2");
    let Subscriber = await SubscriberModel.getSubscriberById(req.params.id);
    res.status(200).send(Subscriber);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});
/* GET users listing. */
router.get("/", async function (req, res, next) {
  try {
    console.log("ss1");
    let Subscriber = await SubscriberModel.getSubscriber();
    res.status(200).send(Subscriber);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});
router.put("/", Auth, async function (req, res, next) {
  try {
    let Subscriber = await SubscriberModel.updateSubscriber(
      req.body._id,
      req.body
    );
    res.status(200).send(Subscriber);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

module.exports = router;
