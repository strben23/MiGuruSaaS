<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
      <h2 class="text-2xl font-semibold mb-6 text-center">Registrar Nuevo Usuario</h2>
      <form @submit.prevent="handleRegister">
        <!-- Correo electrónico -->
        <div class="mb-4">
          <label for="correo" class="block text-sm font-medium mb-1">Correo electrónico</label>
          <input
            v-model="correo"
            id="correo"
            type="email"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <!-- password -->
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium mb-1">password</label>
          <input
            v-model="password"
            id="password"
            type="password"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <!-- Rol -->
        <div class="mb-4">
          <label for="rol" class="block text-sm font-medium mb-1">Rol</label>
          <select
            v-model="rol"
            id="rol"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="estudiante">Estudiante</option>
            <option value="creador">Creador</option>
            <option value="administrador">Administrador</option>
          </select>
        </div>

        <!-- Idioma -->
        <div class="mb-6">
          <label for="idioma" class="block text-sm font-medium mb-1">Idioma</label>
          <select
            v-model="idioma"
            id="idioma"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="es">Español</option>
            <option value="en">Inglés</option>
          </select>
        </div>

        <!-- Botón -->
        <button
          type="submit"
          class="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-200"
        >
          Registrar
        </button>
      </form>

      <!-- Mensajes -->
      <p v-if="errorMessage" class="mt-4 text-red-600 text-sm text-center">
        {{ errorMessage }}
      </p>
      <p v-if="successMessage" class="mt-4 text-green-600 text-sm text-center">
        {{ successMessage }}
      </p>

      <p class="mt-6 text-sm text-center">
        ¿Ya tienes una cuenta?
        <NuxtLink to="/login" class="text-blue-600 hover:underline">Inicia sesión</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const correo = ref('')
const password = ref('')
const rol = ref('estudiante')
const idioma = ref('es')
const errorMessage = ref('')
const successMessage = ref('')

const handleRegister = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!correo.value || !password.value) {
    errorMessage.value = 'Correo y password son obligatorios.'
    return
  }

  try {
    const res = await fetch('http://localhost:3001/api/usuarios/nuevo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        correo: correo.value,
        password: password.value,
        rol: rol.value,
        idioma: idioma.value,
      }),
    })

    const data = await res.json()

    if (res.ok) {
      successMessage.value = 'Usuario registrado con éxito.'
      correo.value = ''
      password.value = ''
      rol.value = 'estudiante'
      idioma.value = 'es'
    } else {
      errorMessage.value = data.error || 'Error al registrar usuario.'
    }
  } catch (e) {
    errorMessage.value = 'Error de conexión con el servidor.'
  }
}
</script>
