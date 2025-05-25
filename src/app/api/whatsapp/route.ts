import { NextResponse } from "next/server";
import { initWhatsAppClient, sendMessage } from "@/lib/whatsappClient";

let qrCodeData: string | null = null;
let clientReady: boolean = false;

const client = initWhatsAppClient(
  (qr: string) => {
    qrCodeData = qr;
  },
  () => {
    clientReady = true;
  }
);

export async function GET(request: Request) {
  if (!qrCodeData && !clientReady) {
    return NextResponse.json({ status: "loading" });
  }
  if (qrCodeData && !clientReady) {
    return NextResponse.json({ status: "qr", qrCode: qrCodeData });
  }
  if (clientReady) {
    return NextResponse.json({ status: "ready" });
  }
  return NextResponse.json({ status: "unknown" });
}

export async function POST(request: Request) {
  try {
    const { phone, message } = await request.json();
    if (!clientReady) {
      return NextResponse.json({ status: "error", message: "Client not ready" });
    }
    await sendMessage(phone, message);
    return NextResponse.json({ status: "success" });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message });
  }
}
