<script setup>
import PrimaryButton from '../components/PrimaryButton.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const handleToggle = () => {
  router.push('/login')
}
</script>
<template>
    <div class="page">
        <!-- NAVBAR -->
        <nav class="navbar">
            <div class="container navbar-container">
                <h1 class="logo">Finanzas Pro</h1>

                <div class="nav-actions">
                    <button @click="handleToggle" class="login-btn">
                        Login
                    </button>

                    <PrimaryButton variant="dark" :fullWidth="false">
                        Registrarse
                    </PrimaryButton>
                </div>
            </div>
        </nav>

        <!-- HERO -->
        <header class="hero">
            <div class="container hero-content">
                <div class="hero-text">
                    <h1>
                        Domina tu dinero con
                        <span>claridad total</span>
                    </h1>

                    <p>
                        La forma más simple y minimalista de gestionar tus gastos,
                        ahorros e inversiones sin complicaciones.
                    </p>
                </div>

                <PrimaryButton variant="dark" :fullWidth="false" class="hero-cta">
                    Comienza ahora
                </PrimaryButton>

                <div class="hero-image-wrapper">
                    <div class="hero-blur"></div>

                    <img class="hero-image"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhSdr3412gsvA0rLcs1Ji_3sqFJWR7imLloyUONbn6WmT7Pd0B0vVjYVIJKJI3KU2XJ1ZnSYLwAT4xtxzBYxt7SZd6emKuKZnVhRsLKVHnxMgb8EblWahMw9HcC2prQkB8n92zsS1zHBcs1KiEFjrQg9cldI_r-txMuvouGGZr8c7qrtofVQzlMEe2qwfMsr-uQ60feFxffq9JF5zuhyPUUNUAZXnQHSJkwnpGk0fyAhC5344DWEToOq40_vKmnARReqKU5L3dFna8"
                        alt="Dashboard" />
                </div>
            </div>
        </header>

        <!-- BENEFICIOS -->
        <section class="benefits">
            <div class="container benefits-grid">
                <div class="benefit-card">
                    <div class="icon-box">
                        <span class="material-symbols-outlined">
                            account_balance_wallet
                        </span>
                    </div>

                    <h3>Todo en un lugar</h3>

                    <p>
                        Centraliza tus cuentas y tarjetas para tener una visión 360
                        de tu salud financiera.
                    </p>
                </div>

                <div class="benefit-card">
                    <div class="icon-box">
                        <span class="material-symbols-outlined">
                            insights
                        </span>
                    </div>

                    <h3>Análisis real</h3>

                    <p>
                        Reportes visuales automáticos que te dicen exactamente
                        a dónde va tu dinero.
                    </p>
                </div>

                <div class="benefit-card">
                    <div class="icon-box">
                        <span class="material-symbols-outlined">
                            verified_user
                        </span>
                    </div>

                    <h3>Privacidad total</h3>

                    <p>
                        Tus datos están protegidos con estándares de seguridad
                        de nivel bancario.
                    </p>
                </div>
            </div>
        </section>

        <!-- FOOTER -->
        <footer class="footer">
            <div class="container footer-top">
                <div>
                    <h2>Finanzas Pro</h2>

                    <p>
                        Menos estrés, mejor futuro financiero.
                    </p>
                </div>

                <div class="footer-links">
                    <a href="#">Privacidad</a>
                    <a href="#">Términos</a>
                    <span>contacto@finanzaspro.example.com</span>
                </div>
            </div>

            <div class="container footer-bottom">
                <p>
                    © 2024 Finanzas Pro. Todos los derechos reservados.
                </p>
            </div>
        </footer>
    </div>
</template>

<script setup>
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Work+Sans:wght@400;500;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.page {
    background: #f8f9ff;
    color: #0b1c30;
    overflow-x: hidden;
    min-height: 100vh;
    font-family: 'Work Sans', sans-serif;
}

.container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 32px;
}


