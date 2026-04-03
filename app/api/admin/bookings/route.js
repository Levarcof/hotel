import connectDB from "@/app/lib/db";
import Booking from "@/app/models/Booking";
import User from "@/app/models/User";
import Table from "@/app/models/Table";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await connectDB();
    
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") return NextResponse.json({ success: false, message: "Access Denied" }, { status: 403 });

    const bookings = await Booking.find({}).populate("userId", "name email profileImage").sort({ createdAt: -1 });

    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
