import { NextResponse } from "next/server";

type ChatRequest = {
  messages?: { role: string; content: string }[];
  context?: Record<string, unknown>;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatRequest;
    const last = body.messages?.at(-1)?.content ?? "";

    // Placeholder reply to keep the interface working without a provider.
    const reply =
      "Resumo parcial via Método 30™ (stub). Conecte a um provedor de IA para respostas dinâmicas.\n\n" +
      `Última entrada: "${last}".\n` +
      "- Não entrega treino pronto.\n" +
      "- Capture local/equipamentos, objetivo, lesões, rotina, alimentação, sabotadores.\n" +
      "- Marque risco se houver dor/lesão e bloqueie qualquer prescrição automática.\n";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro ao processar a requisição do chat." },
      { status: 400 },
    );
  }
}
