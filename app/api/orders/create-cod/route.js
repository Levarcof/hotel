import connectDB from "@/app/lib/db";
import Cart from "@/app/models/Cart";
import Order from "@/app/models/Order";
import Product from "@/app/models/Product"; // Make sure model is loaded
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
       return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    const { items, address, location } = await req.json();
    console.log("DEBUG: Location received in create-cod:", location);

    if (!items || !items.length) {
      return NextResponse.json({ success: false, message: "No items provided for the order" }, { status: 400 });
    }

    let totalAmount = 0;
    const productsForOrder = [];
    const cartIdsToDelete = [];

    // First check stock for all items
    for (const item of items) {
      if (!item.productId || !item.quantity || !item.price) {
         return NextResponse.json({ success: false, message: "Missing fields in item data" }, { status: 400 });
      }
      const product = await Product.findById(item.productId);
      if (!product || product.stock < item.quantity) {
         return NextResponse.json({ success: false, message: `Insufficient stock for product ${product?.name || item.productId}` }, { status: 400 });
      }
    }

    for (const item of items) {
      productsForOrder.push({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      });
      totalAmount += (item.price * item.quantity);
      if (item.cartId) cartIdsToDelete.push(item.cartId);

      // Reduce stock
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
    }

    const newOrder = new Order({
      userId: decoded.id,
      products: productsForOrder,
      totalAmount: totalAmount,
      status: "Pending",
      address,
      location,
      paymentMethod: "COD",
      paymentStatus: "not_paid"
    });

    await newOrder.save();

    await Cart.deleteMany({
      _id: { $in: cartIdsToDelete },
      userId: decoded.id
    });

    return NextResponse.json({ success: true, message: "Order placed successfully", orderId: newOrder._id }, { status: 201 });

  } catch (error) {
    console.error("Create COD API Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
