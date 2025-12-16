import { NextResponse } from "next/server";
import { Resend } from "resend";

const SHEETS_WEBHOOK_URL = process.env.SHEETS_WEBHOOK_URL;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM;
const EMAIL_TO_PALOMA = process.env.EMAIL_TO_PALOMA;

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

type Payload = {
  contact?: Record<string, string>;
  answers?: Record<string, string>;
  summary?: Record<string, string>;
  riskFlag?: boolean;
};

function superPrompt(payload: Payload) {
  const { contact = {}, answers = {}, riskFlag } = payload || {};
  return `
Você é Paloma Priebe (20 anos, Método 30). Gere um plano completo, pronto para entrega, com base científica e mentalidade do Método 30 (intensidade relativa, densidade do estímulo, volume mínimo eficaz, técnica e adesão). Não inclua marcas de IA.

Dados do aluno:
- Nome: ${contact.name || ""}
- Plano: ${contact.plan || ""}
- Objetivo: ${answers.goal || ""}
- Sucesso definido: ${answers.success || ""}
- Histórico/lesões/risco: ${answers.history || ""} (Risco: ${riskFlag ? "SIM" : "NÃO"})
- Disponibilidade: ${answers.availability || ""}
- Local/equipamentos: ${answers.locationDetail || answers.location || answers.equipment || ""}
- Esforço/tolerância: ${answers.effort || ""}
- Sono/estresse/recuperação: ${answers.recovery || answers.sleep || ""}
- Alimentação/hidratação: ${answers.nutrition || ""}
- Trabalho/rotina: ${answers.work || ""}
- Sabotadores/ajustes que funcionaram: ${answers.obstacles || ""}
- Preferências/restrições: ${answers.preferences || ""}

Instruções de saída:
- Formato pronto para o aluno (PT-BR), organizado em seções.
- 1) Objetivo e estratégia (Método 30 aplicado).
- 2) Estrutura semanal: dias/foco/duração.
- 3) Blocos por sessão: aquecimento breve; força/controle; metabólico (se cabível); mobilidade. Use intensidade relativa (RPE/RIR) e densidade conforme tempo/equipamento.
- 4) Checkpoints técnicos (postura, respiração, evitar compensações).
- 5) Ajustes se dor/limitação (variações seguras, o que evitar).
- 6) Progressão: quando subir carga/volume/densidade.
- 7) Adesão: encaixe nas janelas, como lidar com sabotadores citados.
- Se houver risco agudo, nota clara para interromper e falar com você antes de treinar.
- Seja conciso e direto (1–2 frases por bullet), sem marcas de IA.
`;
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { contact, answers, summary, riskFlag } = payload || {};

    if (!contact?.email || !contact?.phone || !contact?.name) {
      return NextResponse.json(
        { message: "Preencha nome, e-mail e WhatsApp." },
        { status: 400 },
      );
    }

    // Envia ao Sheets se configurado
    if (SHEETS_WEBHOOK_URL) {
      try {
        await fetch(SHEETS_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (error) {
        console.error("Erro ao enviar para Sheets", error);
      }
    }

    // Envia e-mail via Resend
    if (!resend || !EMAIL_FROM || !EMAIL_TO_PALOMA) {
      return NextResponse.json({
        message:
          "Ficha recebida. Configure RESEND_API_KEY, EMAIL_FROM e EMAIL_TO_PALOMA para enviar o e-mail.",
      });
    }

    const html = `
      <h2>Novo aluno: ${contact?.name || ""} - ${contact?.plan || ""}</h2>
      <p><b>Email:</b> ${contact?.email || ""} | <b>WhatsApp:</b> ${contact?.phone || ""}</p>
      <p><b>Objetivo:</b> ${answers?.goal || ""}</p>
      <p><b>Histórico/lesões:</b> ${answers?.history || ""} (Risco: ${riskFlag ? "SIM" : "NÃO"})</p>
      <p><b>Disponibilidade:</b> ${answers?.availability || ""}</p>
      <p><b>Local/equipamentos:</b> ${answers?.locationDetail || answers?.location || answers?.equipment || ""}</p>
      <p><b>Esforço/tolerância:</b> ${answers?.effort || ""}</p>
      <p><b>Sono/estresse/recuperação:</b> ${answers?.recovery || answers?.sleep || ""}</p>
      <p><b>Alimentação/hidratação:</b> ${answers?.nutrition || ""}</p>
      <p><b>Rotina de trabalho:</b> ${answers?.work || ""}</p>
      <p><b>Sabotadores:</b> ${answers?.obstacles || ""}</p>
      <p><b>Preferências/restrições:</b> ${answers?.preferences || ""}</p>
      <hr/>
      <p><b>Resumo Método 30:</b></p>
      <ul>
        <li>${summary?.systems || ""}</li>
        <li>${summary?.intensity || ""}</li>
        <li>${summary?.density || ""}</li>
        <li>${summary?.volume || ""}</li>
        <li>${summary?.technique || ""}</li>
      </ul>
      <hr/>
      <p><b>SUPERPROMPT (copiar e colar no GPT):</b></p>
      <pre style="white-space:pre-wrap;">${superPrompt(payload)}</pre>
    `;

    await resend.emails.send({
      from: EMAIL_FROM,
      to: EMAIL_TO_PALOMA,
      subject: `Novo aluno - Plano ${contact?.plan || ""} - ${contact?.name || ""}`,
      html,
    });

    return NextResponse.json({
      message: "Ficha enviada. Paloma receberá por e-mail.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro ao enviar ficha." },
      { status: 500 },
    );
  }
}
