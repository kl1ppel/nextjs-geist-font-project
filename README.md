# WhatsApp Business Automation

A Next.js application for automating WhatsApp Business messaging using Excel spreadsheets.

## Features

- Upload Excel files with contact numbers
- Customize default messages
- Send bulk messages with delay
- Modern UI with Tailwind CSS
- WhatsApp Web integration
- QR code authentication

## Tech Stack

- Next.js 15.3
- TypeScript
- Tailwind CSS
- WhatsApp Web.js
- XLSX for Excel handling

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/kl1ppel/nextjs-geist-font-project.git
cd nextjs-geist-font-project
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:8000](http://localhost:8000) with your browser to see the result.

## Usage

1. Start the application and wait for the QR code to appear
2. Scan the QR code with WhatsApp Business
3. Upload an Excel file containing phone numbers in the first column
4. Customize the default message if needed
5. Click "Send Messages" to start the bulk messaging process

## Environment Variables

Create a `.env.local` file in the root directory with:

```env
PORT=8000
```

## Contributing

Feel free to open issues and pull requests!

## License

MIT
