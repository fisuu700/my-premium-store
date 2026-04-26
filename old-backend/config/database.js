const mongoose = require('mongoose');

/**
 * Configuration et gestion de la connexion MongoDB
 */

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MONGODB_URI non défini dans les variables d\'environnement');
    }

    const connection = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority'
    });

    console.log(`✅ MongoDB connecté: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error(`❌ Erreur de connexion MongoDB: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB déconnecté');
  } catch (error) {
    console.error(`❌ Erreur de déconnexion MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = {
  connectDB,
  disconnectDB
};
