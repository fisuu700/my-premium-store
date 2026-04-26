const express = require('express');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');
const { publishToFacebook } = require('../services/facebookService');

const router = express.Router();

/**
 * GET /api/products
 * Récupérer tous les produits (publique)
 */
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().select('-__v');
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des produits',
      error: error.message
    });
  }
});

/**
 * GET /api/products/:id
 * Récupérer un produit spécifique (publique)
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select('-__v');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du produit',
      error: error.message
    });
  }
});

/**
 * POST /api/products
 * Créer un nouveau produit (Admin seulement - protégé par JWT)
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { nom, description, prix, imageURL, stock, categorie } = req.body;

    // Validation des champs requis
    if (!nom || !description || prix === undefined || !imageURL) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs requis doivent être fournis (nom, description, prix, imageURL)'
      });
    }

    // Créer le nouveau produit
    const newProduct = new Product({
      nom,
      description,
      prix,
      imageURL,
      stock: stock || 0,
      categorie: categorie || 'Général'
    });

    // Sauvegarder dans la base de données
    const savedProduct = await newProduct.save();

    // Publier sur Facebook
    const facebookResult = await publishToFacebook(savedProduct);

    res.status(201).json({
      success: true,
      message: 'Produit créé avec succès',
      data: savedProduct,
      facebook: facebookResult
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du produit',
      error: error.message
    });
  }
});

/**
 * PUT /api/products/:id
 * Modifier un produit (Admin seulement - protégé par JWT)
 */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { nom, description, prix, imageURL, stock, categorie } = req.body;

    // Trouver et mettre à jour le produit
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          ...(nom && { nom }),
          ...(description && { description }),
          ...(prix !== undefined && { prix }),
          ...(imageURL && { imageURL }),
          ...(stock !== undefined && { stock }),
          ...(categorie && { categorie })
        }
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Produit modifié avec succès',
      data: updatedProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la modification du produit',
      error: error.message
    });
  }
});

/**
 * DELETE /api/products/:id
 * Supprimer un produit (Admin seulement - protégé par JWT)
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Produit supprimé avec succès',
      data: deletedProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du produit',
      error: error.message
    });
  }
});

module.exports = router;
