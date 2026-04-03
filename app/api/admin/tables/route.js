import connectDB from "@/app/lib/db";
import Table from "@/app/models/Table";
import Seat from "@/app/models/Seat";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await connectDB();
    const tables = await Table.find({}).sort({ tableNumber: 1 });
    return NextResponse.json({ success: true, tables });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req , context) {
  try {
    await connectDB();
    
    
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") return NextResponse.json({ success: false, message: "Access Denied" }, { status: 403 });

    const { tableNumber, seatCount, positionX, positionY } = await req.json();

    const tNum = Number(tableNumber);
    const sCount = Number(seatCount);
    const pX = Number(positionX);
    const pY = Number(positionY);

    if (sCount <= 0) {
       return NextResponse.json({ success: false, message: "Seat count must be at least 1." }, { status: 400 });
    }

    const existing = await Table.findOne({ tableNumber: tNum });
    if (existing) return NextResponse.json({ success: false, message: "Table number already exists" }, { status: 400 });

    const table = await Table.create({ 
      tableNumber: tNum, 
      seatCount: sCount, 
      positionX: pX, 
      positionY: pY 
    });
    
    // Auto-generate seats around the table
    // Using simple circular distribution: 360 / seatCount
    for (let i = 1; i <= sCount; i++) {
       await Seat.create({ 
         tableId: table._id, 
         seatNumber: i, 
         angle: Math.round((360 / sCount) * (i - 1))
       });
    }

    return NextResponse.json({ success: true, table });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
