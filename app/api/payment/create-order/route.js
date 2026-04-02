import connectDB from "@/app/lib/db";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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

    const { amount } = await req.json();

    if (!amount) {
      return NextResponse.json({ success: false, message: "Amount is required" }, { status: 400 });
    }

    const options = {
      amount: Math.round(amount * 100), // convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ success: true, razorpayOrderId: order.id }, { status: 200 });

  } catch (error) {
    console.error("Razorpay Create Order API Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
