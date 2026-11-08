const pool = require("./pool");

async function getAllGames() {
  const { rows } = await pool.query(`
    SELECT
      games.id,
      games.title,
      games.description,
      games.cover_image,
      games.price,
      categories.title AS category_title
    FROM games
    JOIN categories
      ON games.category_id = categories.id
  `);

  return rows;
}

async function getGameById(id) {
  const { rows } = await pool.query(`
    SELECT
      games.id,
      games.title,
      games.description,
      games.category_id,
      games.cover_image,
      games.price,
      categories.title AS category_title
    FROM games
    JOIN categories
      ON games.category_id = categories.id
    WHERE games.id = $1;
  `, [id]);

    return rows[0]; // return only the first index data which is the id/title/etc. array
}

async function getAllCategories() {
  const { rows } = await pool.query(`
    SELECT *
      FROM categories
    ORDER BY title;
    `);

    return rows;
}

async function getGamesByCategory(categoryId) {
  const { rows } = await pool.query(`
    SELECT
      games.id,
      games.title,
      games.description,
      games.cover_image,
      games.price,
      categories.title AS category_title
    FROM games
    JOIN categories
      ON games.category_id = categories.id
    WHERE games.category_id = $1
    ORDER BY games.title;
  `, [categoryId]);

  return rows;
}

async function insertNewGame(
  title, 
  description, 
  category_id, 
  cover_image, 
  price
) {
  await pool.query(`
    INSERT INTO games (
      title, 
      description, 
      category_id, 
      cover_image, 
      price
      ) 
    VALUES ($1, $2, $3, $4, $5);
    `, [
      title, 
      description, 
      category_id, 
      cover_image, 
      price
    ]); 
}

async function updateGame(
  id,
  title,
  description,
  categoryId,
  coverImage,
  price
) {
  await pool.query(`
    UPDATE games
    SET
      title = $1,
      description = $2,
      category_id = $3,
      cover_image = $4,
      price = $5
    WHERE id = $6;
  `, [
    title,
    description,
    categoryId,
    coverImage,
    price,
    id,
  ]);
}

// insert game deletion function here

async function insertNewCategory(title, description) {
  await pool.query(`
    INSERT INTO categories (
      title,
      description)
    VALUES ($1, $2);
    `, [
      title,
      description
    ]);
}

// get category by id
async function getCategoryById(id) {
  const { rows } = await pool.query(`
    SELECT id, title, description
    FROM categories
    WHERE id = $1;
  `, [id]);

  return rows[0];
}

// category update query
async function updateCategory (id, title, description) {
  await pool.query(`
    UPDATE categories
    SET
      title = $1,
      description = $2
    WHERE id = $3
    `, [
      title,
      description,
      id
    ]);
}

// game deletion
async function deleteGame(id) {
  const result = await pool.query(`
    DELETE FROM games
    WHERE id = $1;
  `, [id]);

  return result.rowCount; // returns number of rows affected/deleted in the DB
}

// category deletion
async function deleteCategory(id) {
  const result = await pool.query(`
    DELETE FROM categories
    WHERE id = $1;
    `, [id]);

    return result.rowCount;
}

module.exports = {
  getAllGames,
  getGameById,
  getAllCategories,
  getGamesByCategory,
  insertNewGame,
  updateGame,
  insertNewCategory,
  getCategoryById,
  updateCategory,
  deleteGame,
  deleteCategory
};