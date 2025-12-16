import Image from "next/image";
import Link from "next/link";
import ChatSimulator from "@/components/ChatSimulator";
import styles from "./page.module.css";

const methodQuick = [
  "Foco no estimulo certo, nao no relogio",
  "Densidade alta para pouco tempo",
  "Seguranca primeiro: risco identificado, treino bloqueado",
  "Plano revisado pela Paloma antes de iniciar",
];

const howSteps = [
  { title: "Fale comigo", text: "Chat rapido (4-6 min) no seu idioma." },
  { title: "Revisao humana", text: "Paloma aplica o Metodo 30 ao seu caso." },
  { title: "Comece seguro", text: "Plano aprovado; WhatsApp so para alunos ativos." },
];

const plans = [
  {
    name: "Impulso – 1 mes",
    highlight: "Treino personalizado em 30 min adaptado a voce",
    bullets: [
      "Anamnese completa (historico, rotina, restricoes)",
      "1 plano de treino personalizado",
      "Suporte WhatsApp seg–sex, 7h as 20h",
    ],
    price: "R$ 347",
    checkoutLabel: "https://pay.kiwify.com.br/aDkvKsP",
  },
  {
    name: "Transformacao – 3 meses",
    highlight: "Evolucao mensal com ajuste fino ao vivo",
    bullets: [
      "Anamnese inicial",
      "3 planos mensais ajustados conforme evolucao",
      "Suporte WhatsApp seg–sex, 7h as 20h",
      "Bonus: 1 sessao ao vivo de 20 min",
    ],
    price: "R$ 897",
    checkoutLabel: "https://pay.kiwify.com.br/ip9vDaA",
  },
  {
    name: "Ano de Resultados – 12 meses",
    highlight: "12 planos mensais com revisao constante",
    bullets: [
      "12 planos mensais (ciclos trimestrais)",
      "1 videochamada ao vivo por mes (20 min)",
      "Suporte WhatsApp seg–sex, 7h as 20h",
      "Bonus: 1 sessao extra ao vivo (20 min)",
    ],
    price: "R$ 2.988",
    checkoutLabel: "https://pay.kiwify.com.br/VSlcZbV",
  },
  {
    name: "Mentoria Premium – 12 meses",
    highlight: "Chamadas quinzenais + ajustes semanais",
    bullets: [
      "Chamadas quinzenais de acompanhamento global",
      "Ajustes semanais dos treinos conforme evolucao",
      "Suporte proximo seg–sex, 7h as 20h",
      "Limitado a 10 vagas",
    ],
    price: "R$ 5.997/ano (ate 12x)",
    checkoutLabel: "https://pay.kiwify.com.br/VedueGN",
  },
];

const extras = [
  {
    name: "Ajuste expresso (reprogramacao de plano no ciclo)",
    price: "R$ 79",
    checkout: "https://pay.kiwify.com.br/dRC2gsT",
  },
  {
    name: "Treino de viagem (14 dias)",
    price: "R$ 129",
    checkout: "https://pay.kiwify.com.br/eVlfoer",
  },
  {
    name: "Sessao extra ao vivo (20 min)",
    price: "R$ 119",
    checkout: "https://pay.kiwify.com.br/obiSvQv",
  },
];

