//Need Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const { classificationRules, inventoryRules } = require('../utilities/account-validation')
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

//Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

router.get("/detail/:inv_id", invController.buildByInventoryId);

router.get("/error", invController.triggerError);

router.get("/", invController.buildManagement);

router.get("/add-classification", invController.buildAddClassification);

router.post("/add-classification", classificationRules(),
utilities.handleErrors(invController.createClassification)
);
router.get("/add-inventory", invController.buildAddInventory);

router.post("/add-inventory", inventoryRules(),
utilities.handleErrors(invController.createInventory)
);

router.get("/inv/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

router.get("/edit/:inv_id", utilities.handleErrors(invController.editInvItemView))

router.post(
  "/update",
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

module.exports = router;