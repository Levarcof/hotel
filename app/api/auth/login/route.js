import connectDB from "@/app/lib/db";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  try{
      await connectDB();

  const { phone, password } = await req.json();

  const user = await User.findOne({ phone });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return NextResponse.json({ message: "Invalid password" }, { status: 401 });
  }

  
const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        userId: user.userId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🍪 Store in cookie
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      token: token
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  }
  catch(error){
    console.error("Register API Error:", error);
   
       return NextResponse.json(
         { message: "Internal Server Error" },
         { status: 500 }
       );
  }

}