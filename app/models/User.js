import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: "", // Defaults to empty string or a default avatar URL
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);