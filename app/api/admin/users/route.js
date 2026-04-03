import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import User from "@/app/models/User";

export async function GET() {
  try {
    await connectDB();
    const users = await User.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Fetch Users API Error:", error);
    return NextResponse.json({ success: false, message: "Error fetching users" }, { status: 500 });
  }
}
