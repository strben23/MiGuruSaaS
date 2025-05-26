<template>
  <div class="flex h-screen bg-gray-100">
    <Sidebar class="w-64 bg-gray-800 text-white shadow-md" />
    <main class="flex-1 p-8 overflow-auto">
      <form @submit.prevent="crearCurso" class="max-w-lg mx-auto bg-white p-6 rounded-lg shadow">
        <label class="block mb-2 font-bold text-gray-700">Título del curso</label>
        <input
          v-model="titulo"
          type="text"
          class="border rounded px-3 py-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ejemplo: Introducción a la Filosofía"
          required
        />
        <button
          type="submit"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          :disabled="loading"
        >
          {{ loading ? 'Creando...' : 'Crear curso automáticamente' }}
        </button>
        <p v-if="error" class="text-red-600 mt-2">{{ error }}</p>
        <p v-if="success" class="text-green-600 mt-2">¡Curso creado exitosamente!</p>
      </form>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Sidebar from '@/components/Sidebar.vue';

const titulo = ref('');
const loading = ref(false);
const error = ref('');
const success = ref(false);
const router = useRouter();

async function crearCurso() {
  error.value = '';
  success.value = false;
  loading.value = true;
  try {
    const res = await fetch('/api/crear-curso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: titulo.value }),
    });
    if (!res.ok) throw new Error('Error al crear el curso');
    success.value = true;
    titulo.value = '';
    setTimeout(() => router.push('/dashboard'), 1200);
  } catch (e) {
    error.value = e.message || 'Error inesperado';
  } finally {
    loading.value = false;
  }
}
</script>
