import connectDB from "@/app/lib/db";
import RoomBooking from "@/app/models/RoomBooking";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    // Auth Check
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { method, amount } = body;

    const booking = await RoomBooking.findById(id);
    if (!booking) return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
    if (booking.userId.toString() !== decoded.id) return NextResponse.json({ success: false, message: "Unauthorized access to contract" }, { status: 403 });

    // Handle Settlement
    booking.paymentMethod = method;
    booking.dueAmount = Number(amount);
    
    if (method === "Cash") {
       booking.status = "pending_checkout";
    }
    
    await booking.save();

    return NextResponse.json({
      success: true,
      message: method === "Cash" ? "Cash settlement initiated" : "Payment prepared",
      booking
    });

  } catch (error) {
    console.error("Checkout Patch Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
