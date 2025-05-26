<template>
  <nav class="bg-white shadow-md py-4 px-6 flex items-center justify-between">
    <!-- Logo o nombre -->
    <NuxtLink to="/" class="text-2xl font-bold text-indigo-700">MiGuru</NuxtLink>

    <!-- Navegación y switch de idioma -->
    <div class="flex items-center space-x-6">
      <NuxtLink to="/login" class="text-gray-700 hover:text-indigo-600 font-medium">
        {{ $t('hero.iniciarSesion') }}
      </NuxtLink>
      <NuxtLink to="/signup" class="text-gray-700 hover:text-indigo-600 font-medium">
        {{ $t('hero.registrarse') }}
      </NuxtLink>

      <!-- Selector de idioma -->
      <select
        v-model="idiomaSeleccionado"
        @change="cambiarIdioma"
        class="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="es">ES</option>
        <option value="en">EN</option>
      </select>
    </div>
  </nav>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

const { locale } = useI18n()

// Variable reactiva para el idioma
const idiomaSeleccionado = ref(locale.value)

const cambiarIdioma = () => {
  locale.value = idiomaSeleccionado.value
}
</script>
