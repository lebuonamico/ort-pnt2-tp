<script setup>
import { useRouter } from 'vue-router'
import { useDate } from '../composables/useDate.js'
import AppFooter from '../components/AppFooter.vue'
const { currentDate } = useDate()
const router = useRouter()

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
    return
  } 

  router.push('/')
}
</script>

<template>
  <div class="privacy-page">


    <main class="policy-main">
      <article class="policy-container">
        <header class="policy-title">
          <h1>Política de Privacidad</h1>

          <p>
            Última actualización: {{ currentDate }}.</p>
          <p> Su privacidad es el pilar
            fundamental de nuestra gestión financiera.</p>
        </header>

        <div class="security-visual">
          <img
            src="../assets/privacy.png"
            alt="Seguridad de datos" />
        </div>

        <section class="policy-content">
          <div class="content-block">
            <h2>1. Compromiso de Confidencialidad</h2>

            <p>
              En <strong>Finanzas Pro</strong>, entendemos que la gestión de sus
              activos requiere una transparencia total sobre el manejo de su
              información. Esta política detalla cómo recopilamos, utilizamos y
              protegemos sus datos personales y financieros bajo los más altos
              estándares de la industria bancaria digital.
            </p>
          </div>

          <div class="content-block">
            <h2>2. Recopilación de Información</h2>

            <p>
              Recopilamos únicamente los datos necesarios para proporcionar una
              visión consolidada de su patrimonio:
            </p>

            <ul class="policy-list">
              <li>
                <span class="material-symbols-outlined">check_circle</span>
                <p>
                  <strong>Identificación:</strong> Nombre, correo electrónico y
                  credenciales de acceso seguras.
                </p>
              </li>

              <li>
                <span class="material-symbols-outlined">check_circle</span>
                <p>
                  <strong>Datos Financieros:</strong> Saldos de cuentas,
                  historial de transacciones y categorización de gastos.
                </p>
              </li>

              <li>
                <span class="material-symbols-outlined">check_circle</span>
                <p>
                  <strong>Metadatos de Uso:</strong> Registros de acceso (fechas,
                  acciones) y datos de uso anónimos que nos ayudan a mejorar el
                  servicio y detectar abusos. No realizamos técnicas de
                  "fingerprinting" ni recopilamos datos biométricos.
                </p>
              </li>
            </ul>
          </div>

          <div class="highlight-card">
            <h3>Medidas de seguridad</h3>

            <p>
              Aplicamos medidas de protección razonables y trabajamos con
              proveedores que emplean cifrado y comunicaciones seguras para proteger
              la información en tránsito y en reposo. Sus datos no se venden a
              terceros; nuestro modelo de negocio se basa en la suscripción.
            </p>
          </div>

          <div class="content-block">
            <h2>3. Uso de la Información</h2>

            <p>
              La información recopilada se utiliza exclusivamente para:
            </p>

            <div class="usage-grid">
              <div class="usage-card">
                <span class="material-symbols-outlined">analytics</span>
                <h3>ANÁLISIS PREDICTIVO</h3>
                <p>
                  Generar proyecciones de ahorro basadas en sus hábitos reales.
                </p>
              </div>

              <div class="usage-card">
                <span class="material-symbols-outlined">security</span>
                <h3>PROTECCIÓN ACTIVA</h3>
                <p>
                  Detectar anomalías en sus movimientos para alertar sobre
                  posibles cargos no autorizados.
                </p>
              </div>
            </div>
          </div>

          <div class="content-block">
            <h2>4. Sus Derechos (GDPR/LFPDPPP)</h2>

            <p>
              Usted mantiene el control sobre sus datos personales. En cualquier
              momento puede ejercer sus derechos de acceso, rectificación,
              cancelación y oposición (ARCO) desde la configuración de su perfil
              o contactando a nuestro Oficial de Privacidad. No realizamos
              fingerprinting ni recopilamos datos biométricos.
            </p>
          </div>
        </section>

        <section class="questions">
          <div>
            <h2>¿Tiene preguntas?</h2>
            <p>
              Estamos aquí para resolver cualquier duda sobre su información. Por favor, contáctenos vía email en
            </p>
            <p style="color: #006a61; font-weight: bold;" >
              legales@finanzaspro.com
            </p>
          </div>
        </section>
      </article>
    </main>
<AppFooter />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Work+Sans:wght@400;500;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

* {
  box-sizing: border-box;
}

