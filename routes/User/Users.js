var express = require("express");
const DuplicateValidator = require("../../Middleware/User/DuplicateValidator");
const LoginValidator = require("../../Middleware/User/LoginValidator");
const Auth = require("../../Middleware/Auth/Auth");
const BusinessModel = require("../../Model/Type/Business");
const IndividualModel = require("../../Model/Type/Individual");
const NonProfitModel = require("../../Model/Type/NonProfit");
const UserModel = require("../../Model/User/UserModel");
const RegistrationValidator = require("../../Middleware/User/RegistrationValidator");
const PasswordValidator = require("../../Middleware/User/PasswordValidator");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

/* GET users listing. */
router.get("/:role/:id", async function (req, res, next) {
  try {
    let data;
    if (req.params.role === "individual") {
      data = await IndividualModel.getIndividualById(req.params.id);
    } else if (req.params.role === "business") {
      data = await BusinessModel.getBusinessById(req.params.id);
    } else if (req.params.role === "non-profit") {
      data = await NonProfitModel.getNonProfitById(req.params.id);
    }
    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

/* GET users listing. */
router.post(
  "/",
  DuplicateValidator,
  RegistrationValidator,
  async function (req, res, next) {
    try {
      let user = new UserModel();
      user = await UserModel.addUser(req.body.user);

      if (req.body.user.type.text === "Individual") {
        let individual = new IndividualModel();
        await individual.addIndividual(user._id, req.body.individual);
      } else if (req.body.user.type.text === "Business") {
        let business = new BusinessModel();
        await business.addBusiness(user._id, req.body.business);
      } else if (req.body.user.type.text === "Non-Profit") {
        let non_profit = new NonProfitModel();
        await non_profit.addNonProfit(user._id, req.body.non_profit);
      }
      res.status(200).send(user);
    } catch (err) {
      console.log(err);
      res.status(400).send(err.message);
    }
  }
);

router.put("/", Auth, async function (req, res, next) {
  try {
    let user = await UserModel.updateUser(req.body.id, req.body.user);

    if (req.body.user.type.text === "Individual") {
      let individual = await IndividualModel.updateIndividual(
        req.body.id,
        req.body.individual
      );
    } else if (req.body.user.type.text === "Business") {
      let business = await BusinessModel.updateBusiness(
        req.body.id,
        req.body.business
      );
    } else if (req.body.user.type.text === "Non-Profit") {
      let non_profit = await NonProfitModel.updateNonProfit(
        req.body.id,
        req.body.non_profit
      );
    }

    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

router.put(
  "/change_password",
  Auth,
  PasswordValidator,
  async function (req, res, next) {
    try {
      let user = await UserModel.updatePass(req.body);
      res.status(200).send(user);
    } catch (err) {
      console.log(err);
      res.status(400).send(err.message);
    }
  }
);

router.post("/login", LoginValidator, async function (req, res, next) {
  try {
    let user = await UserModel.getUserByUsername(req.body);
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

module.exports = router;
