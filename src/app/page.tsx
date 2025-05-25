"use client";

import React, { useState, useEffect } from "react";
import { read, utils } from "xlsx";
import { CustomButton } from "@/components/ui/custom-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Home() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [contacts, setContacts] = useState<string[]>([]);
  const [message, setMessage] = useState(
    "Olá, esta é uma mensagem padrão do gerente bancário."
  );
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);

  // Fetch QR code and client status from backend
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/whatsapp");
        const data = await res.json();
        if (data.status === "qr") {
          setQrCode(data.qrCode);
          setLoggedIn(false);
        } else if (data.status === "ready") {
          setQrCode(null);
          setLoggedIn(true);
          clearInterval(interval);
        }
      } catch (error) {
        console.error("Error fetching WhatsApp status:", error);
      }
    };

    fetchStatus();
    interval = setInterval(fetchStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      const reader = new FileReader();
      reader.onload = (evt) => {
        const data = evt.target?.result;
        if (data) {
          const workbook = read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = utils.sheet_to_json(worksheet, { header: 1 }) as string[][] | any;
          // Extract phone numbers assuming they are in the first column
          const phones = jsonData
            .map((row: any) => row[0])
            .filter((phone: any) => typeof phone === "string" || typeof phone === "number")
            .map((phone: any) => phone.toString());
          setContacts(phones);
        }
      };
      reader.readAsBinaryString(uploadedFile);
    }
  };

  const sendMessages = async () => {
    setSending(true);
    for (let i = 0; i < contacts.length; i++) {
      const phone = contacts[i];
      try {
        const res = await fetch("/api/whatsapp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: 'send', phone, message }),
        });
        const data = await res.json();
        if (data.status !== "success") {
          console.error(`Failed to send message to ${phone}: ${data.message}`);
        }
      } catch (error) {
        console.error(`Error sending message to ${phone}:`, error);
      }
      setProgress(Math.round(((i + 1) / contacts.length) * 100));
      // Wait 5 seconds between messages to avoid blocks
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
    setSending(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-black p-6">
      <h1 className="text-3xl font-bold mb-6">WhatsApp Business Automation</h1>

      {!loggedIn && (
        <section className="mb-6 flex flex-col items-center">
          <p className="mb-2">Por favor, faça login no WhatsApp Business:</p>
          {qrCode ? (
            <div className="border p-4 rounded-md bg-gray-100">
              <p>Escaneie este QR Code no seu WhatsApp Business:</p>
              <div className="mt-2 w-48 h-48 bg-white flex items-center justify-center">
                <img src={qrCode} alt="QR Code" className="w-48 h-48" />
              </div>
            </div>
          ) : (
            <p>Gerando QR Code...</p>
          )}
        </section>
      )}

      {loggedIn && (
        <>
          <section className="mb-6 w-full max-w-md">
            <Label htmlFor="fileUpload" className="mb-2 block font-semibold">
              Insira a planilha Excel com os contatos:
            </Label>
            <Input
              type="file"
              id="fileUpload"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              disabled={sending}
            />
          </section>

          {contacts.length > 0 && (
            <section className="mb-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-2">Contatos extraídos:</h2>
              <ul className="max-h-48 overflow-auto border rounded p-2 bg-gray-50">
                {contacts.map((phone, idx) => (
                  <li key={idx} className="text-sm">
                    {phone}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mb-6 w-full max-w-md">
            <Label htmlFor="message" className="mb-2 block font-semibold">
              Mensagem padrão:
            </Label>
            <textarea
              id="message"
              className="w-full p-2 border rounded resize-none"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={sending}
            />
          </section>

          <CustomButton
            onClick={sendMessages}
            disabled={sending || contacts.length === 0}
            className="w-full max-w-md"
          >
            {sending ? `Enviando... ${progress}%` : "Enviar Mensagens"}
          </CustomButton>
        </>
      )}
    </main>
  );
}
