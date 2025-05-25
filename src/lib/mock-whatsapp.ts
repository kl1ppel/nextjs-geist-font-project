export class Client {
  private static qrCallback: ((qr: string) => void) | null = null;
  private static readyCallback: (() => void) | null = null;

  constructor(options: any) {
    console.log('WhatsApp Client initialized with options:', options);
  }

  on(event: string, callback: any) {
    console.log(`Registered ${event} event handler`);
    if (event === 'qr') {
      Client.qrCallback = callback;
      // Simulate QR code generation after 2 seconds
      setTimeout(() => {
        if (Client.qrCallback) {
          Client.qrCallback('mock-qr-code-data');
        }
      }, 2000);
    } else if (event === 'ready') {
      Client.readyCallback = callback;
      // Simulate ready state after 5 seconds
      setTimeout(() => {
        if (Client.readyCallback) {
          Client.readyCallback();
        }
      }, 5000);
    }
  }

  async initialize() {
    console.log('LocalAuth initialized');
  }

  async sendMessage(chatId: string, message: string) {
    console.log(`Mock sending message to ${chatId}: ${message}`);
    return true;
  }
}

export class LocalAuth {
  constructor() {
    console.log('LocalAuth initialized');
  }
}
