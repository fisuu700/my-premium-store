/**
 * Fonctions de validation pour les opérations de sécurité
 */

/**
 * Valide le mot de passe actuel et le nouveau mot de passe
 * @param {string} currentPassword - Mot de passe actuel
 * @param {string} newPassword - Nouveau mot de passe
 * @returns {Object} Résultat de la validation
 */
const validatePasswordChange = (currentPassword, newPassword) => {
  const errors = [];

  if (!currentPassword || currentPassword.trim() === '') {
    errors.push('Le mot de passe actuel est requis');
  }

  if (!newPassword || newPassword.trim() === '') {
    errors.push('Le nouveau mot de passe est requis');
  } else {
    if (newPassword.length < 6) {
      errors.push('Le nouveau mot de passe doit contenir au moins 6 caractères');
    }

    // Vérifier que le nouveau mot de passe est différent de l'ancien
    if (currentPassword === newPassword) {
      errors.push('Le nouveau mot de passe doit être différent de l\'ancien');
    }

    // Vérifier la complexité (optionnel mais recommandé)
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
      errors.push('Le nouveau mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Valide le changement de nom d'utilisateur
 * @param {string} newUsername - Nouveau nom d'utilisateur
 * @returns {Object} Résultat de la validation
 */
const validateUsernameChange = (newUsername) => {
  const errors = [];

  if (!newUsername || newUsername.trim() === '') {
    errors.push('Le nouveau nom d\'utilisateur est requis');
  } else {
    if (newUsername.length < 3) {
      errors.push('Le nom d\'utilisateur doit contenir au moins 3 caractères');
    }

    if (newUsername.length > 30) {
      errors.push('Le nom d\'utilisateur ne peut pas dépasser 30 caractères');
    }

    // Vérifier le format (lettres, chiffres, underscores, tirets)
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(newUsername)) {
      errors.push('Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, underscores et tirets');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Valide le changement d'email
 * @param {string} newEmail - Nouvel email
 * @returns {Object} Résultat de la validation
 */
const validateEmailChange = (newEmail) => {
  const errors = [];

  if (!newEmail || newEmail.trim() === '') {
    errors.push('Le nouvel email est requis');
  } else {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(newEmail)) {
      errors.push('Veuillez entrer un email valide');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Valide les informations de sécurité générales
 * @param {Object} data - Données à valider
 * @returns {Object} Résultat de la validation
 */
const validateSecurityData = (data) => {
  const errors = [];

  // Valider le mot de passe actuel (toujours requis pour les changements)
  if (!data.currentPassword || data.currentPassword.trim() === '') {
    errors.push('Le mot de passe actuel est requis pour toute modification');
  }

  // Validation spécifique selon le type de modification
  if (data.type === 'password') {
    const passwordValidation = validatePasswordChange(data.currentPassword, data.newPassword);
    if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.errors);
    }
  } else if (data.type === 'username') {
    const usernameValidation = validateUsernameChange(data.newUsername);
    if (!usernameValidation.isValid) {
      errors.push(...usernameValidation.errors);
    }
  } else if (data.type === 'email') {
    const emailValidation = validateEmailChange(data.newEmail);
    if (!emailValidation.isValid) {
      errors.push(...emailValidation.errors);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validatePasswordChange,
  validateUsernameChange,
  validateEmailChange,
  validateSecurityData
};