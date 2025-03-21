import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Zod schema for validation
const UserValidation = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = UserValidation.parse(body);

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already registered, please log in." },
        { status: 403 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) {
      return NextResponse.json(
        { error: "Password could not be hashed." },
        { status: 500 }
      );
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "User has been created successfully.", user },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Please provide valid data.", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error signing up:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}