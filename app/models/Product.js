import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    category: {
      type: String,
      required: true
    },

    stock: {
      type: Number,
      required: true,
      min: 0
    },

    images: {
      type: [String],
      required: true,
      validate: {
        validator: function (arr) {
          return arr.length <= 3;
        },
        message: "Maximum 3 images allowed"
      }
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);