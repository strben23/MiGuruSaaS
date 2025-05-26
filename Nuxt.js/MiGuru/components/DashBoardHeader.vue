<!-- components/DashBoardHeader.vue -->
<template>
  <header class="bg-slate-800 p-4 md:p-6 shadow-lg border-b border-slate-700">
    <div class="container mx-auto flex justify-between items-center">
      <h1 class="text-2xl md:text-3xl font-bold text-sky-400">
        Dashboard de Cursos
      </h1>
      <!-- Opcional: Puedes añadir aquí enlaces rápidos o un avatar de usuario -->
      <!--
      <div class="flex items-center space-x-4">
        <NuxtLink to="/perfil" class="text-sm text-slate-300 hover:text-sky-400 transition-colors">
          Mi Perfil
        </NuxtLink>
        <button @click="logout" class="text-sm text-red-400 hover:text-red-300 transition-colors">
          Cerrar Sesión
        </button>
      </div>
      -->
    </div>
  </header>
</template>

<script setup>
// Si necesitas lógica para logout o datos del usuario, iría aquí
// const logout = () => {
//   console.log('Cerrar sesión...');
//   // Lógica de logout
// };
</script>

<style scoped>
/* Puedes añadir estilos específicos aquí si es necesario */
</style>