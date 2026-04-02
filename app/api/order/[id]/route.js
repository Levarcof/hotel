import connectDB from "@/app/lib/db";
import Order from "@/app/models/Order";
import Product from "@/app/models/Product"; // Ensure product schema is registered
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const token = req.cookies.get("token")?.value;

    if (!token) {
       return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
       return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    const order = await Order.findOne({ _id: id, userId: decoded.id })
                             .populate("products.productId");

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error) {
    console.error("Fetch Order Detail API Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const token = req.cookies.get("token")?.value;

    if (!token) {
       return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
       return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }
    
    const body = await req.json();
    const { action, productId } = body;

    const order = await Order.findOne({ _id: id, userId: decoded.id }).populate('products.productId');

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    // Ensure order can only be modified if it is still Pending
    if (order.status !== "Pending") {
       return NextResponse.json({ success: false, message: "Only pending orders can be modified" }, { status: 400 });
    }

    if (action === "cancel") {
       order.status = "Cancelled";
       await order.save();

       // Restore stock for all products
       for (const item of order.products) {
          if (item.productId) {
             const pId = item.productId._id || item.productId;
             await Product.findByIdAndUpdate(pId, { $inc: { stock: item.quantity } });
          }
       }

       return NextResponse.json({ success: true, message: "Order cancelled successfully", order }, { status: 200 });
    } 
    
    if (action === "remove_item") {
       if (!productId) {
         return NextResponse.json({ success: false, message: "Product ID is missing" }, { status: 400 });
       }

       const initialLength = order.products.length;
       const removedItems = order.products.filter(p => p.productId?._id?.toString() === productId || p.productId?.toString() === productId);
       order.products = order.products.filter(p => p.productId?._id?.toString() !== productId && p.productId?.toString() !== productId);
       
       if (order.products.length === initialLength) {
          return NextResponse.json({ success: false, message: "Product not found in this order" }, { status: 404 });
       }

       // Restore stock for removed item
       if (removedItems.length > 0) {
          for (const item of removedItems) {
            const pId = item.productId._id || item.productId;
            await Product.findByIdAndUpdate(pId, { $inc: { stock: item.quantity } });
          }
       }

       // Recalculate Total
       let newTotal = 0;
       order.products.forEach(p => {
          newTotal += (p.price * p.quantity);
       });
       order.totalAmount = newTotal;

       // Auto-cancel if empty
       if (order.products.length === 0) {
          order.status = "Cancelled";
       }

       await order.save();
       // Repopulate to return full updated structure
       await order.populate('products.productId');
       
       return NextResponse.json({ success: true, message: "Item removed successfully", order }, { status: 200 });
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
    
  } catch (error) {
    console.error("Modify Order API Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

