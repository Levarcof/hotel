import connectDB from "@/app/lib/db";
import RoomBooking from "@/app/models/RoomBooking";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    
    const booking = await RoomBooking.findById(id)
      .populate("roomId")
      .populate("userId");
    
    if (!booking) {
      return NextResponse.json(
        { message: "Residency record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      booking
    });
  } catch (error) {
    console.error("Fetch Admin Booking Detail Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
