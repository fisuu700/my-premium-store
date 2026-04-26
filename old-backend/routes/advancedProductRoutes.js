/**
 * Routes avancées pour les produits avec recherche et filtrage
 * À intégrer progressivement selon vos besoins
 */

const express = require('express');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * GET /api/products/search?q=laptop&categorie=Électronique&minPrice=100&maxPrice=1500&sort=prix
 * Recherche avancée avec filtres
 */
router.get('/search', async (req, res) => {
  try {
    const { q, categorie, minPrice, maxPrice, sort, page = 1, limit = 10 } = req.query;
    
    // Construire le filtre dynamique
    const filter = {};
    
    // Recherche textuelle
    if (q) {
      filter.$or = [
        { nom: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }
    
    // Filtrer par catégorie
    if (categorie) {
      filter.categorie = categorie;
    }
    
    // Filtrer par prix
    if (minPrice || maxPrice) {
      filter.prix = {};
      if (minPrice) filter.prix.$gte = parseFloat(minPrice);
      if (maxPrice) filter.prix.$lte = parseFloat(maxPrice);
    }
    
    // Filtrer par stock
    filter.stock = { $gt: 0 };
    
    // Déterminer le tri
    const sortOptions = {};
    if (sort) {
      const sortField = sort.startsWith('-') ? sort.slice(1) : sort;
      const sortOrder = sort.startsWith('-') ? -1 : 1;
      sortOptions[sortField] = sortOrder;
    } else {
      sortOptions.createdAt = -1; // Défaut: plus récent d'abord
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Exécuter la requête
    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');
    
    // Comptage total
    const total = await Product.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la recherche',
      error: error.message
    });
  }
});

/**
 * GET /api/products/stats
 * Obtenir des statistiques sur les produits
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: '$categorie',
          count: { $sum: 1 },
          avgPrice: { $avg: '$prix' },
          minPrice: { $min: '$prix' },
          maxPrice: { $max: '$prix' },
          totalStock: { $sum: '$stock' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const totalProducts = await Product.countDocuments();
    const totalValue = await Product.aggregate([
      { $group: { _id: null, total: { $sum: { $multiply: ['$prix', '$stock'] } } } }
    ]);

    res.status(200).json({
      success: true,
      summary: {
        totalProducts,
        categoriesCount: stats.length,
        inventoryValue: totalValue[0]?.total || 0
      },
      byCategory: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors du calcul des statistiques',
      error: error.message
    });
  }
});

/**
 * GET /api/products/categories
 * Obtenir la liste de toutes les catégories
 */
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('categorie');
    
    res.status(200).json({
      success: true,
      data: categories.sort()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des catégories',
      error: error.message
    });
  }
});

/**
 * POST /api/products/bulk
 * Créer plusieurs produits en une seule requête (Admin)
 */
router.post('/bulk', authMiddleware, async (req, res) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Un tableau de produits est requis'
      });
    }

    const createdProducts = await Product.insertMany(products);

    res.status(201).json({
      success: true,
      message: `${createdProducts.length} produits créés avec succès`,
      data: createdProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création en masse',
      error: error.message
    });
  }
});

/**
 * PUT /api/products/:id/stock
 * Mettre à jour uniquement le stock
 */
router.put('/:id/stock', authMiddleware, async (req, res) => {
  try {
    const { stock } = req.body;

    if (stock === undefined || isNaN(stock) || stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Stock invalide'
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Stock mis à jour',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du stock',
      error: error.message
    });
  }
});

module.exports = router;
