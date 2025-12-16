"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./ChatSimulator.module.css";

type Message = {
  from: "ai" | "user";
  text: string;
};

const steps = [
  {
    id: "goal",
    prompt: "Qual seu objetivo principal? (ex.: recomposição, força, dor lombar, performance, emagrecimento)",
    quick: ["Força", "Hipertrofia", "Emagrecimento", "Voltar a treinar"],
    followUp: "O que é sucesso pra você? (ex.: roupa que quer vestir, prova, dor que quer eliminar)",
  },
  {
    id: "history",
    prompt: "Histórico de treino e lesões? (experiência, cirurgias, limitações atuais)",
    quick: ["Sou iniciante", "Treino há 1-2 anos", "Lesão prévia", "Sem lesões"],
    followUp: "Conte onde doeu, quando, o que piora/melhora e se tem liberação médica.",
  },
  {
    id: "availability",
    prompt: "Quantos dias e quanto tempo por sessão você tem? (ex.: 3x/semana, 30-40 min)",
    quick: ["2x/sem", "3x/sem", "4x/sem", "30-40 min"],
    followUp: "Quais dias e horários são reais pra você? Melhor manhã/tarde/noite?",
  },
  {
    id: "location",
    prompt: "Onde vai treinar? (academia, condomínio, casa, viagem)",
    quick: ["Academia", "Casa", "Condomínio", "Viagem"],
    followUp: "Se for viagem/casa/condomínio, descreva o espaço e limitações.",
  },
  {
    id: "equipment",
    prompt: "Quais equipamentos você tem? (academia completa, halteres, elástico, peso corporal)",
    quick: ["Academia", "Halteres + elástico", "Peso corporal"],
    followUp: "Liste pesos, elásticos, banco, barra, anilhas. Tem algo que evita usar?",
  },
  {
    id: "effort",
    prompt: "Como percebe seu esforço? (leve, moderado, forte) e como responde a cargas/intensidade?",
    quick: ["Moderado", "Forte", "Leve"],
    followUp: "Já passou mal em treino intenso? Como reage a cardio forte ou séries longas?",
  },
  {
    id: "recovery",
    prompt: "Sono, estresse e recuperação: como estão? Alguma contraindicação médica atual?",
    quick: ["Sono ok", "Sono ruim", "Estresse alto"],
    followUp: "Quantas horas de sono? Acorda cansado? Usa medicação? Médicos liberaram treino?",
  },
  {
    id: "nutrition",
    prompt: "Como está sua alimentação hoje? (organizada, irregular, restrições) e hidratação?",
    quick: ["Organizada", "Irregular", "Restrição alimentar"],
    followUp: "Faz refeições fora? Usa suplemento? Bebe quanta água por dia?",
  },
  {
    id: "work",
    prompt: "Qual sua rotina de trabalho/estudos? Turnos, deslocamentos e horários que atrapalham treinar?",
    quick: ["Escritório", "Home office", "Turnos", "Muita viagem"],
    followUp: "Em quais dias fica mais cansado? Qual janela de tempo é realista para treino?",
  },
  {
    id: "obstacles",
    prompt: "Quais sabotadores te fazem faltar? (sono, tempo, motivação, dor, logística)",
    quick: ["Tempo", "Sono", "Logística", "Motivação"],
    followUp: "O que mais te derruba na semana? O que já funcionou para não faltar?",
  },
  {
    id: "preferences",
    prompt: "Preferências ou restrições de movimentos? Algo que não gosta ou não pode fazer?",
    quick: ["Sem restrições", "Evitar impacto", "Evitar overhead"],
    followUp: "Liste movimentos que prefere evitar e o que gosta. Algum medo específico?",
  },
];

const storageKey = "paloma-chat-preview";

const checkoutLinks: Record<string, string> = {
  "Impulso – 1 mes": "https://pay.kiwify.com.br/aDkvKsP",
  "Transformacao – 3 meses": "https://pay.kiwify.com.br/ip9vDaA",
  "Ano de Resultados – 12 meses": "https://pay.kiwify.com.br/VSlcZbV",
  "Mentoria Premium – 12 meses": "https://pay.kiwify.com.br/VedueGN",
  "Treino de viagem (14 dias)": "https://pay.kiwify.com.br/eVlfoer",
  "Sessao extra ao vivo (20 min)": "https://pay.kiwify.com.br/obiSvQv",
  "Ajuste expresso": "https://pay.kiwify.com.br/dRC2gsT",
};

