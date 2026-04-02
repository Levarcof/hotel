import connectDB from "@/app/lib/db";
import Cart from "@/app/models/Cart";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  try {
    const { cartId } = await params;
    await connectDB();
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
       return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    const deletedItem = await Cart.findOneAndDelete({ _id: cartId, userId: decoded.id });
    
    if (!deletedItem) {
      return NextResponse.json({ success: false, message: "Item not found in your cart" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Item removed from cart" }, { status: 200 });
  } catch (error) {
    console.error("Delete Cart Item API Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
