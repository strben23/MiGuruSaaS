<template>
  <div class="p-4 border rounded shadow">
    <h3 class="font-bold text-lg mb-2">{{ classItem.titulo }}</h3>
    <p class="mb-2">{{ classItem.descripcion }}</p>
    <p><strong>Duración:</strong> {{ classItem.duracionHoras }}</p>
    <p><strong>Publicado:</strong> {{ classItem.publicado ? 'Sí' : 'No' }}</p>
    <p><strong>Creado:</strong> {{ classItem.fechaCreacion }}</p>
  </div>
</template>

<script setup>
defineProps(['classItem']);

function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleString();
}
</script>