const faq = [
  { q: "O chat entrega treino pronto?", a: "Nao. Ele coleta e envia para a Paloma revisar." },
  { q: "Quanto tempo para receber?", a: "Ate 24h uteis apos enviar a ficha." },
  { q: "Tenho dor/lesao", a: "O chat marca risco e a Paloma fala antes de qualquer treino." },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroText}>
          <div className={styles.badges}>
            <span className={styles.badgePrimary}>Metodo 30</span>
            <span className={styles.badgeMuted}>Revisao 1:1 pela Paloma</span>
          </div>
          <h1>Treino preciso: cada minuto faz voce evoluir.</h1>
          <p className={styles.subtitle}>
            Paloma Priebe, 20 anos e 100+ alunos, aplica o Metodo 30 para mapear sua rotina, restricoes e objetivos.
            Ela escreve e revisa o plano antes de liberar, calibrando intensidade, volume e execucao para voce ter
            resultado com seguranca.
          </p>
          <div className={styles.heroMeta}>
            <span>4-6 min de ficha</span>
            <span>Paloma responde em ate 24h uteis</span>
            <span>Dados usados apenas no seu plano</span>
          </div>
          <div className={styles.ctas}>
            <a className={styles.primary} href="#chat">
              Comecar agora
            </a>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.photoShell}>
            <div className={styles.photoTag}>20 anos presencial</div>
            <div className={styles.photoPlaceholder}>
              <Image
                src="/paloma.jpg"
                alt="Paloma Priebe"
                fill
                className={styles.photoImg}
                sizes="(max-width: 768px) 100vw, 460px"
                priority
              />
            </div>
            <div className={styles.photoFooter}>
              <strong>Paloma Priebe</strong><br />
              Especialista em prescricao e acompanhamento individual<br />
              Cofundadora RAWN PRO · CREF 018391-G/RS
            </div>
          </div>
        </div>
      </header>

      <section className={styles.methodSection} id="metodo30">
        <div className={styles.sectionHeaderCompact}>
          <div className={styles.methodHeaderRow}>
            <p className={styles.eyebrow}>METODO 30 ®</p>
            <Link className={styles.articleInline} href="/metodo-30">
              Artigo cientifico →
            </Link>
          </div>
          <h2>Mentoria de treino enxuta</h2>
          <p className={styles.sectionSubtitle}>
            Nao e “treino rapido”. E pensar certo para usar bem cada minuto.
          </p>
        </div>
        <div className={styles.methodGrid}>
          <div className={styles.cardTall}>
            <p className={styles.cardLabel}>Essencia</p>
            <ul className={styles.list}>
              {methodQuick.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className={styles.cardTall}>
            <p className={styles.cardLabel}>O que nao e</p>
            <ul className={styles.list}>
              <li>Protocolo fixo</li>
              <li>HIIT obrigatorio</li>
              <li>“Treino pronto em 30 min”</li>
              <li>Sem avaliacao profissional</li>
            </ul>
          </div>
          <div className={styles.cardTall}>
            <p className={styles.cardLabel}>Como pensamos</p>
            <ul className={styles.list}>
              <li>Qual sistema vamos estimular hoje?</li>
              <li>Qual intensidade segura para voce?</li>
              <li>Qual volume minimo eficaz?</li>
              <li>Como garantir execucao boa?</li>
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.stepsSection} id="como-funciona">
        <div className={styles.sectionHeaderCompact}>
          <p className={styles.eyebrow}>Simples assim</p>
          <h2>3 passos</h2>
        </div>
        <div className={styles.stepsGrid}>
          {howSteps.map((step) => (
            <div key={step.title} className={styles.card}>
              <p className={styles.cardLabel}>{step.title}</p>
              <p className={styles.cardBody}>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.plansSection} id="plans">
        <div className={styles.sectionHeaderCompact}>
          <p className={styles.eyebrow}>Planos</p>
          <h2>Escolha o plano que combina com sua jornada</h2>
          <p className={styles.sectionSubtitle}>
            Objetivo desafiador ou lesao? Premium com reuniao quinzenal. Progresso consistente? Anual. Retomada? Trimestral ou Mensal.
            Viagem ou agenda apertada? 14 dias.
          </p>
        </div>
        <div className={styles.planGrid}>
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`${styles.planCard} ${
                index === 0 ? styles.planCardFeatured : ""
              }`}
            >
              <div className={styles.planHead}>
                <p className={styles.planName}>{plan.name}</p>
                <p className={styles.planHighlight}>{plan.highlight}</p>
              </div>
              {plan.price && <p className={styles.planPrice}>{plan.price}</p>}
              <ul className={styles.list}>
                {plan.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className={styles.planActions}>
                <a className={styles.primaryGhost} href="#chat">
                  Comecar agora
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.extras}>
          <p className={styles.eyebrow}>Extras opcionais</p>
          <ul className={styles.list}>
          {extras.map((extra) => (
            <li key={extra.name} className={styles.extraItem}>
              <div>
                <span className={styles.extraName}>{extra.name}</span>{" "}
                <span className={styles.extraPrice}>{extra.price}</span>
              </div>
              <Link className={styles.primaryGhost} href={extra.checkout}>
                Agendar
              </Link>
            </li>
          ))}
          </ul>
        </div>
      </section>

      <section className={styles.chatSection} id="chat">
        <div className={styles.sectionHeaderCompact}>
          <p className={styles.eyebrow}>Chat + Paloma</p>
          <h2>Anamnese guiada por IA cientifica</h2>
          <p className={styles.sectionSubtitle}>
            Perguntas especificas (local de treino, rotina, alimentacao, lesoes, sabotadores). IA treinada no Metodo 30,
            mas quem aprova e acompanha e a Paloma. WhatsApp so apos contratacao.
          </p>
        </div>
        <div className={styles.chatLayout}>
          <div className={styles.chatSummary}>
            <p className={styles.cardLabel}>O que rola</p>
            <ul className={styles.list}>
              <li>Foco: objetivo, rotina, local/equipamentos, sono/estresse, alimentacao, sabotadores</li>
              <li>Marca lesao/dor e bloqueia qualquer treino automatico</li>
              <li>Paloma revisa e devolve em ate 24h uteis</li>
              <li>Checkout ao final; WhatsApp liberado para alunos ativos</li>
            </ul>
          </div>
          <ChatSimulator />
        </div>
      </section>

      <section className={styles.faqSection} id="faq">
        <div className={styles.sectionHeaderCompact}>
          <p className={styles.eyebrow}>Duvidas</p>
          <h2>Respostas rapidas</h2>
        </div>
        <div className={styles.faqGrid}>
          {faq.map((item) => (
            <div key={item.q} className={styles.card}>
              <p className={styles.cardLabel}>{item.q}</p>
              <p className={styles.cardBody}>{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <div>
          <p className={styles.eyebrow}>Paloma Priebe</p>
          <p className={styles.footerText}>
            Treino remoto com olhar humano. Metodo 30 para quem quer eficiencia e seguranca.
          </p>
        </div>
        <div className={styles.footerActions}>
          <a className={styles.primary} href="#chat">
            Comecar agora
          </a>
        </div>
      </footer>
    </div>
  );
}
