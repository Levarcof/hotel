import connectDB from "@/app/lib/db";
import Cart from "@/app/models/Cart";
import Product from "@/app/models/Product"; // Ensure product schema is registered
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req) {
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

    const cartItems = await Cart.find({ userId: decoded.id })
                                .populate("productId")
                                .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, cartItems }, { status: 200 });
  } catch (error) {
    console.error("Fetch Cart API Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized - Please login first" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
       return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    const { productId, quantity } = await req.json();

    if (!productId || !quantity) {
       return NextResponse.json({ success: false, message: "ProductId and quantity are required" }, { status: 400 });
    }

    // Check if item already exists in cart for this user
    let cartItem = await Cart.findOne({ userId: decoded.id, productId });
    const productExists = await Product.findById(productId);
    
    if(!productExists) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    if (cartItem) {
      // If it exists, check stock and update the quantity
      if (productExists.stock < cartItem.quantity + parseInt(quantity)) {
        return NextResponse.json({ success: false, message: "Not enough stock available" }, { status: 400 });
      }
      cartItem.quantity += parseInt(quantity);
      await cartItem.save();
    } else {
      // If it doesn't exist, check stock and create a new cart item
      if (productExists.stock < parseInt(quantity)) {
        return NextResponse.json({ success: false, message: "Not enough stock available" }, { status: 400 });
      }
      cartItem = new Cart({
        userId: decoded.id,
        productId,
        quantity: parseInt(quantity)
      });
      await cartItem.save();
    }

    return NextResponse.json({ success: true, message: "Product added to cart", cartItem }, { status: 201 });
  } catch (error) {
    console.error("Add to Cart API Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req) {
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

    const { cartId, quantity } = await req.json();

    if (!cartId || quantity === undefined || quantity < 1) {
       return NextResponse.json({ success: false, message: "Valid cartId and quantity are required" }, { status: 400 });
    }

    const cartItem = await Cart.findOne({ _id: cartId, userId: decoded.id }).populate('productId');

    if (!cartItem) {
      return NextResponse.json({ success: false, message: "Cart item not found" }, { status: 404 });
    }

    if (cartItem.productId.stock < parseInt(quantity)) {
      return NextResponse.json({ success: false, message: "Not enough stock available" }, { status: 400 });
    }

    cartItem.quantity = parseInt(quantity);
    await cartItem.save();

    return NextResponse.json({ success: true, message: "Quantity updated", cartItem }, { status: 200 });
  } catch (error) {
    console.error("Update Cart API Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
