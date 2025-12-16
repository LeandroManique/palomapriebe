"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./ChatSimulator.module.css";

type Message = { from: "ai" | "user"; text: string };

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
    { from: "ai", text: "Oi! Sou o assistente da Paloma. Vamos conversar de forma livre para entender seu contexto e montar um plano seguro e Metodo 30." },
  ]);
  const [input, setInput] = useState("");
  const [riskFlag, setRiskFlag] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [contact, setContact] = useState(defaultContact);
  const [inputError, setInputError] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const chatRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed.messages ?? messages);
        setRiskFlag(parsed.riskFlag ?? false);
        setContact(parsed.contact ?? defaultContact);
        setShowLeadForm(parsed.showLeadForm ?? false);
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
        JSON.stringify({ messages, riskFlag, contact, showLeadForm }),
      );
    }
  }, [messages, riskFlag, contact, showLeadForm]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  function resetChat() {
    setMessages([
      { from: "ai", text: "Oi! Sou o assistente da Paloma. Vamos conversar de forma livre para entender seu contexto e montar um plano seguro e Metodo 30." },
    ]);
    setRiskFlag(false);
    setInput("");
    setStatus("idle");
    setServerMessage(null);
    setContact(defaultContact);
    setInputError(null);
    setShowLeadForm(false);
  }

  async function handleSend(value?: string) {
    const text = (value ?? input).trim();
    if (!text) return;
    setInputError(null);
    pushMessage({ from: "user", text });
    setInput("");
    if (detectRisk(text)) setRiskFlag(true);
    await callAi(text);
  }

  function detectRisk(text: string) {
    const lowered = text.toLowerCase();
    const triggers = ["dor", "lesao", "lesão", "cirurgia", "cardiaco", "cardíaco", "fratura", "inflamacao", "inflamação"];
    return triggers.some((w) => lowered.includes(w));
  }

  function pushMessage(msg: Message) {
    setMessages((prev) => [...prev, msg]);
  }

  async function callAi(userText: string) {
    try {
      setAiLoading(true);
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: userText,
          riskFlag,
          history: messages,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Erro na IA");
      if (json.reply) {
        pushMessage({ from: "ai", text: json.reply });
      }
    } catch (error) {
      console.error(error);
      pushMessage({
        from: "ai",
        text: "Nao entendi bem. Pode explicar de outro jeito?",
      });
    } finally {
      setAiLoading(false);
    }
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
      answers: {},
      summary: {},
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
          <p className={styles.meta}>Conversa livre · Metodo 30</p>
        </div>
        <div className={styles.chatHeaderRight}>
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
            Indicou risco/lesao. Fale com a Paloma antes de treinar se dor persistir.
          </div>
        )}
        {aiLoading && (
          <div className={`${styles.message} ${styles.ai}`}>
            <span className={styles.aiTyping}>Assistente da Paloma analisando...</span>
          </div>
        )}
      </div>

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
      {inputError && <div className={styles.error}>{inputError}</div>}

      <div className={styles.actions} style={{ marginTop: "12px" }}>
        {!showLeadForm && (
          <button
            type="button"
            className={styles.primary}
            onClick={() => setShowLeadForm(true)}
          >
            Enviar meus dados para a Paloma
          </button>
        )}
      </div>

      {showLeadForm && (
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
        </div>
      )}
    </div>
  );
}
