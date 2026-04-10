const favModel = require("../models/favorites-model");

async function addFavorite(req, res) {
  try {
    if (!req.session.account_id) {
    return res.redirect("/account/login");
    }

    const user_id = req.session.account_id;
    const { item_id } = req.body;

    await favModel.addFavorite(user_id, item_id);

    res.redirect("/favorites");
  } catch (error) {
    res.status(500).send("Error adding favorite");
  }
}

async function removeFavorite(req, res) {
  try {
    if (!req.session.account_id) {
    return res.redirect("/account/login");
    }

    const user_id = req.session.account_id;
    const { item_id } = req.body;

    await favModel.removeFavorite(user_id, item_id);

    res.redirect("/favorites");
  } catch (error) {
    res.status(500).send("Error removing favorite");
  }
}

async function showFavorites(req, res) {
  try {
    if (!req.session.account_id) {
    return res.redirect("/account/login");
    }
    
    const user_id = req.session.account_id;

    const favorites = await favModel.getFavoritesByUser(user_id);

    res.render("account/favorites", { title: "My Favorites", favorites });
  } catch (error) {
    res.status(500).send("Error loading favorites");
  }
}

module.exports = {
  addFavorite,
  removeFavorite,
  showFavorites
};