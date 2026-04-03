import connectDB from "@/app/lib/db";
import Booking from "@/app/models/Booking";
import Table from "@/app/models/Table";
import Seat from "@/app/models/Seat";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const time = searchParams.get("time");

    if (!date || !time) {
      return NextResponse.json({ success: false, message: "Date and Time are required" }, { status: 400 });
    }

    // Convert requested time to minutes for comparison
    const [reqHours, reqMinutes] = time.split(":").map(Number);
    const requestedTimeInMinutes = reqHours * 60 + reqMinutes;

    // Get all tables and seats
    const allTables = await Table.find({}).sort({ tableNumber: 1 }).lean();
    const allSeats = await Seat.find({}).lean();
    
    // Get ALL confirmed bookings for that date (regardless of time, we'll filter below)
    const bookings = await Booking.find({ 
      date, 
      status: "Confirmed" 
    }).lean();

    const result = allTables.map(table => {
      // Filter seats for this table
      const tableSeats = allSeats.filter(s => s.tableId.toString() === table._id.toString());
      
      const seatsWithAvailability = tableSeats.map(seat => {
         // 30 MINUTE PROTECTION RULE
         // If a seat is booked at 7:00 PM, it must be unavailable from 6:30 PM to 7:30 PM.
         const conflict = bookings.some(b => {
            const isSeatMatch = (b.seatId && b.seatId.toString() === seat._id.toString()) || 
                               (b.seatIds && b.seatIds.some(sid => sid.toString() === seat._id.toString()));
            
            if (!isSeatMatch) return false;
            
            const [bHours, bMinutes] = b.time.split(":").map(Number);
            const bookingTimeInMinutes = bHours * 60 + bMinutes;
            
            // Check if requested time falls within [bookingTime - 30, bookingTime + 30]
            const diff = Math.abs(requestedTimeInMinutes - bookingTimeInMinutes);
            return diff <= 30;
         });

         return {
            ...seat,
            isBooked: conflict
         };
      });

      return {
        ...table,
        seats: seatsWithAvailability
      };
    });

    return NextResponse.json({ success: true, tables: result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
