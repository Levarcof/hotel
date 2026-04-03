import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      unique: true
    },
    floorNumber: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    bedType: {
      type: String,
      enum: ["Single", "Double", "Triple"],
      required: true
    },
    images: [
      {
        type: String,
        required: true
      }
    ],
    isBooked: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Clear model if already defined in development to avoid compilation errors
if (mongoose.models.Room) {
  delete mongoose.models.Room;
}

export default mongoose.model("Room", roomSchema);
