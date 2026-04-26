const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * POST /api/admin/change-password
 * Changer son mot de passe (protégé)
 */
router.post('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.admin.id;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Le mot de passe actuel et le nouveau mot de passe sont requis'
      });
    }

    // Validation du nouveau mot de passe
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Le nouveau mot de passe doit contenir au moins 6 caractères'
      });
    }

    // Récupérer l'admin avec son mot de passe
    const admin = await Admin.findById(adminId).select('+password');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Administrateur non trouvé'
      });
    }

    // Vérifier le mot de passe actuel
    const isCurrentPasswordValid = await admin.comparePassword(currentPassword);

    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Le mot de passe actuel est incorrect'
      });
    }

    // Mettre à jour le mot de passe
    admin.password = newPassword;
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Mot de passe changé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors du changement de mot de passe',
      error: error.message
    });
  }
});

/**
 * PUT /api/admin/change-username
 * Changer son nom d'utilisateur (protégé)
 */
router.put('/change-username', authMiddleware, async (req, res) => {
  try {
    const { newUsername, currentPassword } = req.body;
    const adminId = req.admin.id;

    // Validation
    if (!newUsername || !currentPassword) {
      return res.status(400).json({
        success: false,
        message: 'Le nouveau nom d\'utilisateur et le mot de passe actuel sont requis'
      });
    }

    // Validation du nouveau nom d'utilisateur
    if (newUsername.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Le nouveau nom d\'utilisateur doit contenir au moins 3 caractères'
      });
    }

    // Vérifier si le nom d'utilisateur est déjà pris
    const existingAdmin = await Admin.findOne({ username: newUsername });

    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: 'Ce nom d\'utilisateur est déjà utilisé'
      });
    }

    // Récupérer l'admin avec son mot de passe
    const admin = await Admin.findById(adminId).select('+password');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Administrateur non trouvé'
      });
    }

    // Vérifier le mot de passe actuel pour la sécurité
    const isCurrentPasswordValid = await admin.comparePassword(currentPassword);

    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Le mot de passe actuel est incorrect'
      });
    }

    // Mettre à jour le nom d'utilisateur
    admin.username = newUsername;
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Nom d\'utilisateur changé avec succès',
      data: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors du changement de nom d\'utilisateur',
      error: error.message
    });
  }
});

/**
 * PUT /api/admin/change-email
 * Changer son email (protégé)
 */
router.put('/change-email', authMiddleware, async (req, res) => {
  try {
    const { newEmail, currentPassword } = req.body;
    const adminId = req.admin.id;

    // Validation
    if (!newEmail || !currentPassword) {
      return res.status(400).json({
        success: false,
        message: 'Le nouvel email et le mot de passe actuel sont requis'
      });
    }

    // Validation du format de l'email
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(newEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez entrer un email valide'
      });
    }

    // Vérifier si l'email est déjà utilisé
    const existingAdmin = await Admin.findOne({ email: newEmail });

    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: 'Cet email est déjà utilisé'
      });
    }

    // Récupérer l'admin avec son mot de passe
    const admin = await Admin.findById(adminId).select('+password');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Administrateur non trouvé'
      });
    }

    // Vérifier le mot de passe actuel pour la sécurité
    const isCurrentPasswordValid = await admin.comparePassword(currentPassword);

    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Le mot de passe actuel est incorrect'
      });
    }

    // Mettre à jour l'email
    admin.email = newEmail;
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Email changé avec succès',
      data: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors du changement d\'email',
      error: error.message
    });
  }
});

module.exports = router;