.privacy-page {
  min-height: 100vh;
  background: #f8f9ff;
  color: #0b1c30;
  font-family: 'Work Sans', sans-serif;
}

.material-symbols-outlined {
  font-size: 22px;
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
}

.legal-header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(255, 255, 255, 0.84);
  border-bottom: 1px solid #d3e4fe;
  backdrop-filter: blur(14px);
}

.legal-header-inner {
  width: min(1280px, 100%);
  height: 64px;
  margin: 0 auto;
  padding: 0 32px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
}

.back-button {
  width: 40px;
  height: 40px;
  margin-left: -10px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: #45464d;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.back-button:hover {
  background: #eff4ff;
}

.brand-name {
  font-family: 'Manrope', sans-serif;
  font-size: 20px;
  font-weight: 600;
}

.legal-label {
  color: #7c839b;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
}

.policy-main {
  padding: 86px 24px 96px;
}

.policy-container {
  width: min(800px, 100%);
  margin: 0 auto;
}

.policy-title {
  margin-bottom: 72px;
}

.policy-title h1 {
  margin: 0 0 16px;
  font-family: 'Manrope', sans-serif;
  font-size: 32px;
  line-height: 1.2;
}

.policy-title p {
  max-width: 720px;
  margin: 0;
  color: #45464d;
  font-size: 18px;
  line-height: 1.6;
}

.security-visual {
  margin-bottom: 72px;
  overflow: hidden;
  border: 1px solid #0b1c30;
  border-radius: 8px;
  aspect-ratio: 21 / 9;
  background: #d3e4fe;
}

.security-visual img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  opacity: 0.9;
}

.policy-content {
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.content-block h2,
.questions h2 {
  margin: 0 0 18px;
  font-family: 'Manrope', sans-serif;
  font-size: 24px;
  line-height: 1.3;
  font-weight: 600;
}

.content-block p,
.questions p,
.highlight-card p,
.usage-card p,
.policy-list p {
  margin: 0;
  color: #45464d;
  font-size: 16px;
  line-height: 1.65;
}

.content-block strong,
.policy-list strong {
  color: #0b1c30;
}

.policy-list {
  margin: 26px 0 0;
  padding: 0 0 0 26px;
  border-left: 2px solid #86f2e4;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.policy-list li {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.policy-list .material-symbols-outlined {
  margin-top: 2px;
  color: #006a61;
  font-size: 20px;
}

.highlight-card {
  padding: 32px;
  border: 1px solid #d3e4fe;
  border-radius: 8px;
  background: #eff4ff;
}

.highlight-card h3 {
  margin: 0 0 14px;
  color: #006a61;
  font-family: 'Manrope', sans-serif;
  font-size: 20px;
  font-weight: 600;
}

.usage-grid {
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.usage-card {
  padding: 20px;
  border: 1px solid rgba(198, 198, 205, 0.5);
  border-radius: 8px;
  background: #ffffff;
}

.usage-card .material-symbols-outlined {
  margin-bottom: 10px;
  color: #009668;
}

.usage-card h3 {
  margin: 0 0 8px;
  color: #0b1c30;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.usage-card p {
  font-size: 14px;
}

.questions {
  margin-top: 56px;
  padding: 48px 0 80px;
  border-top: 1px solid #d3e4fe;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
}

.questions h2 {
  margin-bottom: 8px;
  font-size: 20px;
}

.support-button {
  min-width: 224px;
  height: 48px;
  padding: 0 22px;
  border-radius: 8px;
  background: #006a61;
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.support-button:hover {
  background: #005049;
}

.legal-footer {
  padding: 32px 24px;
  border-top: 1px solid #d3e4fe;
  background: #ffffff;
  text-align: center;
}

.legal-footer p {
  width: min(1280px, 100%);
  margin: 0 auto;
  color: #7c839b;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  line-height: 1.5;
}

@media (max-width: 760px) {
  .legal-header-inner {
    padding: 0 20px;
  }

  .legal-label {
    display: none;
  }

  .policy-main {
    padding: 56px 20px 72px;
  }

  .policy-title,
  .security-visual {
    margin-bottom: 48px;
  }

  .policy-title h1 {
    font-size: 28px;
  }

  .policy-title p {
    font-size: 16px;
  }

  .usage-grid,
  .questions {
    grid-template-columns: 1fr;
  }

  .questions {
    flex-direction: column;
    align-items: flex-start;
  }

  .support-button {
    width: 100%;
  }
}
</style>
