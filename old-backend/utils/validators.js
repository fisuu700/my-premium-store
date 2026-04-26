/**
 * Fonctions de validation des données
 */

/**
 * Valider un email
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valider un produit
 */
const validateProduct = (product) => {
  const errors = [];

  if (!product.nom || product.nom.trim().length === 0) {
    errors.push('Le nom du produit est requis');
  }

  if (!product.description || product.description.trim().length === 0) {
    errors.push('La description est requise');
  }

  if (product.prix === undefined || product.prix === null) {
    errors.push('Le prix est requis');
  } else if (isNaN(product.prix) || product.prix < 0) {
    errors.push('Le prix doit être un nombre positif');
  }

  if (!product.imageURL || product.imageURL.trim().length === 0) {
    errors.push('L\'URL de l\'image est requise');
  } else if (!isValidURL(product.imageURL)) {
    errors.push('L\'URL de l\'image est invalide');
  }

  if (product.stock !== undefined && (isNaN(product.stock) || product.stock < 0)) {
    errors.push('Le stock doit être un nombre positif');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Valider une URL
 */
const isValidURL = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

/**
 * Nettoyer un objet des champs vides
 */
const cleanObject = (obj) => {
  const cleaned = {};
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
      cleaned[key] = obj[key];
    }
  });
  return cleaned;
};

/**
 * Valider les identifiants admin
 */
const validateAdminCredentials = (username, email, password) => {
  const errors = [];

  if (!username || username.trim().length < 3) {
    errors.push('Le nom d\'utilisateur doit contenir au moins 3 caractères');
  }

  if (!email || !validateEmail(email)) {
    errors.push('Veuillez entrer un email valide');
  }

  if (!password || password.trim().length < 6) {
    errors.push('Le mot de passe doit contenir au moins 6 caractères');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateEmail,
  validateProduct,
  isValidURL,
  cleanObject,
  validateAdminCredentials
};
