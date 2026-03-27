const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const { validationResult } = require("express-validator")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId

  try {
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name

    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.inv_id

  try {
    const data = await invModel.getInventoryById(inv_id)

    const detailHTML = await utilities.buildDetailView(data)

    res.render("inventory/details", { 
      title: `${data.inv_make} ${data.inv_model}`,
      nav: await utilities.getNav(),
      detailHTML,
    })
  } catch (error) {
    next(error)
  }
}

invCont.buildManagement = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    messages: req.flash(),
    error: null
  })
}

invCont.buildAddClassification = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null
  })
}

invCont.createClassification = async function (req, res, next) {
  const errors = validationResult(req)
  const { classification_name } = req.body
  let nav = await utilities.getNav()

  if (!errors.isEmpty()) {
    return res.status(400).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors,
      classification_name
    })
  }

  try {
    const result = await invModel.insertClassification(classification_name)

    if (result && result.rowCount > 0) {
      req.flash("success", `${classification_name} added successfully`)
      return res.redirect("/inv")
    }

    req.flash("error", "Failed to add classification")
    return res.status(500).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      classification_name
    })
  } catch (error) {
    next(error)
  }
}

invCont.buildAddInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()

  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null
  })
}

invCont.createInventory = async function (req, res, next) {
  const errors = validationResult(req)
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  } = req.body

  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList(classification_id)

  if (!errors.isEmpty()) {
    return res.status(400).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
  }

  try {
    const result = await invModel.insertInventory(
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    )

    if (result && result.rowCount > 0) {
      req.flash("success", `${inv_make} ${inv_model} added successfully`)
      return res.redirect("/inv")
    }

    req.flash("error", "Failed to add inventory item")
    return res.status(500).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: null,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Trigger intentional error
 * ************************** */
invCont.triggerError = function (req, res, next) {
  const err = new Error("Intentional 500 error")
  err.status = 500
  next(err)
}

module.exports = invCont