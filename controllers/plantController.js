const Plant = require('../models/plants');
const Category = require('../models/category');
const async = require('async');
const { body, validationResult } = require("express-validator");

exports.index = (req, res) => {
    async.parallel({
        plant_count(callback) {
            Plant.countDocuments({}, callback)
        },
        category_count(callback) {
            Category.countDocuments({}, callback)
        }
        },
    (err, results) => {
        res.render('index', { title: 'Plant inventory', error: err, data: results });
      });
    };

// Display list of all plants.
exports.plant_list = (req, res) => {
  Plant.find({})
  .exec(function (err, list_plants) {
    if (err) { return next(err); }
    res.render('plant_list', { title: 'Plant List', plant_list: list_plants });
    });
};

// Display detail page for a specific plant.
exports.plant_detail = (req, res, next) => {
    async.parallel(
        {
          plant(callback) {
            Plant.findById(req.params.id)
              .populate("category")   
              .exec(callback);  
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          if (results.plant == null) {
            // No results.
            const err = new Error("Plant not found");
            err.status = 404;
            return next(err);
          }
          // Successful, so render.
          res.render("plant_detail", {
            title: results.plant.name,
            plant: results.plant,
          });
        }
      );
    };

// Display plant create form on GET.
exports.plant_create_get = (req, res, next) => {
  async.parallel(
    {
      categories(callback) {
        Category.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render("plant_form", {
        title: "Create Plant",
        categories: results.categories,
      });
    }
  );
};

// Handle plant create on POST.
exports.plant_create_post = [
  // Convert the category to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category === "undefined" ? [] : [req.body.category];
    }
    next();
  },

  // Validate and sanitize fields.
  body("name", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("Stock", "Category must not be empty.").escape(),
  body("price", "Price must not be empty").escape(),
  body("category.*").escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a plant object with escaped and trimmed data.
    const plant = new Plant({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and categories for form.
      async.parallel(
        {
          categories(callback) {
            Category.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          // Mark our selected categories as checked.
          for (const category of results.categories) {
            if (plant.category.includes(category._id)) {
              category.checked = "true";
            }
          }
          res.render("plant_form", {
            title: "Create plant",
            categories: results.categories,
            plant,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    // Data from form is valid. Save plant.
    plant.save((err) => {
      if (err) {
        return next(err);
      }
      // Successful: redirect to new plant record.
      res.redirect(plant.url);
    });
  },
];


// Display plant delete form on GET.
exports.plant_delete_get = (req, res, next) => {
  async.parallel(
    {
      plant(callback) {
        Plant.findById(req.params.id).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      // Successful, so render.
      res.render("plant_delete", {
        title: "Delete plant",
        plant: results.plant,
      });
      
    }
  );
};


// Handle plant delete on POST.
exports.plant_delete_post = (req, res, next) => {

      // plant has no plants. Delete object and redirect to the list of plants.
      Plant.findByIdAndRemove(req.body.plantid, (err) => {
        if (err) {
          return next(err);
        }
        // Success - go to plant list
        res.redirect("/catalog/plants");
      });
    }


// Display plant update form on GET.
exports.plant_update_get = (req, res, next) => {
  // Get plant, authors and categories for form.
  async.parallel(
    {
      plant(callback) {
        Plant.findById(req.params.id)
          .populate("category")
          .exec(callback);
      },
      categories(callback) {
        Category.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.plant == null) {
        // No results.
        const err = new Error("plant not found");
        err.status = 404;
        return next(err);
      }
      res.render("plant_form", {
        title: "Update plant",
        categories: results.categories,
        plant: results.plant,
      });
    }
  );
};


// Handle plant update on POST.
exports.plant_update_post = [
  // Convert the category to an array
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category = typeof req.body.category === "undefined" ? [] : [req.body.category];
    }
    next();
  },

  // Validate and sanitize fields.
  body("name", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("Stock", "Category must not be empty.").escape(),
  body("price", "Price must not be empty").escape(),
  body("category.*").escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a plant object with escaped/trimmed data and old id.
    const plant = new Plant({
      name: req.body.name,
      description: req.body.description,
      category: typeof req.body.category === "undefined" ? [] : req.body.category,
      price: req.body.price,
      stock: req.body.stock,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      async.parallel(
        {
          categories(callback) {
            Category.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          // Mark our selected categories as checked.
          for (const category of results.categories) {
            if (plant.category.includes(category._id)) {
              category.checked = "true";
            }
          }
          res.render("plant_form", {
            title: "Update plant",
            categories: results.categories,
            plant,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    // Data from form is valid. Update the record.
    Plant.findByIdAndUpdate(req.params.id, plant, {}, (err, theplant) => {
      if (err) {
        return next(err);
      }

      // Successful: redirect to plant detail page.
      res.redirect(theplant.url);
    });
  },
];

