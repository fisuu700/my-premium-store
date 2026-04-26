const axios = require('axios');

/**
 * Fonction placeholder pour publier un produit sur Facebook
 * Cette fonction simule l'appel à l'API Facebook Graph
 * À implémenter avec les paramètres réels de votre page Facebook
 */
const publishToFacebook = async (product) => {
  try {
    const facebookPageId = process.env.FACEBOOK_PAGE_ID;
    const facebookToken = process.env.FACEBOOK_TOKEN;

    if (!facebookPageId || !facebookToken) {
      console.log('[Facebook API] Identifiants Facebook manquants. Fonction en mode simulation.');
      console.log('[Facebook API] Produit qui aurait été publié:', {
        nom: product.nom,
        description: product.description,
        prix: product.prix,
        imageURL: product.imageURL
      });
      return {
        success: true,
        message: 'Publication simulée sur Facebook',
        productId: product._id
      };
    }

    // URL de l'API Facebook Graph pour publier un message
    const facebookApiUrl = `https://graph.facebook.com/v18.0/${facebookPageId}/feed`;

    // Préparer le message à publier
    const postMessage = `
🛍️ Nouveau produit disponible!

📝 ${product.nom}
💬 ${product.description}
💰 Prix: €${product.prix}

🔗 Image: ${product.imageURL}

Visitez notre boutique pour plus d'informations!
    `.trim();

    // Effectuer l'appel API Facebook
    const response = await axios.post(facebookApiUrl, {
      message: postMessage,
      link: product.imageURL,
      access_token: facebookToken
    });

    console.log(`[Facebook API] Publication réussie pour le produit: ${product.nom}`);
    console.log(`[Facebook API] Post ID: ${response.data.id}`);

    return {
      success: true,
      message: 'Produit publié avec succès sur Facebook',
      facebookPostId: response.data.id,
      productId: product._id
    };
  } catch (error) {
    console.error('[Facebook API] Erreur lors de la publication:', error.message);
    
    // Retourner un statut de succès même en cas d'erreur pour ne pas bloquer la création du produit
    return {
      success: false,
      message: 'Erreur lors de la publication sur Facebook',
      error: error.message,
      productId: product._id
    };
  }
};

module.exports = { publishToFacebook };
