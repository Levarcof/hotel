import connectDB from "@/app/lib/db";
import Order from "@/app/models/Order";
import Product from "@/app/models/Product"; // Ensure product schema is registered
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();
    console.log("Connected to DB");
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    // Fetch orders, sort by newest
    const orders = await Order.find({ userId: decoded.id })
      .populate("products.productId")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (error) {
    console.error("Fetch Orders API Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
