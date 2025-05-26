<script setup>
definePageMeta({
  layout: 'dashboardlayout', // Asegúrate que este layout no interfiera con los estilos de fondo
})

import { ref, onMounted, computed } from 'vue';
// No necesitas AddClassForm aquí si solo muestras las clases
// import AddClassForm from '@/components/AddClassForm.vue';
import ClassCard from '@/components/ClassCard.vue'; // Asegúrate que la ruta sea correcta

const classes = ref([]);
const isLoading = ref(true); // Para mostrar un estado de carga
const errorLoading = ref(null); // Para mostrar errores

const fetchClasses = async () => {
  isLoading.value = true;
  errorLoading.value = null;
  try {
    // Usar $fetch para consistencia con Nuxt 3 y mejor manejo de errores
    const data = await $fetch('/api/classes');
    classes.value = data;
  } catch (error) {
    console.error("Error fetching classes:", error);
    errorLoading.value = "No se pudieron cargar las clases. Inténtalo de nuevo más tarde.";
    classes.value = []; // Limpiar por si acaso
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchClasses);

// Opcional: mensaje si no hay clases
const noClassesMessage = computed(() => {
  if (classes.value.length === 0 && !isLoading.value && !errorLoading.value) {
    return "No hay cursos creados todavía. ¡Anímate a crear el primero!";
  }
  return null;
});
</script>

<template>
  <div class="p-4 sm:p-6 md:p-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-sky-400">
        Mis Cursos
      </h1>
      <NuxtLink
        to="/add-class"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Crear Nuevo Curso
      </NuxtLink>
    </div>

    <!-- Estado de Carga -->
    <div v-if="isLoading" class="text-center py-10">
      <svg class="animate-spin mx-auto h-12 w-12 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="mt-4 text-lg text-slate-400">Cargando cursos...</p>
    </div>

    <!-- Mensaje de Error -->
    <div v-else-if="errorLoading" class="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm text-center">
      <h4 class="font-semibold mb-1">Error al cargar</h4>
      <p>{{ errorLoading }}</p>
      <button @click="fetchClasses" class="mt-3 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-md">
        Reintentar
      </button>
    </div>

    <!-- Mensaje de "No hay clases" -->
    <div v-else-if="noClassesMessage" class="text-center py-20">
      <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-16 w-16 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.128 3.03A11.96 11.96 0 002.047 11.453c.1.692.22 1.372.37 2.038M14.872 3.03c2.553 0 4.94.79 6.883 2.19M2.047 11.453L2 20.25l5.073-3.652M2.047 11.453c.097.693.217 1.373.366 2.04M14.872 3.03L15.75 21l-5.073-3.652M14.872 3.03c.09.69.198 1.37.325 2.037m4.692 6.383A12.024 12.024 0 0021.953 11.45m-7.081-8.42a11.906 11.906 0 016.883 2.19M2.34 13.493c.097.693.217 1.373.366 2.04M15.197 5.067c.09.69.198 1.37.325 2.037m4.692 6.383a12.024 12.024 0 002.546-6.836M9.128 3.03c.085.69.188 1.37.308 2.037M3.5 20.25a2.25 2.25 0 01-1.125-4.125M15.75 21a2.25 2.25 0 001.125-4.125m-12.53 2.082A11.935 11.935 0 012 11.453M14.003 18.848A11.935 11.935 0 0022 11.453" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75h6" />
      </svg>
      <p class="mt-4 text-xl text-slate-400">{{ noClassesMessage }}</p>
      <NuxtLink
        to="/add-class"
        class="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 transition-colors"
      >
        Crear mi Primer Curso
      </NuxtLink>
    </div>

    <!-- Grid de Clases -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <NuxtLink
        v-for="classItem in classes"
        :key="classItem._id"
        :to="`/cursos/${classItem._id}`"
        class="block group"
      >
        <!-- Asumo que ClassCard.vue se encarga de su propio estilo interno -->
        <!-- Puedes pasar props para estilos o ClassCard puede tener estilos como los de abajo -->
        <ClassCard :classItem="classItem" class="bg-slate-800 border border-slate-700 rounded-lg shadow-lg hover:shadow-sky-500/30 transition-all duration-300 ease-in-out overflow-hidden transform group-hover:scale-105 group-hover:border-sky-600" />
      </NuxtLink>
    </div>

  </div>
</template>