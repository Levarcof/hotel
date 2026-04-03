import connectDB from "@/app/lib/db";
import Table from "@/app/models/Table";
import Seat from "@/app/models/Seat";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();
    
    // Fetch all tables
    const tables = await Table.find({}).sort({ tableNumber: 1 }).lean();
    
    // Fetch seats for each table
    const tablesWithSeats = await Promise.all(tables.map(async (table) => {
       const seats = await Seat.find({ tableId: table._id }).sort({ seatNumber: 1 }).lean();
       return { ...table, seats };
    }));

    return NextResponse.json({ success: true, tables: tablesWithSeats });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
