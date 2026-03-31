const express = require("express")
const router = new express.Router()
const regValidate = require('../utilities/account-validation')

const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
//login
router.get("/login", utilities.handleErrors(accountController.buildLogin)
)
//register
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
)

router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checklogData,
  utilities.handleErrors(accountController.accountLogin)
)

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))

module.exports = router