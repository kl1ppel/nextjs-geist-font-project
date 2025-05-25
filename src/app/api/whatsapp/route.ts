import { NextResponse } from "next/server";
import { whatsappService } from "@/services/whatsapp";

let qrCallback: ((qr: string) => void) | null = null;
let readyCallback: (() => void) | null = null;

export async function GET() {
  const status = whatsappService.getStatus();
  
  if (status.status === "loading") {
    // Initialize WhatsApp if not already initialized
    await whatsappService.initialize(
      (qr: string) => {
        if (qrCallback) qrCallback(qr);
      },
      () => {
        if (readyCallback) readyCallback();
      }
    );
  }
  
  return NextResponse.json(status);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (body.action === 'initialize') {
      await whatsappService.initialize(
        (qr: string) => {
          if (qrCallback) qrCallback(qr);
        },
        () => {
          if (readyCallback) readyCallback();
        }
      );
      return NextResponse.json({ status: "initializing" });
    }
    
    if (body.action === 'send') {
      const { phone, message } = body;
      if (!phone || !message) {
        return NextResponse.json(
          { error: "Phone and message are required" },
          { status: 400 }
        );
      }
      
      await whatsappService.sendMessage(phone, message);
      return NextResponse.json({ status: "success" });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("WhatsApp API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
