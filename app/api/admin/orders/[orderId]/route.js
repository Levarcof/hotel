import connectDB from "@/app/lib/db";
import Order from "@/app/models/Order";
import User from "@/app/models/User";
import Product from "@/app/models/Product";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { orderId } = await params;
    await connectDB();
    
    const token = req.cookies.get("token")?.value;
    if (!token) {
       return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id || decoded.role !== "admin") {
       return NextResponse.json({ success: false, message: "Forbidden: Admin access required" }, { status: 403 });
    }

    const order = await Order.findById(orderId)
      .populate({
        path: 'userId',
        select: 'name email profileImage phone maxLoginAge role', 
        model: User
      })
      .populate({
        path: 'products.productId',
        select: 'name price images description category',
        model: Product
      });

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error) {
    console.error("Fetch Admin Order Detail API Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const { orderId } = await params;
    await connectDB();
    
    const token = req.cookies.get("token")?.value;
    if (!token) {
       return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id || decoded.role !== "admin") {
       return NextResponse.json({ success: false, message: "Forbidden: Admin access required" }, { status: 403 });
    }
    
    const body = await req.json();
    const { status } = body;

    const validStatuses = ["Pending", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
       return NextResponse.json({ success: false, message: "Invalid status" }, { status: 400 });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    const previousStatus = order.status;
    order.status = status;
    await order.save();
    
    // Restore stock if transitioning to Cancelled
    if (status === "Cancelled" && previousStatus !== "Cancelled") {
       for (const item of order.products) {
          if (item.productId) {
             const pId = item.productId._id || item.productId;
             await Product.findByIdAndUpdate(pId, { $inc: { stock: item.quantity } });
          }
       }
    }
    
    // Return updated populated order
    await order.populate([
      { path: 'userId', select: 'name email profileImage phone' },
      { path: 'products.productId', select: 'name price images description category' }
    ]);
    
    return NextResponse.json({ success: true, message: `Status heavily updated to ${status}`, order }, { status: 200 });
  } catch (error) {
    console.error("Modify Admin Order API Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