const defaultContact = {
  name: "",
  email: "",
  phone: "",
  plan: "Impulso – 1 mes",
  consent: false,
};

const defaultMessages: Message[] = [
  {
    from: "ai",
    text: "Oi! Sou o assistente da Paloma. Vou guiar uma anamnese rápida (4–6 min) usando o Método 30™. Nada de treino pronto aqui: tudo é revisado por ela antes de você começar.",
  },
  { from: "ai", text: steps[0].prompt },
];

function detectRisk(text: string) {
  const lowered = text.toLowerCase();
  const triggers = ["dor", "lesão", "cirurgia", "fissura", "fratura", "inflamação", "cardíaco", "pressão alta"];
  return triggers.some((word) => lowered.includes(word));
}

export default function ChatSimulator() {
  const [messages, setMessages] = useState<Message[]>(defaultMessages);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [input, setInput] = useState("");
  const [riskFlag, setRiskFlag] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [contact, setContact] = useState(defaultContact);
  const [awaitingDetail, setAwaitingDetail] = useState<string | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const [showModal, setShowModal] = useState(false);

  function resetChat() {
    setMessages(defaultMessages);
    setCurrentStep(0);
    setAnswers({});
    setRiskFlag(false);
    setInput("");
    setStatus("idle");
    setServerMessage(null);
    setContact(defaultContact);
    setAwaitingDetail(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(storageKey);
    }
  }

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed.messages ?? defaultMessages);
        setCurrentStep(parsed.currentStep ?? 0);
        setAnswers(parsed.answers ?? {});
        setRiskFlag(parsed.riskFlag ?? false);
        setContact(parsed.contact ?? defaultContact);
      } catch (error) {
        console.error("Erro ao carregar estado do chat", error);
      }
    }
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

  function pushMessage(msg: Message) {
    setMessages((prev) => [...prev, msg]);
  }

  function goToNextStep(nextIndex: number) {
    if (nextIndex < steps.length) {
      pushMessage({ from: "ai", text: steps[nextIndex].prompt });
    } else {
      pushMessage({
        from: "ai",
        text: "Resumo gerado pelo Método 30™. Revise os dados, escolha o plano e envie para a Paloma revisar. Sem entrega automática de treino.",
      });
    }
  }

  function handleSend(value?: string) {
    const text = (value ?? input).trim();
    if (!text) return;

    // If we are waiting for a follow-up detail of the current step
    if (awaitingDetail) {
      pushMessage({ from: "user", text });
      setAnswers((prev) => ({ ...prev, [`${awaitingDetail}Detail`]: text }));
      setInput("");
      if (detectRisk(text)) setRiskFlag(true);

      const nextStep = currentStep + 1;
      setAwaitingDetail(null);
      setCurrentStep(nextStep);
      setTimeout(() => goToNextStep(nextStep), 150);
      return;
    }

    const step = steps[currentStep];
    pushMessage({ from: "user", text });
    setAnswers((prev) => ({ ...prev, [step.id]: text }));
    setInput("");
    if (detectRisk(text)) setRiskFlag(true);

    if (step.followUp) {
      pushMessage({ from: "ai", text: step.followUp });
      setAwaitingDetail(step.id);
      return;
    }

    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    setTimeout(() => goToNextStep(nextStep), 150);
  }

  function summary() {
    const equipment =
      answers.equipmentDetail || answers.equipment || answers.locationDetail || answers.location || "a definir";
    return {
      systems: answers.goal
        ? `Foco em ${answers.goal}; ajustar estímulo para sistemas neuromuscular e cardiovascular conforme resposta individual.`
        : "Definir sistemas-alvo após meta principal.",
      intensity:
        answers.effort || answers.history
          ? "Intensidade relativa calibrada pelo RPE; sessões mais curtas se a densidade subir."
          : "Calibrar intensidade relativa individual.",
      density:
        answers.availability && answers.availability.includes("30")
          ? "Sessões compactas pedem densidade alta e organização precisa."
          : "Estruturar blocos para maximizar trabalho/tempo disponível.",
      volume: "Volume mínimo eficaz; progredir quando técnica e recuperação estiverem sólidas.",
      technique: "Checkpoints técnicos e consciência de movimento antes de aumentar carga.",
      equipment,
    };
  }

  async function submitLead() {
    if (!contact.name || !contact.email || !contact.phone || !contact.consent) {
      setServerMessage("Preencha nome, e-mail, WhatsApp e aceite o uso dos dados.");
      setStatus("error");
      return;
    }
    setStatus("sending");
    setServerMessage(null);
    const payload = {
      answers,
      contact,
      riskFlag,
      meta: {
        eta: "24h úteis",
        method: "Metodo 30",
        source: "landing",
      },
      summary: summary(),
    };

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.message || "Erro ao enviar ficha.");
      }
      setStatus("sent");
      setServerMessage(json?.message || "Ficha enviada para a Paloma revisar.");
      setShowModal(true);
    } catch (error: unknown) {
      console.error(error);
      setStatus("error");
      setServerMessage("Falha ao enviar. Tente novamente ou use o botão de WhatsApp.");
    }
  }

  const checkoutLink = checkoutLinks[contact.plan] || "https://kiwify.com/checkout-placeholder";

  function formatPhone(raw: string) {
    let digits = raw.replace(/\D/g, "");
    if (digits.startsWith("55")) digits = digits.slice(2);
    digits = digits.slice(0, 11); // limita a 11 dígitos após DDI
    const ddd = digits.slice(0, 2);
    const rest = digits.slice(2);
    let local = rest;
    if (rest.length > 5) {
      local = `${rest.slice(0, 5)}-${rest.slice(5)}`;
    } else if (rest.length > 4) {
      local = `${rest.slice(0, 4)}-${rest.slice(4)}`;
    }
    if (!digits) return "";
    if (ddd && local) return `+55 (${ddd}) ${local}`;
    if (ddd) return `+55 (${ddd})`;
    return `+55 ${local}`;
  }

  return (
    <div className={styles.chatCard}>
      <div className={styles.chatHeader}>
        <div>
          <p className={styles.label}>Chat de anamnese</p>
          <p className={styles.meta}>
            Progresso {Math.min(currentStep, steps.length)}/{steps.length} · {progress}% · Método 30™
          </p>
        </div>
        <button type="button" className={styles.reset} onClick={resetChat}>
          Reiniciar
        </button>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
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
            ⚠️ Indicou risco/lesão. Fale com a Paloma antes de executar qualquer treino.
          </div>
        )}
      </div>

      {currentStep < steps.length && !awaitingDetail && (
        <div className={styles.quickReplies}>
          {steps[currentStep].quick?.map((option) => (
            <button
              key={option}
              className={styles.chip}
              type="button"
              onClick={() => handleSend(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}

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
            placeholder={awaitingDetail ? "Detalhe sua resposta" : "Digite sua resposta e pressione Enter"}
          />
          <button type="submit" className={styles.sendButton}>
            Enviar
          </button>
        </form>
      )}

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
                onChange={(e) => setContact({ ...contact, phone: formatPhone(e.target.value) })}
                placeholder="+55 (11) 98765-4321"
                inputMode="tel"
                pattern="^\\+?\\d[\\d\\s\\(\\)\\-]{7,}$"
              />
              <span className={styles.hint}>Use DDI +55 e DDD. Ex.: +55 (11) 98765-4321</span>
            </label>
            <label>
              Plano escolhido
              <select
                value={contact.plan}
                onChange={(e) => setContact({ ...contact, plan: e.target.value })}
              >
                {Object.keys(checkoutLinks).map((plan) => (
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
            <a className={styles.secondary} href={checkoutLink} target="_blank">
              Ir para checkout Kiwify
            </a>
            <span className={styles.note}>WhatsApp liberado após contratação.</span>
          </div>
      {serverMessage && (
        <div className={status === "sent" ? styles.success : styles.error}>
          {serverMessage}
        </div>
      )}
          <div className={styles.summaryBox}>
            <p className={styles.label}>Resumo Método 30™</p>
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

      {showModal && (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <p className={styles.label}>Resumo Método 30</p>
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setShowModal(false)}
                aria-label="Fechar"
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.cardBody}>
                Premissas científicas aplicadas ao seu caso:
              </p>
              <ul className={styles.list}>
                <li>{summary().systems}</li>
                <li>{summary().intensity}</li>
                <li>{summary().density}</li>
                <li>{summary().volume}</li>
                <li>{summary().technique}</li>
              </ul>
              <p className={styles.modalCopy}>
                Pronto para liberar seu plano com a Paloma? Garanta agora.
              </p>
              <a className={styles.primary} href={checkoutLink} target="_blank" rel="noreferrer">
                Fazer pagamento
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
