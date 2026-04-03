import connectDB from "@/app/lib/db";
import Room from "@/app/models/Room";
import RoomBooking from "@/app/models/RoomBooking";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();
    
    // Auth Check
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Authentication required for residency security." }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) return NextResponse.json({ success: false, message: "Protocol violation: Unauthorized identity." }, { status: 401 });

    const body = await req.json();
    const { roomId, name, mobile, dueAmount } = body;

    if (!roomId || !name || !mobile || !dueAmount) {
      return NextResponse.json({ success: false, message: "Incomplete registry data." }, { status: 400 });
    }

    // Check availability
    const room = await Room.findById(roomId);
    if (!room) return NextResponse.json({ success: false, message: "Asset not found in archive." }, { status: 404 });
    if (room.isBooked) return NextResponse.json({ success: false, message: "Suite is currently under active lease." }, { status: 400 });

    // Create booking
    const booking = await RoomBooking.create({
      roomId,
      userId: decoded.id,
      name,
      mobile,
      dueAmount: Number(dueAmount),
      status: "booked",
      bookingStartTime: new Date()
    });

    // Mark room as booked
    room.isBooked = true;
    await room.save();

    return NextResponse.json({
      success: true,
      message: "Suite Secured. Residency contract initialized.",
      booking
    });

  } catch (error) {
    console.error("Room Booking Error:", error);
    return NextResponse.json({ success: false, message: "System failure: Booking rejected." }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectDB();
    
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Login required" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const bookings = await RoomBooking.find({ userId: decoded.id })
      .populate("roomId")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, bookings });
  } catch (error) {
     console.error(error);
     return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
