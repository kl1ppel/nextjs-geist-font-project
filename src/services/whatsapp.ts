import { Client, LocalAuth } from "@/lib/mock-whatsapp";
import qrcode from "qrcode";

class WhatsAppService {
  private static instance: WhatsAppService;
  private client: Client | null = null;
  private qrCodeData: string | null = null;
  private isReady: boolean = false;

  private constructor() {}

  static getInstance(): WhatsAppService {
    if (!WhatsAppService.instance) {
      WhatsAppService.instance = new WhatsAppService();
    }
    return WhatsAppService.instance;
  }

  async initialize(onQr: (qr: string) => void, onReady: () => void) {
    if (this.client) {
      return;
    }

    try {
      this.client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
          ]
        }
      });

      this.client.on("qr", async (qrData: string) => {
        try {
          const qrCodeUrl = await qrcode.toDataURL(qrData);
          this.qrCodeData = qrCodeUrl;
          onQr(qrCodeUrl);
        } catch (error) {
          console.error("Error generating QR code:", error);
        }
      });

      this.client.on("ready", () => {
        this.isReady = true;
        onReady();
      });

      await this.client.initialize();
    } catch (error) {
      console.error("Error initializing WhatsApp client:", error);
      throw error;
    }
  }

  async sendMessage(phone: string, message: string) {
    if (!this.client || !this.isReady) {
      throw new Error("WhatsApp client not initialized or not ready");
    }

    try {
      const chatId = phone.includes("@c.us") ? phone : `${phone}@c.us`;
      await this.client.sendMessage(chatId, message);
      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  getStatus(): { status: string; qrCode?: string } {
    if (!this.client) {
      return { status: "loading" };
    }
    if (this.qrCodeData && !this.isReady) {
      return { status: "qr", qrCode: this.qrCodeData };
    }
    if (this.isReady) {
      return { status: "ready" };
    }
    return { status: "unknown" };
  }
}

export const whatsappService = WhatsAppService.getInstance();
