<!-- layouts/dashboardlayout.vue -->
<template>
  <!-- Aplicamos el fondo oscuro degradado y el color de texto base aquí -->
  <div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100">
    <!-- Tu DashBoardHeader se renderizará aquí si lo llamas desde el layout -->
    <DashBoardHeader />

    <div class="flex">
      <!-- Tu Sidebar se renderizará aquí si la tienes -->
      <Sidebar v-if="showSidebar" /> <!-- Ejemplo: Mostrar condicionalmente -->

      <!-- El contenido principal de la página -->
      <main class="flex-1">
        <!--
          El <slot /> renderizará el contenido de tu página actual (ej. dashboard.vue).
          El padding para el contenido del slot ya está en las páginas individuales
          (como en pages/dashboard.vue -> <div class="p-4 sm:p-6 md:p-8">)
        -->
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
// Importa tus componentes si los usas aquí directamente
import DashBoardHeader from '@/components/DashBoardHeader.vue'; // Asegúrate que la ruta sea correcta
import Sidebar from '@/components/Sidebar.vue'; // Asegúrate que la ruta sea correcta
import { ref } from 'vue'; // Ejemplo para mostrar/ocultar sidebar

// Lógica para mostrar/ocultar sidebar si es necesario, o si siempre es visible
const showSidebar = ref(true); // O true por defecto si siempre está
</script>

<style>
/* Puedes añadir estilos globales específicos para este layout si es necesario.
   Por ejemplo, asegurar que el html y body también tengan un fondo oscuro
   podría ayudar si hay "fugas" de blanco.
*/
/*
html, body {
  background-color: #0f172a; /* slate-900 */
/* }
*/
</style>