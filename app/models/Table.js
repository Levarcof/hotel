import mongoose from "mongoose";

const tableSchema = new mongoose.Schema(
  {
    tableNumber: {
      type: Number,
      required: true,
      unique: true
    },
    seatCount: {
      type: Number,
      required: true
    },
    positionX: {
       type: Number,
       required: true,
       default: 1
    },
    positionY: {
       type: Number,
       required: true,
       default: 1
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Table || mongoose.model("Table", tableSchema);
