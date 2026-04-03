import mongoose from "mongoose";

const roomBookingSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    name: {
      type: String,
      required: true
    },
    mobile: {
      type: String,
      required: true
    },
    bookingStartTime: {
      type: Date,
      default: Date.now,
      required: true
    },
    dueAmount: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Online"],
      required: false // Optional initially, set at checkout
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending"
    },
    status: {
      type: String,
      enum: ["booked", "pending_checkout", "completed"],
      default: "booked"
    },
    razorpayOrderId: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Clear model if already defined in development to avoid compilation errors
if (mongoose.models.RoomBooking) {
  delete mongoose.models.RoomBooking;
}

export default mongoose.model("RoomBooking", roomBookingSchema);
