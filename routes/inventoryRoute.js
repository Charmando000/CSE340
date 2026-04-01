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

router.get("/", utilities.checkEmployeeOrAdmin, invController.buildManagement);

router.get("/add-classification", utilities.checkEmployeeOrAdmin, invController.buildAddClassification);

router.post("/add-classification", utilities.checkEmployeeOrAdmin, classificationRules(),
utilities.handleErrors(invController.createClassification)
);
router.get("/add-inventory", utilities.checkEmployeeOrAdmin, invController.buildAddInventory);

router.post("/add-inventory", utilities.checkEmployeeOrAdmin, inventoryRules(),
utilities.handleErrors(invController.createInventory)
);

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

router.get("/edit/:inv_id", utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.editInvItemView))

router.post(
  "/update",
  utilities.checkEmployeeOrAdmin,
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

// Route to build delete confirmation view
router.get(
  "/delete/:inv_id",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.deleteView)
)

// Route to handle delete process
router.post(
  "/delete",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.deleteItem)
)

module.exports = router;