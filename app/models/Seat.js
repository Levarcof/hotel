import mongoose from "mongoose";

const seatSchema = new mongoose.Schema(
  {
    tableId: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "Table",
       required: true
    },
    seatNumber: {
       type: Number,
       required: true
    },
    angle: {
       type: Number, // Degrees for circular positioning
       default: 0
    }
  },
  {
    timestamps: true
  }
);

// Ensure seat numbers are unique WITHIN a table
seatSchema.index({ tableId: 1, seatNumber: 1 }, { unique: true });

export default mongoose.models.Seat || mongoose.model("Seat", seatSchema);
