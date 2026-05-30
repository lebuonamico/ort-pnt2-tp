<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <footer class="footer">
    <div class="container footer-top">
      <div>
        <h2>Finanzas Pro</h2>

        <p>
          Menos estrés, mejor futuro financiero.
        </p>
      </div>

      <div class="footer-links">
        <RouterLink v-if="route.name !== 'privacy-policy'" to="/privacidad">Privacidad</RouterLink>
        <a v-if="route.name !== 'terms'" href="#">Términos</a>
        <span>contacto@finanzaspro.example.com</span>
      </div>
    </div>

    <div class="container footer-bottom">
      <p>
        © 2024 Finanzas Pro. Todos los derechos reservados.
      </p>
    </div>
  </footer>
</template>

<style scoped>
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
}

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
  .footer-top {
    flex-direction: column;
    align-items: flex-start;
  }

  .footer-links {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
