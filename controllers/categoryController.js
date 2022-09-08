const Plant = require('../models/plants');
const Category = require('../models/category');
const async = require('async');
const { body, validationResult } = require("express-validator");


// Display list of all category.
exports.category_list = (req, res) => {
    Category.find({})
    .exec(function (err, list_categories) {
      if (err) { return next(err); }
      res.render('category_list', { title: 'Category List', category_list: list_categories });
      });
  };

// Display detail page for a specific category.
exports.category_detail = (req, res, next) => {
    console.log(req)
    async.parallel(
        {
          category(callback) {
            Category.findById(req.params.id)
              .exec(callback);
          }, 
          category_plants(callback) {
            Plant.find({ category: req.params.id }).exec(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          if (results.category == null) {
            // No results.
            const err = new Error("category not found");
            err.status = 404;
            return next(err);
          }
          // Successful, so render.
          res.render("category_detail", {
            title: results.category.name,
            category: results.category,
            category_plants: results.category_plants,
          });
        }
      );
    };
// Display category create form on GET.
exports.category_create_get = (req, res) => {
  res.render("category_form", { title: "Create Category" });
};

exports.category_create_post = [
  // Validate and sanitize the name field.
  body("description", "Category description required").trim().isLength({ min: 1 }).escape(),
  body("name", "Category name required").trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Category object with escaped and trimmed data.
    const category = new Category({ name: req.body.name, description: req.body.description });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("category_form", {
        title: "Create Category",
        category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Category with same name already exists.
      Category.findOne({ name: req.body.name }).exec((err, found_category) => {
        if (err) {
          return next(err);
        }

        if (found_category) {
          // Category exists, redirect to its detail page.
          res.redirect(found_category.url);
        } else {
          category.save((err) => {
            if (err) {
              return next(err);
            }
            // Category saved. Redirect to Category detail page.
            res.redirect(category.url);
          });
        }
      });
    }
  },
];


// Display category delete form on GET.
exports.category_delete_get = (req, res, next) => {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.params.id).exec(callback);
      },
      categories_plants(callback) {
        Plant.find({ category: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.category == null) {
        // No results.
        res.redirect("/catalog/categories");
      }
      // Successful, so render.
      res.render("category_delete", {
        title: "Delete category",
        category: results.category,
        category_plants: results.categories_plants,
      });
    }
  );
};

// Handle category delete on POST.
exports.category_delete_post = (req, res, next) => {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.body.categoryid).exec(callback);
      },
      categories_plants(callback) {
        Plant.find({ category: req.body.categoryid }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      // Success
      if (results.categories_plants.length > 0) {
        // category has books. Render in same way as for GET route.
        res.render("category_delete", {
          title: "Delete category",
          category: results.category,
          category_plants: results.categories_plants,
        });
        return;
      }
      // category has no books. Delete object and redirect to the list of categorys.
      Category.findByIdAndRemove(req.body.categoryid, (err) => {
        if (err) {
          return next(err);
        }
        // Success - go to category list
        res.redirect("/catalog/categories");
      });
    }
  );
};


exports.category_update_get = (req, res, next) => {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.params.id)
          .exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.category == null) {
        // No results.
        const err = new Error("category not found");
        err.status = 404;
        return next(err);
      }
      res.render("category_form", {
        title: "Update category",
        category: results.category,
      });
    }
  );
};

exports.category_update_post = [
   // Validate and sanitize fields.
  body("description", "Category description required").trim().isLength({ min: 1 }).escape(),
  body("name", "Category name required").trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    const category = new Category({ name: req.body.name, description: req.body.description, _id: req.params.id });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
        (err, results) => {
          if (err) {
            return next(err);
          }
          // Mark our selected categories as checked.
          res.render("category_form", {
            title: "Update category",
            category,
            errors: errors.array(),
          });
        }
      return;
    }

    // Data from form is valid. Update the record.
    Category.findByIdAndUpdate(req.params.id, category, {}, (err, category) => {
      if (err) {
        return next(err);
      }

      // Successful: redirect to plant detail page.
      res.redirect(category.url);
    });
  },
];
