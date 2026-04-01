const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require ("dotenv").config()

async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null
  })
  
}
/* ****************************************
*  Deliver register view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    return res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    return res.redirect("/account/login")
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

async function logout(req, res) {
  res.clearCookie("jwt")
  return res.redirect("/")
}

async function buildAccountManagement(req, res) {
  let nav = await utilities.getNav()
  const accountData = res.locals.accountData

  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    notice: req.flash("notice"),
    accountData,
  });
}

async function buildUpdateView(req, res) {
  let nav = await utilities.getNav()
  const account_id = req.params.account_id
  const accountData = await accountModel.getAccountById(account_id)

  if (!accountData) {
    req.flash("notice", "No account found.")
    return res.redirect("/account/")
  }

  res.render("account/update-view", {
    title: "Update Account",
    nav,
    errors: null,
    accountData,
    notice: req.flash("notice"),
  })
}

async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_id, account_firstname, account_lastname, account_email } = req.body

  const updateResult = await accountModel.updateAccountInfo(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )

  if (updateResult && updateResult.rowCount > 0) {
    req.flash("notice", "Your account information was updated successfully.")
    const accountData = await accountModel.getAccountById(account_id)
    return res.render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
      notice: req.flash("notice"),
      accountData,
    })
  }

  req.flash("notice", "Sorry, the update failed.")
  const accountData = await accountModel.getAccountById(account_id)
  return res.render("account/update-view", {
    title: "Update Account",
    nav,
    errors: null,
    notice: req.flash("notice"),
    accountData,
    account_firstname,
    account_lastname,
    account_email,
    account_id,
  })
}

async function updatePassword(req, res) {
  let nav = await utilities.getNav()
  const { account_id, account_password } = req.body
  let hashedPassword

  try {
    hashedPassword = await bcrypt.hash(account_password, 10)
  } catch (error) {
    req.flash("notice", "Sorry, there was an error hashing the password.")
    const accountData = await accountModel.getAccountById(account_id)
    return res.render("account/update-view", {
      title: "Update Account",
      nav,
      errors: null,
      notice: req.flash("notice"),
      accountData,
      account_id,
    })
  }

  const updateResult = await accountModel.updateAccountPassword(
    hashedPassword,
    account_id
  )

  if (updateResult && updateResult.rowCount > 0) {
    req.flash("notice", "Your password was updated successfully.")
    const accountData = await accountModel.getAccountById(account_id)
    return res.render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
      notice: req.flash("notice"),
      accountData,
    })
  }

  req.flash("notice", "Sorry, the password update failed.")
  const accountData = await accountModel.getAccountById(account_id)
  return res.render("account/update-view", {
    title: "Update Account",
    nav,
    errors: null,
    notice: req.flash("notice"),
    accountData,
    account_id,
  })
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  logout,
  buildAccountManagement,
  buildUpdateView,
  updateAccount,
  updatePassword,
}