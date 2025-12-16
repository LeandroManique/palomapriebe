import Link from "next/link";
import styles from "../page.module.css";

const references = [
  "Gibala MJ, Little JP et al. Physiological adaptations to interval training (2006-2012).",
  "Buchheit M, Laursen PB. High-intensity interval training - solutions to common problems (2013).",
  "Weston KS et al. Systematic review/meta-analysis of HIIT vs MICT (2014).",
  "Meta-análises: protocolos curtos aumentam adesão em médio prazo.",
];

export default function Metodo30Article() {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroText}>
          <div className={styles.badges}>
            <span className={styles.badgePrimary}>Artigo científico</span>
            <span className={styles.badgeMuted}>Autoria: Paloma Priebe</span>
          </div>
          <h1>Método 30™ - Mentalidade de treino baseada em evidência</h1>
          <p className={styles.subtitle}>
            20 anos de prática presencial e remota, mais de 100 alunos atendidos, alinhados a consensos científicos sobre
            intensidade relativa, densidade de estímulo e adesão.
          </p>
          <div className={styles.ctas}>
            <Link className={styles.primary} href="/">
              Voltar à landing
            </Link>
          </div>
        </div>
      </header>

      <section className={styles.methodSection}>
        <div className={styles.sectionHeaderCompact}>
          <p className={styles.eyebrow}>Princípio fundador</p>
          <h2>Qualidade de estímulo &gt; tempo absoluto</h2>
          <p className={styles.sectionSubtitle}>
            Adaptação fisiológica depende da intensidade relativa, da densidade e da especificidade. Sessões curtas
            funcionam quando bem organizadas; sessões longas também se beneficiam dessa lógica, evitando ruído e
            fadiga desnecessária.
          </p>
        </div>
      </section>

      <section className={styles.methodGrid}>
        <div className={styles.cardTall}>
          <p className={styles.cardLabel}>O que o Método 30™ não é</p>
          <ul className={styles.list}>
            <li>Não é um protocolo fixo de 30 minutos</li>
            <li>Não é HIIT obrigatório</li>
            <li>Não é “treino rápido para quem não tem tempo”</li>
            <li>Não substitui avaliação profissional</li>
          </ul>
          <p className={styles.cardBody}>
            É uma mentalidade para prescrever estímulos eficientes e seguros, personalizados ao indivíduo.
          </p>
        </div>
        <div className={styles.cardTall}>
          <p className={styles.cardLabel}>Fundamentos</p>
          <ul className={styles.list}>
            <li>Intensidade relativa &gt; minutos no relógio</li>
            <li>Densidade do estímulo determina impacto fisiológico</li>
            <li>Especificidade: o corpo adapta ao estresse aplicado</li>
            <li>Economia biológica: menos volume, menor risco sistêmico</li>
            <li>Adesão: protocolos enxutos aumentam consistência</li>
          </ul>
        </div>
        <div className={styles.cardTall}>
          <p className={styles.cardLabel}>Pilares práticos</p>
          <ul className={styles.list}>
            <li>Definir o sistema a estimular (neuro, cardio, metabólico, técnico)</li>
            <li>Calibrar intensidade relativa segura e eficaz</li>
            <li>Volume mínimo eficaz antes de progredir</li>
            <li>Execução técnica como critério de avanço</li>
            <li>Recuperação e adesão como variáveis científicas</li>
          </ul>
        </div>
      </section>

      <section className={styles.stepsSection}>
        <div className={styles.sectionHeaderCompact}>
          <p className={styles.eyebrow}>Evidência + prática</p>
          <h2>Por que funciona</h2>
          <p className={styles.sectionSubtitle}>
            Alta intensidade relativa pode gerar adaptações comparáveis a volumes maiores. Quando o tempo é curto, a
            organização milimétrica do treino evita ruído e fadiga. Com mais tempo, o método mantém foco, técnica e
            recuperação, evitando dispersão.
          </p>
        </div>
      </section>

      <section className={styles.methodGrid}>
        <div className={styles.cardTall}>
          <p className={styles.cardLabel}>Aplicações</p>
          <ul className={styles.list}>
            <li>Treinos remotos completos</li>
            <li>Fases de pouco tempo ou viagens</li>
            <li>Programas anuais progressivos</li>
            <li>Educação do aluno para treinar com consciência</li>
          </ul>
        </div>
        <div className={styles.cardTall}>
          <p className={styles.cardLabel}>Autoria e casuística</p>
          <p className={styles.cardBody}>
            Paloma Priebe - 20 anos de atendimento presencial e remoto, mais de 100 alunos acompanhados com foco em
            segurança, adesão e performance funcional. Observações práticas alinhadas à literatura de HIIT/MICT, adesão
            e periodização moderna.
          </p>
        </div>
        <div className={styles.cardTall}>
          <p className={styles.cardLabel}>Referências</p>
          <ul className={styles.list}>
            {references.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <footer className={styles.footer}>
        <div>
          <p className={styles.eyebrow}>Método 30™</p>
          <p className={styles.footerText}>
            Mentalidade de treino com base científica e revisão humana. Sem atalhos, sem protocolos genéricos.
          </p>
        </div>
        <div className={styles.footerActions}>
          <Link className={styles.primary} href="/">
            Voltar e iniciar avaliação
          </Link>
        </div>
      </footer>
    </div>
  );
}
