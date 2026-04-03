import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import User from "@/app/models/User";

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    
    // Prevent self-deletion or specific system users could be added here
    // For now, allow regular admin-driven deletion
    
    await User.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "User deleted" });
  } catch (error) {
    console.error("Delete User API Error:", error);
    return NextResponse.json({ success: false, message: "Error deleting user" }, { status: 500 });
  }
}
