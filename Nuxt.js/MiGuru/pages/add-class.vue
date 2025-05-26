<!-- pages/add-class.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
    <div class="max-w-2xl w-full bg-slate-800 shadow-2xl rounded-xl p-6 md:p-10 border border-slate-700">
      <h1 class="text-3xl font-bold text-center text-sky-400 mb-8">
        Crear Nuevo Curso 
      </h1>
      <form @submit.prevent="crearCursoConIA" class="space-y-6">
        <div>
          <label for="courseTitleField" class="block text-sm font-medium text-sky-300 mb-1">
            Título del Curso <span class="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="courseTitleField"
            v-model="courseTitle"
            placeholder="Ej: Introducción a la Cocina Molecular"
            class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-gray-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition duration-150 ease-in-out shadow-sm"
          />
        </div>

        <div class="border-t border-slate-700 pt-6">
          <h2 class="text-xl font-semibold text-sky-400 mb-1">
            Lecciones Iniciales
          </h2>
          <p class="text-xs text-slate-400 mb-4">
            (Opcional) Define los títulos de las primeras 3 lecciones para guiar a la IA.
          </p>
          <div class="space-y-4">
            <div>
              <label for="leccion1Title" class="block text-sm font-medium text-sky-300 mb-1">Título Lección 1:</label>
              <input
                type="text"
                id="leccion1Title"
                v-model="leccionTitulos[0]"
                placeholder="Ej: ¿Qué es la Gastronomía Molecular?"
                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-gray-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition duration-150 ease-in-out shadow-sm"
              />
            </div>
            <div>
              <label for="leccion2Title" class="block text-sm font-medium text-sky-300 mb-1">Título Lección 2:</label>
              <input
                type="text"
                id="leccion2Title"
                v-model="leccionTitulos[1]"
                placeholder="Ej: Herramientas y Técnicas Básicas"
                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-gray-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition duration-150 ease-in-out shadow-sm"
              />
            </div>
            <div>
              <label for="leccion3Title" class="block text-sm font-medium text-sky-300 mb-1">Título Lección 3:</label>
              <input
                type="text"
                id="leccion3Title"
                v-model="leccionTitulos[2]"
                placeholder="Ej: Ingredientes Esenciales y Dónde Encontrarlos"
                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-gray-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition duration-150 ease-in-out shadow-sm"
              />
            </div>
          </div>
        </div>

        <div class="pt-2">
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Generando Curso...' : 'Crear Curso Automáticamente' }}
          </button>
        </div>
      </form>

      <div v-if="error" class="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
        <h4 class="font-semibold mb-1">¡Ups! Algo salió mal:</h4>
        <p>{{ error }}</p>
      </div>

      <div v-if="successMessage" class="mt-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-sm">
        <h4 class="font-semibold mb-1">¡Éxito!</h4>
        <p>{{ successMessage }}</p>
        <nuxt-link
          v-if="createdCourseData && createdCourseData.cursoId"
          :to="`/cursos/${createdCourseData.cursoId}`"
          class="inline-block mt-3 text-sky-400 hover:text-sky-300 font-medium underline"
        >
          Ver curso creado →
        </nuxt-link>
      </div>
    </div>
    <footer class="mt-12 text-center text-sm text-slate-500">
      <p>© {{ new Date().getFullYear() }} MiGuru. Todos los derechos reservados.</p>
    </footer>
  </div>
</template>

<script setup>
// ... tu script setup sigue igual
import { ref } from 'vue';

const courseTitle = ref('');
const leccionTitulos = ref(['', '', '']);
const loading = ref(false);
const error = ref(null);
const successMessage = ref('');
const createdCourseData = ref(null);

const crearCursoConIA = async () => {
  if (!courseTitle.value || courseTitle.value.trim() === '') {
    error.value = "El título del curso es obligatorio.";
    successMessage.value = '';
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = null;
  successMessage.value = '';
  createdCourseData.value = null;

  const leccionesIniciales = leccionTitulos.value.map(t => t.trim()).filter(t => t !== '');

  try {
    const response = await $fetch('/api/crear-curso', {
      method: 'POST',
      body: {
        tituloCurso: courseTitle.value.trim(),
        leccionesIniciales: leccionesIniciales
      }
    });

    if (response && response.ok) {
      successMessage.value = response.message || '¡Curso creado exitosamente!';
      createdCourseData.value = response;
      courseTitle.value = '';
      leccionTitulos.value = ['', '', ''];
    } else if (response && response.error) {
        error.value = response.error;
    } else {
        error.value = 'Respuesta inesperada de la API.';
    }

  } catch (err) {
    console.error("Error en llamada API al crear curso:", err);
    error.value = err.data?.error || err.message || 'Error de conexión o del servidor.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Puedes dejar esto vacío si solo usas Tailwind, o añadir estilos muy específicos aquí */
/* Por ejemplo, si necesitas un alto específico para un textarea que Tailwind no cubre fácilmente */
</style>