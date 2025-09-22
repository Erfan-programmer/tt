// libs/PusherConfig.ts
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData"; // مسیر تابع خود را وارد کنید

// این کار برای سازگاری با Next.js و TypeScript لازم است
if (typeof window !== "undefined") {
  (window as any).Pusher = Pusher;
}

// تعریف نوع داده برای callback تابع احراز هویت
type AuthorizerCallback = (error: Error | null, authData: any) => void;

const echo = new Echo({
  broadcaster: "pusher",
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER!,
  forceTLS: true, // همیشه از اتصال امن استفاده می‌کند

  // این تابع مسئول احراز هویت برای کانال‌های خصوصی است
  authorizer: (channel: any) => {
    return {
      authorize: async (socketId: string, callback: AuthorizerCallback) => {
        console.log("Attempting to authorize channel:", channel.name);
        try {
          // توکن کاربر را از محل ذخیره‌سازی آن (مثلاً localStorage) بخوانید
          const token = loadUserData()?.access_token;
          if (!token) {
            throw new Error("Authentication token not found.");
          }

          // یک درخواست به پروکسی API خودمان ارسال می‌کنیم
          const response = await fetch("/api/pusher-auth", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              socket_id: socketId,
              channel_name: channel.name,
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Authorization failed with status ${response.status}: ${errorText}`);
          }

          const data = await response.json();
          console.log("Authorization successful for channel:", channel.name);
          callback(null, data);

        } catch (error: any) {
          console.error("Pusher authorizer error:", error.message);
          callback(error, null);
        }
      },
    };
  },
});

export default echo;
