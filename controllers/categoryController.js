const Plant = require('../models/plants');
const Category = require('../models/category');
const async = require('async');

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
  res.send('NOT IMPLEMENTED: category create GET');
};

// Handle category create on POST.
exports.category_create_post = (req, res) => {
  res.send('NOT IMPLEMENTED: category create POST');
};

// Display category delete form on GET.
exports.category_delete_get = (req, res) => {
  res.send('NOT IMPLEMENTED: category delete GET');
};

// Handle category delete on POST.
exports.category_delete_post = (req, res) => {
  res.send('NOT IMPLEMENTED: category delete POST');
};

// Display category update form on GET.
exports.category_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: category update GET');
};

// Handle category update on POST.
exports.category_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: category update POST');
};
