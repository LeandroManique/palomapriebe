"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./ChatSimulator.module.css";

type Message = { from: "ai" | "user"; text: string };

const steps = [
  { id: "goal", prompt: "Qual seu objetivo principal? (ex.: força, hipertrofia, dor lombar, emagrecimento)" },
  { id: "success", prompt: "O que é sucesso pra você nesse objetivo? (ex.: roupa, prova, dor zero)" },
  { id: "history", prompt: "Histórico de treino e lesões? Alguma dor atual ou cirurgia?" },
  { id: "availability", prompt: "Dias/semana e minutos por sessão que você tem? (ex.: 3x/sem, 30-40 min)" },
  { id: "location", prompt: "Onde vai treinar? (academia, casa, condomínio, viagem) e o espaço disponível?" },
  { id: "equipment", prompt: "Quais equipamentos? (halteres, elástico, barra, anilhas, banco, peso corporal)" },
  { id: "effort", prompt: "Como reage a cargas/intensidade? Já passou mal em treino intenso?" },
  { id: "recovery", prompt: "Sono e estresse: quantas horas, acorda descansado? Usa medicação?" },
  { id: "nutrition", prompt: "Alimentação/hidratação: regular, restrições? Bebe quanta água/dia?" },
  { id: "work", prompt: "Rotina de trabalho/estudos: turnos, deslocamentos, dias mais cansativos?" },
  { id: "obstacles", prompt: "O que mais faz você faltar? (tempo, sono, logística, motivação, dor)" },
  { id: "preferences", prompt: "Preferências/restrições de movimentos? Algo que evita ou gosta de fazer?" },
];

const storageKey = "paloma-chat-v2";

const planOptions = [
  "Impulso - 1 mes",
  "Transformacao - 3 meses",
  "Ano de Resultados - 12 meses",
  "Mentoria Premium - 12 meses",
  "Treino de viagem (14 dias)",
  "Sessao extra ao vivo (20 min)",
];

const checkoutLinks: Record<string, string> = {
  "Impulso - 1 mes": "https://pay.kiwify.com.br/aDkvKsP",
  "Transformacao - 3 meses": "https://pay.kiwify.com.br/ip9vDaA",
  "Ano de Resultados - 12 meses": "https://pay.kiwify.com.br/VSlcZbV",
  "Mentoria Premium - 12 meses": "https://pay.kiwify.com.br/VedueGN",
  "Treino de viagem (14 dias)": "https://pay.kiwify.com.br/eVlfoer",
  "Sessao extra ao vivo (20 min)": "https://pay.kiwify.com.br/obiSvQv",
};

const defaultContact = {
  name: "",
  email: "",
  phone: "",
  plan: "Impulso - 1 mes",
  consent: false,
};

