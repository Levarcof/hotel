import connectDB from "@/app/lib/db";
import RoomBooking from "@/app/models/RoomBooking";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    
    // Fetch all bookings with Room and User details
    const bookings = await RoomBooking.find({})
      .populate("roomId")
      .populate("userId")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error("Admin Fetch Bookings Error:", error);
    return NextResponse.json(
       { message: "Internal Server Error" },
       { status: 500 }
    );
  }
}
