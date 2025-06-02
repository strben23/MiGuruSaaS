<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
      <h2 class="text-2xl font-semibold mb-6 text-center">Iniciar sesión</h2>
      <form @submit.prevent="handleLogin">
        <!-- Correo -->
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

        <!-- Contraseña -->
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium mb-1">Contraseña</label>
          <input
            v-model="password"
            id="password"
            type="password"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Iniciar sesión
        </button>
      </form>

      <p v-if="errorMessage" class="mt-4 text-red-600 text-sm text-center">
        {{ errorMessage }}
      </p>
      <p v-if="successMessage" class="mt-4 text-green-600 text-sm text-center">
        {{ successMessage }}
      </p>

      <p class="mt-4 text-sm text-center">
        ¿No tienes una cuenta?
        <NuxtLink to="/signup" class="text-blue-600 hover:underline">Regístrate aquí</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const correo = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref('')

const handleLogin = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!correo.value || !password.value) {
    errorMessage.value = 'Por favor, llena todos los campos.'
    return
  }

  try {
    const res = await fetch('http://localhost:3001/api/usuarios/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: correo.value, password: password.value }),
    })

    console.log('HTTP status:', res.status)

    const data = await res.json()
    console.log('Respuesta JSON:', data)

    if (res.ok) {
      successMessage.value = `Bienvenido, ${data.usuario.correo}!`
      // ✅ Guarda el token si existe
      if (data.token) {
        localStorage.setItem('token', data.token)
        console.log('Token guardado en localStorage:', data.token)
      }

      // Redirecciona al dashboard
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    } else {
      errorMessage.value = data.error || 'Credenciales incorrectas.'
    }
  } catch (e) {
    console.error('Error en fetch o parsing:', e)
    errorMessage.value = 'Error de conexión con el servidor.'
  }
}
</script>
