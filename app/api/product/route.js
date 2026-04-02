import connectDB from "@/app/lib/db";
import Product from "@/app/models/Product";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, description, price, stock, category, images } = body;

    if (!name || !description || !price || stock === undefined || !category || !images || images.length === 0) {
      return NextResponse.json(
        { message: "All fields are required, including at least one image." },
        { status: 400 }
      );
    }

    if (images.length > 3) {
      return NextResponse.json(
        { message: "Maximum 3 images allowed." },
        { status: 400 }
      );
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      category,
      images,
    });

    return NextResponse.json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get Products Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
