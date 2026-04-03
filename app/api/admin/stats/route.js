import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import Order from "@/app/models/Order";
import Product from "@/app/models/Product";
import Booking from "@/app/models/Booking";
import Table from "@/app/models/Table";
import User from "@/app/models/User";
import Room from "@/app/models/Room";
import RoomBooking from "@/app/models/RoomBooking";

export async function GET() {
  try {
    await connectDB();

    // Fetch counts in parallel
    const [
      ordersCount, 
      productsCount, 
      bookingsCount, 
      tablesCount, 
      usersCount,
      roomsCount,
      roomBookingsCount
    ] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      Booking.countDocuments(),
      Table.countDocuments(),
      User.countDocuments(),
      Room.countDocuments(),
      RoomBooking.countDocuments()
    ]);

    // Calculate total revenue from 'paid' status orders
    const paidOrders = await Order.find({ paymentStatus: "paid" }).select("totalAmount");
    const totalRevenue = paidOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    return NextResponse.json({
      success: true,
      stats: {
        orders: ordersCount,
        products: productsCount,
        bookings: bookingsCount,
        tables: tablesCount,
        users: usersCount,
        rooms: roomsCount,
        roomBookings: roomBookingsCount,
        revenue: totalRevenue
      }
    });
  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
