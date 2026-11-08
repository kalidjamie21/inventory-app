const db = require('../db/queries');

async function getAllGames(req, res) {
  const selectedCategory = req.query.category;

  const categories = await db.getAllCategories();

  let games;

  if (selectedCategory) {
    games = await db.getGamesByCategory(Number(selectedCategory));
  } else {
    games = await db.getAllGames();
  }

  res.render("index", {
    title: "Game Inventory",
    games,
    categories,
    selectedCategory,
  });
}

async function getGameById(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(404).send("Invalid game ID");
  }

  const game = await db.getGameById(id);

  if (!game) {
    return res.status(404).send("Game not found");
  }

  res.render("gamePage", {
    game,
  });
}

async function getAllCategories(req, res) {
    const categories = await db.getAllCategories();
    res.render("categoriesPage", {
        title: "Categories",
        categories
    });
}

async function addGameGet(req, res) {
    const categories = await db.getAllCategories();

    res.render("addGameForm", {
        title: "Add Game",
        categories
    });
}

async function addGamePost(req, res) {
    const { title, description, category_id, cover_image, price } = req.body; // capture data provided by user
    console.log(req.body);
    await db.insertNewGame(title, description, category_id, cover_image, price);

    res.redirect('/');
}

async function editGameGet(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(404).send("Invalid game ID");
  }

  const game = await db.getGameById(id);
  const categories = await db.getAllCategories();

  if (!game) {
    return res.status(404).send("Game not found");
  }

  res.render("editGameForm", {
    title: `Edit ${game.title}`,
    game,
    categories,
  });
}

async function editGamePost(req, res) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        return res.status(404).send("Invalid game ID");
    }

    const {
        title, 
        description,
        category_id,
        cover_image,
        price
    } = req.body;

    await db.updateGame(
        id,
        title,
        description,
        category_id,
        cover_image,
        price
    );

    res.redirect(`/games/${id}`);
}


// insert game delete function here


function addCategoryGet(req, res) {
  res.render('addCategoryForm', {
    title: "Add Category"
  });
}

async function addCategoryPost(req, res) {
  const { title, description } = req.body;
  await db.insertNewCategory(
    title, 
    description
  );

  res.redirect("/categories");
}

async function editCategoryGet(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(404).send("Invalid category ID");
  }

  const category = await db.getCategoryById(id);

  if (!category) {
    return res.status(404).send("Category not found");
  }

  res.render("editCategoryForm", {
    title: "Edit Category Details",
    category,
  });
}

async function editCategoryPost(req, res) {
  
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
        return res.status(404).send("Invalid category ID");
  }
  
  const { title, description } = req.body;
  await db.updateCategory(id, title, description);

  res.redirect("/categories");
}

// delete game contingent on admin password check
async function deleteGamePost(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
        return res.status(404).send("Invalid game ID");
  }

  const { admin_password } = req.body;

  if (admin_password !== process.env.ADMIN_PASSWORD) {
    const game = await db.getGameById(id);

    return res.status(403).render("gamePage", {
      game,
      error: "Incorrect admin password. Please try again.",
    });
  }

  await db.deleteGame(id);
  
  res.redirect('/');

}

// delete category contingent on admin password AND category not containing games
async function deleteCategoryPost(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(404).send("Invalid category ID");
  }

  const { admin_password } = req.body;

  if (admin_password !== process.env.ADMIN_PASSWORD) {
    const categories = await db.getAllCategories();

    return res.status(403).render("categoriesPage", {
      title: "Categories",
      categories,
      error: "Incorrect admin password. Please try again.",
    });
  }

  try {
    await db.deleteCategory(id);

    res.redirect("/categories");
  } catch (error) {
    if (error.code === "23503") { // 23503 is psql error for foreign-key violation - cant delete bcoz reference exist
      const categories = await db.getAllCategories();

      return res.status(409).render("categoriesPage", {
        title: "Categories",
        categories,
        error: "This category cannot be deleted because it still contains games.",
      });
    }

    throw error;
  }
}



module.exports = {
    getAllGames,
    getGameById,
    getAllCategories,
    addGameGet,
    addGamePost,
    editGameGet,
    editGamePost,
    addCategoryGet,
    addCategoryPost,
    editCategoryGet,
    editCategoryPost,
    deleteGamePost,
    deleteCategoryPost
}