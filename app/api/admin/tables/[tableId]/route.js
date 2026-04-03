import connectDB from "@/app/lib/db";
import Table from "@/app/models/Table";
import Seat from "@/app/models/Seat";
import Booking from "@/app/models/Booking";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { tableId } = await params;

    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") return NextResponse.json({ success: false, message: "Access Denied" }, { status: 403 });

    const { tableNumber, seatCount, positionX, positionY } = await req.json();

    const updateData = {
      tableNumber: Number(tableNumber),
      seatCount: Number(seatCount),
      positionX: Number(positionX),
      positionY: Number(positionY)
    };

    const oldTable = await Table.findById(tableId);
    if (!oldTable) return NextResponse.json({ success: false, message: "Table not found" }, { status: 404 });

    const table = await Table.findByIdAndUpdate(tableId, updateData, { new: true });

    // If seatCount changed, regenerate seats
    if (oldTable.seatCount !== updateData.seatCount) {
       // Delete existing seats
       await Seat.deleteMany({ tableId });
       // Generate new seats
       for (let i = 1; i <= updateData.seatCount; i++) {
          await Seat.create({ 
            tableId: table._id, 
            seatNumber: i, 
            angle: Math.round((360 / updateData.seatCount) * (i - 1))
          });
       }
    }

    return NextResponse.json({ success: true, table });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { tableId } = await params;

    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") return NextResponse.json({ success: false, message: "Access Denied" }, { status: 403 });

    // Delete table, seats, and bookings
    await Table.findByIdAndDelete(tableId);
    await Seat.deleteMany({ tableId });
    await Booking.deleteMany({ tableId });

    return NextResponse.json({ success: true, message: "Table and associated data deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
