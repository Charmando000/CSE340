const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}
  const accountModel = require("../models/account-model")

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required.")
        .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
            if (emailExists){
            throw new Error("Email exists. Please log in or use different email")
        }
        }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

  validate.loginRules = () => {
    return [
      // valid email is required and cannot already exist in the DB
      body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required."),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .withMessage("Password does not meet requirements."),
    ]
  }

 /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

validate.checklogData = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await require("../utilities/").getNav()
    return res.render("account/login", {
      title: "Login",
      nav,
      errors
    })
  }
  next()
}

validate.inventoryRules = () => {
  return [
    body("inv_make")
    .trim()
    .notEmpty()
    .withMessage("Make is required"),
    body("inv_model")
    .trim()
    .notEmpty()
    .withMessage("Model is required"),
    body("inv_year")
    .isInt()
    .withMessage("Year must be a valid integer"),
    body("inv_price")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a valid number"),
    body("inv_miles")
    .isInt({ gt: 0 })
    .withMessage("Miles must be a valid integer"),
    body("inv_color")
    .trim()
    .notEmpty()
    .withMessage("Color is required"),
    body("classification_id")
    .isInt()
    .withMessage("Classification ID must be a valid integer")
  ]
}

validate.classificationRules = () => {
  return [
    body("classification_name")
    .trim()
    .matches(/^[A-Za-z0-9]+$/)
    .withMessage("No spaces or special characters allowed.")

  ]
}

module.exports = validate