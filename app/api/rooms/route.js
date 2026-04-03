import connectDB from "@/app/lib/db";
import Room from "@/app/models/Room";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();
    
    // Get distinct floors for the filter
    const floors = await Room.distinct("floorNumber");
    
    // Get all rooms
    const rooms = await Room.find({}).sort({ floorNumber: 1, roomNumber: 1 });

    return NextResponse.json({
      success: true,
      rooms,
      floors: floors.sort()
    });
  } catch (error) {
    console.error("Public Fetch Rooms Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
