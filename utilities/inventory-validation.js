/* ******************************
 * Check data for new inventory
 * ***************************** */
const { validationResult } = require("express-validator")

/* ******************************
 * Check data for new inventory
 * ***************************** */
function checkInventoryData(req, res, next) {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.render("inventory/add-inventory", {
      title: "Add Inventory",
      errors
    })
  }

  next()
}

/* ******************************
 * Check data for update inventory
 * ***************************** */
function checkUpdateData(req, res, next) {
  const errors = validationResult(req)

  const {
    inv_id,
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

  if (!errors.isEmpty()) {
    return res.render("inventory/edit-inventory", {
      title: "Edit " + inv_make + " " + inv_model,
      errors,
      inv_id,
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

  next()
}

module.exports = {
  checkInventoryData,
  checkUpdateData
}