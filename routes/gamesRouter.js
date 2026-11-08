const { Router } = require('express');
const gamesController = require('../controllers/gamesController');
const { getAllGames } = require('../db/queries');

const router = Router();


// GET / homepage
router.get('/', gamesController.getAllGames);

// Get / add game form view
router.get('/games/new', gamesController.addGameGet);

// POST / add-game submission action
router.post("/games/new", gamesController.addGamePost);

// GET / edit game form view
router.get("/games/:id/edit", gamesController.editGameGet);

// POST / submit the edited game information
router.post("/games/:id/edit", gamesController.editGamePost);

// GET / individual game details
router.get('/games/:id', gamesController.getGameById);

// GET / view all categories
router.get('/categories', gamesController.getAllCategories);

// GET / add category form view
router.get("/categories/new", gamesController.addCategoryGet);

// POST / add-category submission action
router.post('/categories/new', gamesController.addCategoryPost);

// GET / edit category form view
router.get("/categories/:id/edit", gamesController.editCategoryGet);

//POST / submit the edited category information
router.post("/categories/:id/edit", gamesController.editCategoryPost);

//POST / delete game action after checking admin password authorization
router.post("/games/:id/delete", gamesController.deleteGamePost);

//POST / delete category action after checking admin password authorization
router.post("/categories/:id/delete", gamesController.deleteCategoryPost);


module.exports = router;