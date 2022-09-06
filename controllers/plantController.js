const Plant = require('../models/plants');
const Category = require('../models/category');
const async = require('async');

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
exports.plant_create_get = (req, res) => {
  res.send('NOT IMPLEMENTED: plant create GET');
};

// Handle plant create on POST.
exports.plant_create_post = (req, res) => {
  res.send('NOT IMPLEMENTED: plant create POST');
};

// Display plant delete form on GET.
exports.plant_delete_get = (req, res) => {
  res.send('NOT IMPLEMENTED: plant delete GET');
};

// Handle plant delete on POST.
exports.plant_delete_post = (req, res) => {
  res.send('NOT IMPLEMENTED: plant delete POST');
};

// Display plant update form on GET.
exports.plant_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: plant update GET');
};

// Handle plant update on POST.
exports.plant_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: plant update POST');
};
