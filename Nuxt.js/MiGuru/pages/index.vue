<template>
  <div>
    <NavBar />

    <div class="min-h-screen bg-white text-gray-900">
      <!-- Sección principal -->
      <section class="bg-gradient-to-br from-indigo-600 to-purple-600 text-white py-20 px-6 text-center">
        <div class="max-w-4xl mx-auto">
          <h1 class="text-6xl font-extrabold mb-4">MiGuru</h1>
          <h2 class="text-4xl font-bold mb-4">{{ $t('hero.titulo') }}</h2>
          <p class="text-lg mb-8">{{ $t('hero.subtitulo') }}</p>
          <div class="flex justify-center space-x-4">
            <NuxtLink
              to="/signup"
              class="bg-white text-indigo-700 font-semibold px-6 py-3 rounded-xl shadow hover:bg-gray-100 transition"
            >
              {{ $t('hero.registrarse') }}
            </NuxtLink>
            <NuxtLink
              to="/login"
              class="border border-white px-6 py-3 rounded-xl hover:bg-white hover:text-indigo-700 transition"
            >
              {{ $t('hero.iniciarSesion') }}
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- Sección de beneficios -->
      <section class="py-20 px-6 bg-gray-50">
        <div class="max-w-6xl mx-auto">
          <h2 class="text-3xl font-bold text-center mb-12">{{ $t('beneficios.titulo') }}</h2>
          <div class="grid md:grid-cols-3 gap-10">
            <div class="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
              <h3 class="text-xl font-semibold mb-2">{{ $t('beneficios.iaTitulo') }}</h3>
              <p>{{ $t('beneficios.iaTexto') }}</p>
            </div>
            <div class="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
              <h3 class="text-xl font-semibold mb-2">{{ $t('beneficios.exportarTitulo') }}</h3>
              <p>{{ $t('beneficios.exportarTexto') }}</p>
            </div>
            <div class="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
              <h3 class="text-xl font-semibold mb-2">{{ $t('beneficios.personalizarTitulo') }}</h3>
              <p>{{ $t('beneficios.personalizarTexto') }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>    
  </div>
</template>
