import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    name: {
      type: String,
      required: true
    },
    mobileNumber: {
      type: String,
      required: true
    },
    tableId: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "Table",
       required: true
    },
    tableNumber: {
       type: String,
       required: true
    },
    seatIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seat",
        required: true
      }
    ],
    seatNumbers: [
      {
        type: String,
        required: true
      }
    ],
    date: {
       type: String, // "YYYY-MM-DD"
       required: true
    },
    time: {
       type: String, // "HH:MM"
       required: true
    },
    paymentMethod: {
       type: String,
       enum: ["COD", "Online"],
       required: true
    },
    paymentStatus: {
       type: String,
       enum: ["pending", "paid", "failed"],
       default: "pending"
    },
    razorpayPaymentId: {
       type: String
    },
    status: {
       type: String,
       enum: ["Confirmed", "Cancelled", "Completed"],
       default: "Confirmed"
    }
  },
  {
    timestamps: true
  }
);

// Force model re-creation if already defined to apply schema changes
if (mongoose.models.Booking) {
  delete mongoose.models.Booking;
}

export default mongoose.model("Booking", bookingSchema);
