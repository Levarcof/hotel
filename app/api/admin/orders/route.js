import connectDB from "@/app/lib/db";
import Order from "@/app/models/Order";
import User from "@/app/models/User"; // Ensure registered
import Product from "@/app/models/Product"; // Ensure registered
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;

    if (!token) {
       return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id || decoded.role !== "admin") {
       return NextResponse.json({ success: false, message: "Forbidden: Admin access required" }, { status: 403 });
    }

    // Fetch all orders and populate user information
    const orders = await Order.find()
      .populate({
        path: 'userId',
        select: 'name email profileImage phone',
        model: User
      })
      .sort({ createdAt: -1 })
      .lean(); // Faster for read-only

    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (error) {
    console.error("Admin Fetch Orders Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
