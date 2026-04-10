const express = require("express");
const router = new express.Router();
const favController = require("../controllers/favoritesController");

router.get("/", favController.showFavorites);

router.post("/add", favController.addFavorite);

router.post("/remove", favController.removeFavorite);

module.exports = router;