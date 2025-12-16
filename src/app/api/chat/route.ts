import { NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

type ChatPayload = {
  user: string;
  stepId?: string;
  question?: string;
  answers?: Record<string, string>;
  riskFlag?: boolean;
};

const systemPrompt = [
  "Voce e o assistente de anamnese da Paloma Priebe (20 anos, Metodo 30).",
  "Fale em portugues, 1-2 frases curtas. Seja empatico e direto.",
  "Foque apenas na pergunta atual; NAO abra novos temas ou proximas etapas.",
  "Se precisar de mais clareza, peca apenas 1 detalhe concreto da mesma pergunta (numeros, frequencia, onde doi, liberacao medica). Nao empilhe perguntas.",
  "Nao entregue treino pronto. Se detectar dor aguda/lesao seria, oriente a falar com a Paloma antes de treinar.",
  "Nunca responda apenas 'ok' ou 'entendeu'; sempre agregue valor ou peca um detalhe.",
].join(" ");

export async function POST(req: Request) {
  try {
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { message: "OPENAI_API_KEY ausente" },
        { status: 500 },
      );
    }

    const body = (await req.json()) as ChatPayload;
    const { user, stepId, question, answers, riskFlag } = body;

    const userMsg = [
      `Pergunta atual: ${question || ""}`.trim(),
      stepId ? `Passo: ${stepId}` : "",
      riskFlag ? "Flag de risco: SIM" : "",
      `Resposta do aluno: "${user}"`,
      answers ? `Contexto coletado: ${JSON.stringify(answers)}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMsg },
        ],
        temperature: 0.4,
        max_tokens: 180,
      }),
    });

    if (!completion.ok) {
      const text = await completion.text();
      console.error("OpenAI error:", text);
      return NextResponse.json(
        { message: "Falha na IA" },
        { status: 502 },
      );
    }

    const data = await completion.json();
    const reply = data.choices?.[0]?.message?.content || "Pode detalhar um pouco mais?";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erro no chat" }, { status: 400 });
  }
}
