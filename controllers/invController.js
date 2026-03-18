const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

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

/* ***************************
 *  Trigger intentional error
 * ************************** */
invCont.triggerError = function (req, res, next) {
  const err = new Error("Intentional 500 error")
  err.status = 500
  next(err)
}

module.exports = invCont