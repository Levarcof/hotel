import connectDB from "@/app/lib/db";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {

  try {
    await connectDB();
    const body = await req.json();
    const { name, password, phone, profileImage } = body;

    // Validation
    if (!name?.trim() || !password?.trim() || !phone?.trim()) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }
    console.log("i am in register api1");

    // Check existing user
    const existingUser = await User.findOne({ phone });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with this phone number" },
        { status: 409 }
      );
    }

    // Profile Image Handling
    const profileImageUrl = profileImage || "";

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      phone,
      password: hashedPassword,
      profileImage: profileImageUrl,
      role:"user"
    });
    console.log("i am in register api");
    
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
      message: "Registration successful",
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

  } catch (error) {

    console.error("Register API Error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );

  }
}