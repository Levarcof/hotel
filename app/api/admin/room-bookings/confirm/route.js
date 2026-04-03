import connectDB from "@/app/lib/db";
import Room from "@/app/models/Room";
import RoomBooking from "@/app/models/RoomBooking";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const { bookingId } = await req.json();

    const booking = await RoomBooking.findById(bookingId);
    if (!booking) return NextResponse.json({ success: false, message: "Booking record lost" }, { status: 404 });

    const room = await Room.findById(booking.roomId);
    if (room) {
       room.isBooked = false;
       await room.save();
    }

    // Per user instructions: Booking document is deleted after checkout
    await RoomBooking.findByIdAndDelete(bookingId);

    return NextResponse.json({
       success: true,
       message: "Cash Payment Verified. Residency Closure Confirmed."
    });

  } catch (error) {
    console.error("Admin Confirm Payment Error:", error);
    return NextResponse.json({ success: false, message: "Verification Failure" }, { status: 500 });
  }
}
