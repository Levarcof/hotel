import connectDB from "@/app/lib/db";
import Room from "@/app/models/Room";
import RoomBooking from "@/app/models/RoomBooking";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { bookingId, paymentId, orderId, signature } = body;

    const secret = process.env.RAZORPAY_KEY_SECRET;
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(orderId + "|" + paymentId)
      .digest("hex");

    if (generated_signature !== signature) {
      return NextResponse.json({ success: false, message: "Fraudulent signature detected." }, { status: 400 });
    }

    const booking = await RoomBooking.findById(bookingId);
    if (!booking) return NextResponse.json({ success: false, message: "Booking record lost." }, { status: 404 });

    const room = await Room.findById(booking.roomId);
    if (room) {
       room.isBooked = false;
       await room.save();
    }

    // Per user instructions: Booking document is deleted after successful payment
    await RoomBooking.findByIdAndDelete(bookingId);

    return NextResponse.json({
       success: true,
       message: "Residency Closed. Luxury asset restored to inventory."
    });

  } catch (error) {
    console.error("Verify Room Payment Error:", error);
    return NextResponse.json({ success: false, message: "Internal Verification Error" }, { status: 500 });
  }
}
