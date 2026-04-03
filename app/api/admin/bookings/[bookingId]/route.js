import connectDB from "@/app/lib/db";
import Booking from "@/app/models/Booking";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function PATCH(req, { params }) {
  try {
    const { bookingId } = await params;
    await connectDB();
    
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") return NextResponse.json({ success: false, message: "Access Denied" }, { status: 403 });

    const { status } = await req.json();
    const booking = await Booking.findByIdAndUpdate(bookingId, { status }, { new: true });
    
    if (!booking) return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { bookingId } = await params;
    await connectDB();
    
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") return NextResponse.json({ success: false, message: "Access Denied" }, { status: 403 });

    const booking = await Booking.findByIdAndDelete(bookingId);
    if (!booking) return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
