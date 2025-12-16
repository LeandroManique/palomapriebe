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
  messages?: { from: string; text: string }[];
};

function superPrompt(payload: Payload) {
  const { contact = {}, answers = {}, riskFlag, messages = [] } = payload || {};
  const transcript =
    messages && messages.length
      ? messages.map((m) => `${m.from}: ${m.text}`).join("\n")
      : "Sem transcricao.";
  return `
Voce e um assistente criando um plano completo, pronto para entrega, baseado em ciencia e nos principios: intensidade relativa, densidade do estimulo, volume minimo eficaz, tecnica e adesao. Nao cite "Metodo 30", apenas aplique esses principios. Nao inclua marcas de IA.

Dados do aluno (transcricao livre):
${transcript}

Campos estruturados (se houver):
- Nome: ${contact.name || ""}
- Plano: ${contact.plan || ""}
- Objetivo: ${answers.goal || ""}
- Sucesso definido: ${answers.success || ""}
- Historico/lesoes/risco: ${answers.history || ""} (Risco: ${riskFlag ? "SIM" : "NAO"})
- Disponibilidade: ${answers.availability || ""}
- Local/equipamentos: ${answers.locationDetail || answers.location || answers.equipment || ""}
- Esforco/tolerancia: ${answers.effort || ""}
- Sono/estresse/recuperacao: ${answers.recovery || answers.sleep || ""}
- Alimentacao/hidratacao: ${answers.nutrition || ""}
- Trabalho/rotina: ${answers.work || ""}
- Sabotadores/ajustes que funcionaram: ${answers.obstacles || ""}
- Preferencias/restricoes: ${answers.preferences || ""}

Instrucoes de saida:
- Formato pronto para o aluno (PT-BR), organizado em secoes.
- 1) Objetivo e estrategia (aplicando os principios acima).
- 2) Estrutura semanal: dias/foco/duracao.
- 3) Blocos por sessao: aquecimento breve; forca/controle; metabolico (se cabivel); mobilidade. Use intensidade relativa (RPE/RIR) e densidade conforme tempo/equipamento.
- 4) Checkpoints tecnicos (postura, respiracao, evitar compensacoes).
- 5) Ajustes se dor/limitacao (variacoes seguras, o que evitar).
- 6) Progressao: quando subir carga/volume/densidade.
- 7) Adesao: encaixe nas janelas, como lidar com sabotadores citados.
- Se houver risco agudo, nota clara para interromper e falar com um profissional antes de treinar.
- Seja conciso e direto (1-2 frases por bullet), sem marcas de IA.
`;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Payload;
    const { contact, answers, summary, riskFlag, messages } = payload || {};

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
      <p><b>Historico/lesoes:</b> ${answers?.history || ""} (Risco: ${riskFlag ? "SIM" : "NAO"})</p>
      <p><b>Disponibilidade:</b> ${answers?.availability || ""}</p>
      <p><b>Local/equipamentos:</b> ${answers?.locationDetail || answers?.location || answers?.equipment || ""}</p>
      <p><b>Esforco/tolerancia:</b> ${answers?.effort || ""}</p>
      <p><b>Sono/estresse/recuperacao:</b> ${answers?.recovery || answers?.sleep || ""}</p>
      <p><b>Alimentacao/hidratacao:</b> ${answers?.nutrition || ""}</p>
      <p><b>Rotina de trabalho:</b> ${answers?.work || ""}</p>
      <p><b>Sabotadores:</b> ${answers?.obstacles || ""}</p>
      <p><b>Preferencias/restricoes:</b> ${answers?.preferences || ""}</p>
      <p><b>Transcricao:</b><br/><pre style="white-space:pre-wrap;">${messages
        ?.map((m) => `${m.from}: ${m.text}`)
        .join("\n")}</pre></p>
      <hr/>
      <p><b>Resumo Metodo 30:</b></p>
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
      message: "Ficha enviada. Paloma recebera por e-mail.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro ao enviar ficha." },
      { status: 500 },
    );
  }
}
