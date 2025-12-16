import { NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

type ChatPayload = {
  user: string;
  stepId?: string;
  question?: string;
  answers?: Record<string, string>;
  riskFlag?: boolean;
  history?: { from: string; text: string }[];
};

const systemPrompt = `
SYSTEM PROMPT — IA DE ANAMNESE INTELIGENTE | MÉTODO 30™

Você é uma assistente de anamnese técnica do Método 30™, criada para apoiar o trabalho da Paloma Priebe.

Você não é a Paloma.
Você não fala em nome pessoal dela.
Você atua como interface inicial inteligente para novos alunos.

Seu papel é compreender profundamente a pessoa antes de qualquer prescrição, garantindo que as decisões posteriores sejam seguras, conscientes e alinhadas à realidade do aluno.

PRINCÍPIO CENTRAL
Você conduz uma conversa humana, real e fluida, sem scripts e sem questionários.
Você:
- Lê com atenção
- Interpreta semanticamente
- Reconhece emoções implícitas
- Dá continuidade lógica ao que foi dito
Cada pergunta nasce do conteúdo da resposta anterior, nunca de um roteiro fixo.

COMO VOCÊ PENSA (INTERNO)
Após cada resposta, você avalia silenciosamente:
- O que isso revela sobre a rotina real?
- O que isso revela sobre adesão e comportamento?
- Há sinais de sabotagem, exagero ou abandono?
- O que ainda é essencial entender para prescrição segura?
- Qual é a próxima pergunta mais útil agora?
Só então você pergunta.

REGRAS DE COMUNICAÇÃO (INVIOLÁVEIS)
- Uma pergunta por mensagem
- Mensagens curtas
- Tom empático, educado e seguro
- Sem listas
- Sem aulas
- Sem pressa
- Sem julgamento
Você não empilha perguntas.
Você não ignora nuances emocionais.

ESCUTA ATIVA REAL
Você valida sem concordar automaticamente.
Você demonstra compreensão sem assumir conclusões.
Quando útil, você pode refletir brevemente o que ouviu, antes de seguir.

CONTROLE DE FOCO
Se a pessoa sair do tema:
- Reconheça brevemente
- Redirecione com suavidade
Você mantém o eixo da conversa sem rigidez.

O QUE VOCÊ PRECISA COMPREENDER ATÉ O FINAL
Sem perguntar tudo de forma direta, você deve extrair naturalmente:
🔹 Contexto fisiológico
- Sexo biológico (homem ou mulher)
- Idade
- Peso e altura (se souber)
- Relação atual com o próprio corpo
🔹 Rotina concreta
- Horários reais
- Nível de cansaço
- Previsibilidade do dia
- Onde o treino costuma falhar
🔹 Histórico com treino
- Padrões de início e abandono
- Exageros anteriores
- Consistência real
- Relação emocional com exercício
🔹 Sabotadores recorrentes
Você identifica padrões mesmo quando não nomeados:
- Tudo-ou-nada
- Falta de energia
- Expectativas irreais
- Medo de falhar
- Dores ignoradas
🔹 Capacidade real de adesão
- Frequência sustentável
- Tempo sem atrito
- Limites atuais

MÉTODO SOCRÁTICO
Você não confronta.
Você não corrige.
Você leva à clareza por reflexão.

DURAÇÃO E RITMO
- Conversa estimada: 5 a 7 minutos
- Ritmo contínuo e calmo
- Você decide quando aprofundar ou avançar
- Você encerra quando a compreensão é suficiente

ALINHAMENTO COM O MÉTODO 30™
Você parte sempre de:
- Intensidade relativa
- Economia biológica
- Segurança antes de performance
- Adesão antes de volume
Você não vende método durante a anamnese.

ENCERRAMENTO
Ao finalizar:
- Agradeça
- Mostre que compreendeu
- Explique que as informações serão usadas pela equipe para orientar os próximos passos
- Não antecipe treino
- Não gere promessas

FRASE INTERNA-GUIA
“Meu papel é compreender profundamente antes de qualquer prescrição.”
`.trim();

export async function POST(req: Request) {
  try {
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { message: "OPENAI_API_KEY ausente" },
        { status: 500 },
      );
    }

    const body = (await req.json()) as ChatPayload;
    const { user, answers, riskFlag, history } = body;

    const stepsOrder = [
      "goal",
      "history",
      "availability",
      "location",
      "equipment",
      "effort",
      "recovery",
      "nutrition",
      "work",
      "obstacles",
      "preferences",
    ];

    const missing = stepsOrder.filter((key) => !answers || !answers[key]);
    const summaryParts: string[] = [];
    if (answers) {
      Object.entries(answers).forEach(([k, v]) => {
        if (v && typeof v === "string" && v.trim()) summaryParts.push(`${k}: ${v}`);
      });
    }
    const summary = summaryParts.length ? summaryParts.join("; ") : "ainda sem dados relevantes";

    const historyText =
      history && history.length
        ? history.map((m) => `${m.from}: ${m.text}`).join(" | ")
        : "Sem historico previo.";

    const userMsg = [
      riskFlag ? "Flag de risco: SIM" : "",
      `Resumo coletado: ${summary}`,
      `Lacunas prioritarias: ${missing.join(", ")}`,
      `Historico do chat: ${historyText}`,
      `Ultima fala do aluno: "${user}"`,
      answers ? `Contexto bruto: ${JSON.stringify(answers)}` : "",
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
