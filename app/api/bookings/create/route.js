import connectDB from "@/app/lib/db";
import Booking from "@/app/models/Booking";
import Table from "@/app/models/Table";
import Seat from "@/app/models/Seat";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();
    
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Login required" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { 
      name, 
      mobileNumber, 
      seatIds, 
      date, 
      time, 
      paymentMethod, 
      paymentStatus, 
      razorpayPaymentId 
    } = await req.json();

    if (!name || !mobileNumber || !seatIds || !Array.isArray(seatIds) || seatIds.length === 0 || !date || !time || !paymentMethod) {
      return NextResponse.json({ success: false, message: "Missing required booking details" }, { status: 400 });
    }

    // Protection check (same logic as availability API)
    const [reqHours, reqMinutes] = time.split(":").map(Number);
    const requestedTimeInMinutes = reqHours * 60 + reqMinutes;

    // Check availability for all requested seats
    for (const seatId of seatIds) {
       // Query supports both old singular seatId and new array seatIds
       const conflicts = await Booking.find({ 
         $or: [
           { seatId, date, status: "Confirmed" },
           { seatIds: { $in: [seatId] }, date, status: "Confirmed" }
         ]
       });

       const hasConflict = conflicts.some(b => {
          const [bHours, bMinutes] = b.time.split(":").map(Number);
          const bookingTimeInMinutes = bHours * 60 + bMinutes;
          const diff = Math.abs(requestedTimeInMinutes - bookingTimeInMinutes);
          return diff <= 30; // 30 minute protection
       });

       if (hasConflict) {
          return NextResponse.json({ success: false, message: `One or more seats (ID: ${seatId}) became unavailable.` }, { status: 400 });
       }
    }

    // Fetch Seat & Table Details to denormalize for easier reporting
    const seatDocs = await Seat.find({ _id: { $in: seatIds } }).populate("tableId");
    if (seatDocs.length === 0) return NextResponse.json({ success: false, message: "Invalid seats" }, { status: 400 });

    const firstTable = seatDocs[0].tableId;
    const tableNumber = firstTable.tableNumber;
    const tableId = firstTable._id;
    const seatNumbers = seatDocs.map(s => s.seatNumber);

    // Create single booking record
    const booking = await Booking.create({
      userId: decoded.id,
      name,
      mobileNumber,
      tableId,
      tableNumber,
      seatIds,
      seatNumbers,
      date,
      time,
      paymentMethod,
      paymentStatus: paymentStatus || (paymentMethod === "Online" ? "paid" : "pending"),
      razorpayPaymentId,
      status: "Confirmed"
    });

    return NextResponse.json({ success: true, bookingId: booking._id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 });
  }
}
