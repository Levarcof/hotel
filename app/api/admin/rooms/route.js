import connectDB from "@/app/lib/db";
import Room from "@/app/models/Room";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { roomNumber, floorNumber, price, bedType, images } = body;

    if (!roomNumber || !floorNumber || !price || !bedType || !images || images.length === 0) {
      return NextResponse.json(
        { message: "All fields are required, including at least one image." },
        { status: 400 }
      );
    }

    if (images.length > 3) {
      return NextResponse.json(
        { message: "Maximum 3 images allowed." },
        { status: 400 }
      );
    }

    // Check if room already exists
    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return NextResponse.json(
        { message: "Room number already exists." },
        { status: 400 }
      );
    }

    const room = await Room.create({
      roomNumber,
      floorNumber,
      price: Number(price),
      bedType,
      images,
    });

    return NextResponse.json({
      success: true,
      message: "Room created successfully",
      room,
    });
  } catch (error) {
    console.error("Create Room Error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const rooms = await Room.find({}).sort({ floorNumber: 1, roomNumber: 1 });

    return NextResponse.json({
      success: true,
      rooms,
    });
  } catch (error) {
    console.error("Get Rooms Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
