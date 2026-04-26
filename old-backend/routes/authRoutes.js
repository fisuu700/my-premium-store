const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const router = express.Router();

/**
 * POST /api/auth/login
 * Générer un token JWT pour l'administrateur
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation des informations d'identification
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nom d\'utilisateur et mot de passe requis'
      });
    }

    // Trouver l'admin par username
    const admin = await Admin.findOne({ username }).select('+password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides'
      });
    }

    // Vérifier si l'admin est actif
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Compte administrateur désactivé'
      });
    }

    // Vérifier le mot de passe avec bcrypt
    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides'
      });
    }

    // Mettre à jour la date de dernière connexion
    admin.lastLogin = new Date();
    await admin.save();

    // Générer le token JWT
    const token = jwt.sign(
      {
        id: admin._id,
        username: admin.username,
        role: admin.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      message: 'Authentification réussie',
      token: token,
      expiresIn: '24h'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'authentification',
      error: error.message
    });
  }
});

module.exports = router;
