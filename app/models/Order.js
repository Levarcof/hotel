import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        price: {
          type: Number,
          required: true
        }
      }
    ],
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["Pending", "Preparing", "Out for Delivery", "Delivered", "Cancelled"],
      default: "Pending"
    },
    address: {
      fullName: String,
      phone: String,
      addressLine: String,
      city: String,
      state: String,
      pincode: String
    },
    location: {
      type: {
        type: String,
        enum: ["current", "manual"],
        required: true
      },
      latitude: Number,
      longitude: Number,
      addressLine: String,
      city: String,
      state: String,
      pincode: String,
      mapLink: String
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "UPI"]
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "not_paid"],
      default: "not_paid"
    },
    razorpayOrderId: String
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
