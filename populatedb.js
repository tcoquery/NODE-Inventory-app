#! /usr/bin/env node

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Plant = require('./models/plants')
var Category = require('./models/category')

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var plants = []
var categories = []

function categoryCreate(name, description, cb) {
    var category = new Category({ name: name, description: description });
         
    category.save(function (err) {
      if (err) {
        cb(err, null);
        return;
      }
      console.log('New Category: ' + category);
      categories.push(category)
      cb(null, category);
    }   );
  }
  

function plantCreate(name, description, category, price, stock, cb) {
  plantdetail = { 
    name: name,
    description: description,
    category: category,
    price: price,
    stock: stock
  }
    
  var plant = new Plant(plantdetail);    
  plant.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Plant: ' + plant);
    plants.push(plant)
    cb(null, plant)
  }  );
}

function createCategories(cb) {
    async.series([
        function(callback) {
            categoryCreate('Plantes vertes', 'Les plantes vertes font partie intégrante de la décoration intérieure et apportent une touche de nature et de verdure dans la maison. ', callback);
        },
        function(callback) {
            categoryCreate('Plantes fleuries', 'Élégantes et colorées, les plantes d’intérieur fleuries apportent une touche de gaieté et de fraîcheur dans la maison.', callback);
        },
        function(callback) {
            categoryCreate('Plantes grasses', 'Si vous recherchez une plante d’intérieur peu exigeante et originale, les cactus et plantes succulentes ont tout pour vous séduire ! ', callback);
        },
        function(callback) {
            categoryCreate('Bonsaïs', 'Le bonsaï est un art qui attire de plus en plus de passionnés, mais aussi d’amateurs ! ', callback);
        },
        ],
        // optional callback
        cb);
}



function createPlants(cb) {
    async.parallel([
        function(callback) {
            plantCreate('Monstera Deliciosa', 'Plante ornementale de type tropical aux larges feuilles et à la croissance rapide. Facile à cultiver, solide. Ne nécessite pas le plein soleil mais une exposition lumineuse. Idéale pour les grandes pièces.', categories[0], 59.99, 14, callback);
        },
        function(callback) {
            plantCreate("Dracaena", "Plante d'intérieur tropicale. Remarquable par ses tiges élancées et ses feuilles vert foncé aux bords légèrement ondulés. Plante facile d'entretien à condition de la placer à la lumière vive.", categories[0], 89.99, 8, callback);
        },
        function(callback) {
            plantCreate("Pothos", "Liane vigoureuse, grimpante avec des crampons, très proche des philodendrons, et désormais classée dans le genre Epipremnum.", categories[0], 65.99, 12, callback);
          },
          function(callback) {
            plantCreate("Anthurium", "Plante majestueuse. Exotisme. Longues feuilles. Grande taille.", categories[1], 29.99, 3, callback);
          },
          function(callback) {
            plantCreate("Oiseau de Paradis Strelitzia ", "Plante majestueuse. Exotisme. Longues feuilles. Grande taille.", categories[1], 45.99, 6, callback);
          },
          function(callback) {
            plantCreate("Spathiphyllum", "Vivace rhizomateuse persistante, bien touffue.", categories[1], 7.99, 18, callback);
          },
          function(callback) {
            plantCreate("Sanseveria cylindrica", "Sansevieria (ou langue de belle-mère) est une vivace rhizomateuse aux feuilles succulentes faisant partie de la famille des Asparagacées. Ses feuilles sont lancéolées, pointues, plates ou cylindriques, plus ou moins verticales, elles forment une rosette serrée.", categories[2], 64.99, 10, callback);
          },
          function(callback) {
            plantCreate("Euphorbia Erythrea ", "Cactus élancé. Originale. Facile à entretenir.", categories[2], 23.99, 5, callback);
          },
          function(callback) {
            plantCreate("Langue de belle-mère ", "Plante succulente, au port érigé Feuilles planes, dressées, vert sombre, avec des bandes transversales, gris verdâtre.", categories[2], 26.49, 9, callback);
          },
          function(callback) {
            plantCreate("Bonsaï olivier", "Cultive de vraies olives comestibles., belles feuilles épaisses et coriaces qui poussent par paires opposées., arbre résistant à l'hiver et à feuillage persistant.", categories[3], 34.99, 9, callback);
          },
          function(callback) {
            plantCreate("Ficus ginseng  ", "Arbre bonsaï très décoratif.Tronc enflé à la base. Racines aériennes caractéristiques.Feuilles épaisses, ovales, luisantes, de couleur vert moyen. Facile à cultiver.", categories[3], 58.99, 3, callback);
          },
          function(callback) {
            plantCreate("Bonsaï Ligustrum", "Arbuste cultivé en bonsaï Bonsaï d'intérieur, pouvant être sorti à la saison chaude Décoratif par son feuillage, sa floraison, ses fruits.", categories[3], 30.99, 1, callback);
          },
        ],
        // optional callback
        cb);
}



async.series([
    createCategories,
    createPlants,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Plants: '+plants);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});




