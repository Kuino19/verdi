import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();
    
    // Set session expiration to 5 days
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    
    // Create the session cookie
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    const options = {
      name: "session",
      value: sessionCookie,
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    };

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set(options);

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error: any) {
    console.error("Session creation error details:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message, code: error.code }, 
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  return NextResponse.json({ status: "success" }, { status: 200 });
}
