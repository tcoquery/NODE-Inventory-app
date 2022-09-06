const express = require('express');
const router = express.Router();

// Require controller modules.
const plant_controller = require('../controllers/plantController');
const category_controller = require('../controllers/categoryController');

/// PLANT ROUTES ///

// GET catalog home page.
router.get('/', plant_controller.index);

// GET request for creating a plant. NOTE This must come before routes that display plant (uses id).
router.get('/plant/create', plant_controller.plant_create_get);

// POST request for creating plant.
router.post('/plant/create', plant_controller.plant_create_post);

// GET request to delete plant.
router.get('/plant/:id/delete', plant_controller.plant_delete_get);

// POST request to delete plant.
router.post('/plant/:id/delete', plant_controller.plant_delete_post);

// GET request to update plant.
router.get('/plant/:id/update', plant_controller.plant_update_get);

// POST request to update plant.
router.post('/plant/:id/update', plant_controller.plant_update_post);

// GET request for one plant.
router.get('/plant/:id', plant_controller.plant_detail);

// GET request for list of all plant items.
router.get('/plants', plant_controller.plant_list);

/// CATEGORY ROUTES ///

// GET request for creating category. NOTE This must come before route for id (i.e. display category).
router.get('/category/create', category_controller.category_create_get);

// POST request for creating category.
router.post('/category/create', category_controller.category_create_post);

// GET request to delete category.
router.get('/category/:id/delete', category_controller.category_delete_get);

// POST request to delete category.
router.post('/category/:id/delete', category_controller.category_delete_post);

// GET request to update category.
router.get('/category/:id/update', category_controller.category_update_get);

// POST request to update category.
router.post('/category/:id/update', category_controller.category_update_post);

// GET request for one category.
router.get('/category/:id', category_controller.category_detail);

// GET request for list of all categorys.
router.get('/categories', category_controller.category_list);

module.exports = router;
