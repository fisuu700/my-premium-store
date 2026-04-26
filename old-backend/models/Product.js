const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, 'Le nom du produit est requis'],
      trim: true,
      maxlength: [100, 'Le nom ne doit pas dépasser 100 caractères']
    },
    description: {
      type: String,
      required: [true, 'La description est requise'],
      trim: true,
      maxlength: [1000, 'La description ne doit pas dépasser 1000 caractères']
    },
    prix: {
      type: Number,
      required: [true, 'Le prix est requis'],
      min: [0, 'Le prix ne peut pas être négatif'],
      set: v => parseFloat(v.toFixed(2))
    },
    imageURL: {
      type: String,
      required: [true, 'L\'URL de l\'image est requise'],
      trim: true
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Le stock ne peut pas être négatif']
    },
    categorie: {
      type: String,
      trim: true,
      default: 'Général'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', productSchema);
