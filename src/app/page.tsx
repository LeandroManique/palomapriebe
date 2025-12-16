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

const plans = [
  {
    name: "Impulso - 1 mes",
    highlight: "Treino que encaixa na sua rotina",
    bullets: [
      "Plano de treino ajustado ao seu contexto atual",
      "Suporte via WhatsApp (seg–sex, 7h–20h)",
    ],
    price: "R$ 347",
    checkoutLabel: "https://pay.kiwify.com.br/aDkvKsP",
  },
  {
    name: "Transformacao - 3 meses",
    highlight: "Evolucao com ajustes mensais",
    bullets: [
      "Tres ciclos mensais de treino",
      "Ajustes conforme sua evolucao",
      "Suporte via WhatsApp (seg–sex, 7h–20h)",
      "1 sessao ao vivo (20 min)",
    ],
    price: "R$ 897",
    checkoutLabel: "https://pay.kiwify.com.br/ip9vDaA",
  },
  {
    name: "Ano de Resultados - 12 meses",
    highlight: "Progressao continua ao longo do ano",
    bullets: [
      "Doze planos mensais em ciclos progressivos",
      "Uma sessao ao vivo por mes (20 min)",
      "Suporte via WhatsApp (seg–sex, 7h–20h)",
      "Uma sessao extra ao vivo (20 min)",
    ],
    price: "R$ 2.988",
    checkoutLabel: "https://pay.kiwify.com.br/VSlcZbV",
  },
  {
    name: "Mentoria Premium - 12 meses",
    highlight: "Acompanhamento proximo e estrategico",
    bullets: [
      "Chamadas quinzenais",
      "Ajustes semanais de treino",
      "Suporte direto via WhatsApp",
      "Vagas limitadas (10 alunos)",
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
  { q: "Como recebo o plano?", a: "Apos o checkout, a Paloma faz a anamnese e entrega o plano em ate 24h uteis." },
  { q: "Tem videochamada?", a: "Premium: chamadas quinzenais. Ano de Resultados: 1 chamada mensal de 20 min." },
  { q: "Suporte?", a: "WhatsApp seg-sex, 7h as 20h, com ajustes conforme o plano contratado." },
  { q: "E se eu tiver lesao?", a: "Informe na anamnese. Se for agudo, a Paloma pode solicitar liberacao antes de treinar." },
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
            <span>Planejamento sob medida</span>
            <span>Revisao humana real</span>
            <span>Dados usados apenas no seu plano</span>
          </div>
          <div className={styles.ctas}>
            <a className={styles.primary} href="#chat">
              Comecar anamnese
            </a>
            <a className={styles.secondary} href="#plans">
              Ver planos
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
              <strong>Paloma Priebe</strong>
              <br />
              Especialista em prescricao e acompanhamento individualizado
              <br />
              Cofundadora RAWN PRO - CREF 018391-G/RS
            </div>
          </div>
        </div>
      </header>

      <section className={styles.methodSection} id="metodo30">
        <div className={styles.sectionHeaderCompact}>
          <div className={styles.methodHeaderRow}>
            <p className={styles.eyebrow}>METODO 30(R)</p>
            <Link className={styles.articleInline} href="/metodo-30">
              Artigo cientifico do Metodo 30 &rarr;
            </Link>
          </div>
          <h2>Mentoria de treino enxuta</h2>
          <p className={styles.sectionSubtitle}>
            Nao e "treino rapido". E pensar certo para usar bem cada minuto.
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
              <li>"Treino pronto em 30 min"</li>
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

      <section className={styles.plansSection} id="plans">
        <div className={styles.sectionHeaderCompact}>
          <p className={styles.eyebrow}>Planos</p>
          <h2>Escolha o plano que combina com sua jornada</h2>
          <p className={styles.sectionSubtitle}>
            Objetivo desafiador ou lesao? Premium com reuniao quinzenal. Progresso consistente? Anual. Retomada? Trimestral
            ou Mensal. Viagem ou agenda apertada? 14 dias.
          </p>
        </div>
        <div className={styles.planGrid}>
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`${styles.planCard} ${index === 0 ? styles.planCardFeatured : ""}`}
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
                <Link className={styles.primaryGhost} href="#chat">
                  Comecar agora
                </Link>
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
                <Link className={styles.primaryGhost} href={extra.checkout} target="_blank">
                  Agendar
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.chatSection} id="chat">
        <div className={styles.sectionHeaderCompact}>
          <p className={styles.eyebrow}>Chat IA + Paloma</p>
          <h2>Treino que funciona comeca com clareza</h2>
          <p className={styles.sectionSubtitle}>
            Essa conversa orienta todo o seu plano de treino. Reserve cerca de 10 minutos e responda com calma e atencao.
          </p>
        </div>
        <div className={styles.chatLayout}>
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
            Treino sob medida com olhar humano. Metodo 30 para quem quer eficiencia e seguranca.
          </p>
        </div>
        <div className={styles.footerActions}>
          <a className={styles.primary} href="#chat">
            Comecar anamnese
          </a>
        </div>
      </footer>
    </div>
  );
}