.navbar {
    position: fixed;
    top: 0;
    width: 100%;
    height: 80px;
    background: rgba(248, 249, 255, 0.82);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(198, 198, 205, 0.2);
    z-index: 1000;
}

.navbar-container {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.logo {
    font-family: 'Manrope', sans-serif;
    font-size: 32px;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -1px;
}

.nav-actions {
    display: flex;
    align-items: center;
    gap: 32px;
}

.login-btn {
    background: transparent;
    border: none;
    font-size: 16px;
    color: #45464d;
    cursor: pointer;
    transition: 0.2s;
}

.login-btn:hover {
    color: #0f172a;
}

.hero {
    padding-top: 100px;
    padding-bottom: 130px;
}

.hero-cta {
  margin: 42px auto 0;
  padding: 0 42px;
}

.hero-content {
    text-align: center;
}

.hero-text {
    max-width: 900px;
    margin: 0 auto;
}

.hero-text h1 {
    font-family: 'Manrope', sans-serif;
    font-size: 76px;
    line-height: 1.05;
    font-weight: 800;
    letter-spacing: -3px;
    color: #0f172a;
}

.hero-text span {
    color: #006a61;
}

.hero-text p {
    margin-top: 34px;
    font-size: 22px;
    line-height: 1.7;
    color: #45464d;
}



.hero-image-wrapper {
    position: relative;
    margin-top: 72px;
}

.hero-blur {
    position: absolute;
    inset: 0;
    background: rgba(0, 106, 97, 0.08);
    filter: blur(120px);
    z-index: 0;
}

.hero-image {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 900px;
    border-radius: 24px;
    border: 1px solid rgba(198, 198, 205, 0.3);
    box-shadow: 0 20px 50px rgba(15, 23, 42, 0.15);
}



.benefits {
    padding: 90px 0;
    border-top: 1px solid rgba(198, 198, 205, 0.15);
}

.benefits-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 60px;
}

.benefit-card {
    display: flex;
    flex-direction: column;
}

.icon-box {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: rgba(0, 106, 97, 0.08);
    color: #006a61;
    display: flex;
    align-items: center;
    justify-content: center;
}

.material-symbols-outlined {
    font-size: 22px;
}

.benefit-card h3 {
    margin-top: 24px;
    font-family: 'Manrope', sans-serif;
    font-size: 34px;
    line-height: 1.3;
    font-weight: 600;
    letter-spacing: -1px;
    color: #0f172a;
}

.benefit-card p {
    margin-top: 18px;
    color: #45464d;
    font-size: 18px;
    line-height: 1.7;
}

/* FOOTER */

.footer {
    background: white;
    border-top: 1px solid rgba(198, 198, 205, 0.3);
    padding-top: 70px;
}

.footer-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 40px;
    padding-bottom: 50px;
}

.footer-top h2 {
    font-family: 'Manrope', sans-serif;
    font-size: 34px;
    color: #0f172a;
}

.footer-top p {
    margin-top: 12px;
    color: #45464d;
}

.footer-links {
    display: flex;
    align-items: center;
    gap: 32px;
    color: #45464d;
}

.footer-links a {
    color: inherit;
    text-decoration: none;
}

.footer-bottom {
    border-top: 1px solid rgba(198, 198, 205, 0.2);
    padding: 30px 32px;
}

.footer-bottom p {
    color: #45464d;
}



@media (max-width: 960px) {
    .hero-text h1 {
        font-size: 54px;
    }

    .benefits-grid {
        grid-template-columns: 1fr;
        gap: 50px;
    }

    .footer-top {
        flex-direction: column;
        align-items: flex-start;
    }

    .footer-links {
        flex-direction: column;
        align-items: flex-start;
    }
}

@media (max-width: 640px) {
    .hero {
        padding-top: 180px;
    }

    .hero-text h1 {
        font-size: 42px;
    }

    .hero-text p {
        font-size: 18px;
    }

    .navbar-container {
        flex-direction: column;
        justify-content: center;
        gap: 10px;
    }

    .navbar {
        height: 100px;
    }
}
</style>
