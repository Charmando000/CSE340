const pool = require("../database/");

async function addFavorite(user_id, item_id) {
  try {
    const sql = `
      INSERT INTO favorites (user_id, item_id)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const result = await pool.query(sql, [user_id, item_id]);
    return result.rows[0];
  } catch (error) {
    console.error("addFavorite error:", error);
    throw error;
  }
}

async function removeFavorite(user_id, item_id) {
  try {
    const sql = `
      DELETE FROM favorites
      WHERE user_id = $1 AND item_id = $2;
    `;
    await pool.query(sql, [user_id, item_id]);
  } catch (error) {
    console.error("removeFavorite error:", error);
    throw error;
  }
}

async function getFavoritesByUser(user_id) {
  try {
    const sql = `
      SELECT i.*
      FROM favorites f
      JOIN inventory i ON f.item_id = i.inv_id
      WHERE f.user_id = $1;
    `;
    const result = await pool.query(sql, [user_id]);
    return result.rows;
  } catch (error) {
    console.error("getFavorites error:", error);
    throw error;
  }
}

module.exports = {
  addFavorite,
  removeFavorite,
  getFavoritesByUser
};