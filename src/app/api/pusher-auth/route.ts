// app/api/pusher-auth/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized: No token provided" }, { status: 401 });
    }

    const body = await req.formData();
    
    const laravelResponse = await fetch(`${process.env.NEXT_PUBLIC_LARAVEL_API_URL}broadcasting/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${token}`,
      },
      body: new URLSearchParams(body as any).toString(),
    });

    if (!laravelResponse.ok) {
      const errorText = await laravelResponse.text();
      console.error("Laravel broadcasting auth failed:", errorText);
      return NextResponse.json({ message: `Laravel auth failed: ${errorText}` }, { status: laravelResponse.status });
    }

    const data = await laravelResponse.json();
    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error("Pusher auth proxy error:", error.message);
    return NextResponse.json({ message: "Authentication failed", error: error.message }, { status: 500 });
  }
}
