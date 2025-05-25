import { Client, LocalAuth, MessageMedia } from "whatsapp-web.js";
import qrcode from "qrcode";

let client: Client | null = null;
let qrCodeData: string | null = null;

export function initWhatsAppClient(onQr: (qr: string) => void, onReady: () => void) {
  if (client) {
    return client;
  }

  client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true },
  });

  client.on("qr", async (qr) => {
    qrCodeData = await qrcode.toDataURL(qr);
    onQr(qrCodeData);
  });

  client.on("ready", () => {
    onReady();
  });

  client.on("auth_failure", (msg) => {
    console.error("Authentication failure:", msg);
  });

  client.initialize();

  return client;
}

export async function sendMessage(phone: string, message: string) {
  if (!client) {
    throw new Error("WhatsApp client not initialized");
  }
  const chatId = phone.includes("@c.us") ? phone : phone + "@c.us";
  await client.sendMessage(chatId, message);
}
