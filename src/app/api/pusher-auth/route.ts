// app/api/pusher-auth/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // ۱. توکن را از هدر درخواستی که از کلاینت آمده استخراج کن
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized: No token provided" }, { status: 401 });
    }

    // ۲. body درخواست (شامل socket_id و channel_name) را بخوان
    const body = await req.formData();
    
    // ۳. درخواست را به همراه توکن و body به سرور اصلی لاراول ارسال کن
    const laravelResponse = await fetch(`${process.env.NEXT_PUBLIC_LARAVEL_API_URL}broadcasting/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${token}`,
      },
      body: new URLSearchParams(body as any).toString(),
    });

    // ۴. اگر پاسخ لاراول موفقیت‌آمیز نبود، خطا را برگردان
    if (!laravelResponse.ok) {
      const errorText = await laravelResponse.text();
      console.error("Laravel broadcasting auth failed:", errorText);
      return NextResponse.json({ message: `Laravel auth failed: ${errorText}` }, { status: laravelResponse.status });
    }

    // ۵. اگر موفق بود، پاسخ لاراول را مستقیماً به کلاینت برگردان
    const data = await laravelResponse.json();
    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error("Pusher auth proxy error:", error.message);
    return NextResponse.json({ message: "Authentication failed", error: error.message }, { status: 500 });
  }
}
