/**
 * Middlewares de validation des requêtes
 */

const { validateProduct } = require('../utils/validators');

/**
 * Valider les données de produit dans la requête
 */
const validateProductData = (req, res, next) => {
  const { nom, description, prix, imageURL, stock, categorie } = req.body;

  // Construire l'objet produit à valider
  const productToValidate = {
    nom,
    description,
    prix,
    imageURL,
    stock,
    categorie
  };

  const validation = validateProduct(productToValidate);

  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: 'Validation des données échouée',
      errors: validation.errors
    });
  }

  next();
};

/**
 * Valider l'ID MongoDB dans les paramètres
 */
const validateMongoId = (req, res, next) => {
  const { id } = req.params;

  // Vérifier que c'est un ID MongoDB valide
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      message: 'ID de produit invalide'
    });
  }

  next();
};

/**
 * Valider la pagination
 */
const validatePagination = (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  if (isNaN(pageNum) || pageNum < 1) {
    return res.status(400).json({
      success: false,
      message: 'Le numéro de page doit être un entier positif'
    });
  }

  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    return res.status(400).json({
      success: false,
      message: 'La limite doit être entre 1 et 100'
    });
  }

  req.pagination = { page: pageNum, limit: limitNum };
  next();
};

/**
 * Valider le contenu JSON
 */
const validateJSON = (req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    if (!req.is('application/json')) {
      return res.status(400).json({
        success: false,
        message: 'Content-Type doit être application/json'
      });
    }
  }
  next();
};

module.exports = {
  validateProductData,
  validateMongoId,
  validatePagination,
  validateJSON
};
