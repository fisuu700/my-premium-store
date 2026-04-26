/**
 * Service d'envoi d'emails
 * À intégrer avec Nodemailer, SendGrid ou autre service d'email
 */

const logger = require('../config/logger');

/**
 * Configuration email simulée
 * À remplacer par une vraie configuration (Nodemailer, SendGrid, etc.)
 */
class EmailService {
  constructor() {
    this.isConfigured = false;
    this.setupEmail();
  }

  setupEmail() {
    // À implémenter avec votre service d'email préféré
    // Exemple avec Nodemailer:
    // const nodemailer = require('nodemailer');
    // this.transporter = nodemailer.createTransport({...})
    logger.info('Service email initialisé en mode simulation');
  }

  /**
   * Envoyer un email de confirmation de produit créé
   */
  async sendProductCreatedEmail(adminEmail, product) {
    try {
      const emailContent = {
        to: adminEmail,
        subject: `Produit créé: ${product.nom}`,
        html: `
          <h2>Nouveau produit créé avec succès</h2>
          <p><strong>Nom:</strong> ${product.nom}</p>
          <p><strong>Prix:</strong> €${product.prix}</p>
          <p><strong>Stock:</strong> ${product.stock}</p>
          <p><strong>Catégorie:</strong> ${product.categorie}</p>
          <p><small>Date: ${new Date().toLocaleString('fr-FR')}</small></p>
        `
      };

      logger.info(`[Email] Produit créé: ${product.nom}`, { to: adminEmail });
      
      // Simulé - remplacer par l'envoi réel
      return {
        success: true,
        message: 'Email simulé (à configurer)',
        timestamp: new Date()
      };
    } catch (error) {
      logger.error('[Email] Erreur lors de l\'envoi', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Envoyer un email de confirmation de stock bas
   */
  async sendLowStockAlert(adminEmail, product) {
    try {
      const emailContent = {
        to: adminEmail,
        subject: `⚠️ Stock faible: ${product.nom}`,
        html: `
          <h2>Alerte stock faible</h2>
          <p><strong>Produit:</strong> ${product.nom}</p>
          <p><strong>Stock actuel:</strong> ${product.stock}</p>
          <p><strong>Seuil minimum recommandé:</strong> 10</p>
          <p>Veuillez réapprovisionner ce produit.</p>
        `
      };

      logger.warn(`[Email] Alerte stock: ${product.nom}`, { stock: product.stock });
      
      // Simulé - remplacer par l'envoi réel
      return {
        success: true,
        message: 'Alerte email simulée (à configurer)',
        timestamp: new Date()
      };
    } catch (error) {
      logger.error('[Email] Erreur lors de l\'envoi d\'alerte', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Envoyer un email de confirmation de connexion
   */
  async sendLoginConfirmation(adminEmail, username) {
    try {
      const emailContent = {
        to: adminEmail,
        subject: 'Confirmation de connexion',
        html: `
          <h2>Connexion à votre compte admin</h2>
          <p>Bonjour ${username},</p>
          <p>Votre connexion au tableau de bord a été enregistrée.</p>
          <p><small>Si ce n'était pas vous, veuillez sécuriser votre compte immédiatement.</small></p>
        `
      };

      logger.info(`[Email] Connexion confirmée: ${username}`);
      
      // Simulé - remplacer par l'envoi réel
      return {
        success: true,
        message: 'Confirmation email simulée (à configurer)'
      };
    } catch (error) {
      logger.error('[Email] Erreur lors de l\'envoi de confirmation', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  }
}

module.exports = new EmailService();
