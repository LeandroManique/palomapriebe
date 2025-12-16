import { NextResponse } from "next/server";

const SHEETS_WEBHOOK_URL = process.env.SHEETS_WEBHOOK_URL;

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { contact, answers } = payload || {};

    if (!contact?.email || !contact?.phone || !contact?.name) {
      return NextResponse.json(
        { message: "Preencha nome, e-mail e WhatsApp." },
        { status: 400 },
      );
    }

    if (!SHEETS_WEBHOOK_URL) {
      return NextResponse.json({
        message:
          "Stub ativo: defina SHEETS_WEBHOOK_URL no ambiente para enviar ao Google Sheets.",
        payloadPreview: { contact, answers },
      });
    }

    const res = await fetch(SHEETS_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { message: "Erro ao enviar para Sheets", detail: text },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Ficha enviada para a Paloma revisar.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro ao enviar ficha." },
      { status: 500 },
    );
  }
}