export default function ChatSimulator() {
  const [messages, setMessages] = useState<Message[]>([
    { from: "ai", text: "Oi! Sou o assistente da Paloma. Vamos fazer uma anamnese rápida e precisa. 1 pergunta por vez." },
    { from: "ai", text: steps[0].prompt },
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [input, setInput] = useState("");
  const [riskFlag, setRiskFlag] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [contact, setContact] = useState(defaultContact);
  const [inputError, setInputError] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed.messages ?? messages);
        setCurrentStep(parsed.currentStep ?? 0);
        setAnswers(parsed.answers ?? {});
        setRiskFlag(parsed.riskFlag ?? false);
        setContact(parsed.contact ?? defaultContact);
      } catch (error) {
        console.error("Erro ao carregar chat", error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ messages, currentStep, answers, riskFlag, contact }),
      );
    }
  }, [messages, currentStep, answers, riskFlag, contact]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const progress = useMemo(() => {
    const pct = Math.min((currentStep / steps.length) * 100, 100);
    return Math.round(pct);
  }, [currentStep]);

  function resetChat() {
    setMessages([
      { from: "ai", text: "Oi! Sou o assistente da Paloma. Vamos fazer uma anamnese rápida e precisa. 1 pergunta por vez." },
      { from: "ai", text: steps[0].prompt },
    ]);
    setCurrentStep(0);
    setAnswers({});
    setRiskFlag(false);
    setInput("");
    setStatus("idle");
    setServerMessage(null);
    setContact(defaultContact);
    setInputError(null);
  }

  function isLowSignal(text: string) {
    const t = text.toLowerCase().trim();
    const fillers = ["oi", "ok", "sim", "nao", "não", "blz", "tudo bem", "bom", "boa", "oii", "teste"];
    if (t.length < 8) return true;
    if (fillers.includes(t)) return true;
    return false;
  }

  async function handleSend(value?: string) {
    const text = (value ?? input).trim();
    if (!text) return;
    if (isLowSignal(text)) {
      setInputError("Preciso de mais detalhes concretos.");
      return;
    }
    setInputError(null);
    const step = steps[currentStep];
    pushMessage({ from: "user", text });
    const updatedAnswers = { ...answers, [step.id]: text };
    setAnswers(updatedAnswers);
    setInput("");
    if (detectRisk(text)) setRiskFlag(true);
    await callAi(text, step.id, updatedAnswers, step.prompt);
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    if (nextStep < steps.length) {
      pushMessage({ from: "ai", text: steps[nextStep].prompt });
    } else {
      pushMessage({ from: "ai", text: "Obrigado! Agora preciso de seus contatos e plano escolhido." });
    }
  }

  function detectRisk(text: string) {
    const lowered = text.toLowerCase();
    const triggers = ["dor", "lesao", "lesão", "cirurgia", "cardiaco", "cardíaco", "fratura", "inflamacao", "inflamação"];
    return triggers.some((w) => lowered.includes(w));
  }

  function pushMessage(msg: Message) {
    setMessages((prev) => [...prev, msg]);
  }

  async function callAi(
    userText: string,
    stepId?: string,
    enrichedAnswers?: Record<string, string>,
    question?: string,
  ) {
    try {
      setAiLoading(true);
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: userText,
          stepId,
          question,
          answers: enrichedAnswers ?? answers,
          riskFlag,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Erro na IA");
      if (json.reply) pushMessage({ from: "ai", text: json.reply });
    } catch (error) {
      console.error(error);
      pushMessage({
        from: "ai",
        text: "Não entendi bem. Pode detalhar um pouco mais? (tente novamente se persistir)",
      });
    } finally {
      setAiLoading(false);
    }
  }

  function summary() {
    const equip =
      answers.equipment || answers.location || answers.locationDetail || answers.equipmentDetail || "a definir";
    return {
      systems: answers.goal
        ? `Foco em ${answers.goal}; estimular sistemas neuromuscular/cardio conforme tolerância.`
        : "",
      intensity: answers.effort ? "Intensidade relativa calibrada; se reação ruim, densidade mais baixa." : "",
      density:
        answers.availability && answers.availability.includes("30")
          ? "Sessões compactas → densidade alta e descanso curto."
          : "Organizar blocos para maximizar trabalho/tempo.",
      volume: "Volume mínimo eficaz, progredindo quando técnica e recuperação estiverem sólidas.",
      technique: "Checkpoints técnicos e evitar compensações, especialmente com histórico de lesão.",
      equipment: equip,
    };
  }

  async function submitLead() {
    if (!contact.name || !contact.email || !contact.phone || !contact.consent) {
      setServerMessage("Preencha nome, email, WhatsApp e aceite o uso dos dados.");
      setStatus("error");
      return;
    }
    setStatus("sending");
    setServerMessage(null);
    const payload = {
      contact,
      answers,
      summary: summary(),
      riskFlag,
      meta: {
        source: "landing-chat",
        eta: "24h uteis",
      },
    };
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Erro ao enviar ficha.");
      setStatus("sent");
      setServerMessage(json?.message || "Ficha enviada para a Paloma revisar.");
    } catch (error) {
      console.error(error);
      setStatus("error");
      setServerMessage("Falha ao enviar. Tente novamente.");
    }
  }

  return (
    <div className={styles.chatCard} id="chat">
      <div className={styles.chatHeader}>
        <div>
          <p className={styles.label}>Chat de anamnese</p>
          <p className={styles.meta}>
            Progresso {Math.min(currentStep, steps.length)}/{steps.length} · {progress}% · Método 30
          </p>
        </div>
        <div className={styles.chatHeaderRight}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <button type="button" className={styles.reset} onClick={resetChat}>
            Reiniciar
          </button>
        </div>
      </div>

      <div className={styles.chatWindow} ref={chatRef}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`${styles.message} ${msg.from === "ai" ? styles.ai : styles.user}`}
          >
            {msg.text}
          </div>
        ))}
        {riskFlag && (
          <div className={`${styles.message} ${styles.alert}`}>
            ⚠️ Indicou risco/lesão. Fale com a Paloma antes de treinar se dor persistir.
          </div>
        )}
        {aiLoading && (
          <div className={`${styles.message} ${styles.ai}`}>
            <span className={styles.aiTyping}>Assistente da Paloma analisando...</span>
          </div>
        )}
      </div>

      {currentStep < steps.length && (
        <form
          className={styles.inputRow}
          onSubmit={(event) => {
            event.preventDefault();
            handleSend();
          }}
        >
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Digite sua resposta e pressione Enter"
          />
          <button type="submit" className={styles.sendButton}>
            Enviar
          </button>
        </form>
      )}
      {inputError && <div className={styles.error}>{inputError}</div>}

      {currentStep >= steps.length && (
        <div className={styles.leadForm}>
          <div className={styles.formGrid}>
            <label>
              Nome
              <input
                value={contact.name}
                onChange={(e) => setContact({ ...contact, name: e.target.value })}
                placeholder="Seu nome"
              />
            </label>
            <label>
              E-mail
              <input
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                placeholder="voce@email.com"
              />
            </label>
            <label>
              WhatsApp
              <input
                value={contact.phone}
                onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                placeholder="+55 (11) 98765-4321"
                inputMode="tel"
              />
            </label>
            <label>
              Plano escolhido
              <select
                value={contact.plan}
                onChange={(e) => setContact({ ...contact, plan: e.target.value })}
              >
                {planOptions.map((plan) => (
                  <option key={plan} value={plan}>
                    {plan}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={contact.consent}
              onChange={(e) => setContact({ ...contact, consent: e.target.checked })}
            />
            Aceito o uso dos dados para receber meu plano e contato da Paloma.
          </label>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.primary}
              onClick={submitLead}
              disabled={status === "sending"}
            >
              {status === "sending" ? "Enviando..." : "Enviar ficha para a Paloma"}
            </button>
            <Link className={styles.secondary} href={checkoutLinks[contact.plan] || "#"} target="_blank">
              Ir para checkout
            </Link>
          </div>
          {serverMessage && (
            <div className={status === "sent" ? styles.success : styles.error}>
              {serverMessage}
            </div>
          )}
          <div className={styles.summaryBox}>
            <p className={styles.label}>Resumo Método 30</p>
            <ul className={styles.list}>
              <li>{summary().systems}</li>
              <li>{summary().intensity}</li>
              <li>{summary().density}</li>
              <li>{summary().volume}</li>
              <li>{summary().technique}</li>
              <li>Local/equipamentos: {summary().equipment}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
