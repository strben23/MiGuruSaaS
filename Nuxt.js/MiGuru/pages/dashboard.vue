<script setup>
definePageMeta({
  layout: 'dashboardlayout',
})

import { ref, onMounted } from 'vue';
import AddClassForm from '@/components/AddClassForm.vue';
import ClassCard from '@/components/ClassCard.vue';

const classes = ref([]);

const fetchClasses = async () => {
  const res = await fetch('/api/classes');
  classes.value = await res.json();
};

onMounted(fetchClasses);
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Clases Disponibles</h2>
    <div v-if="classes.length === 0" class="text-gray-500">No hay cursos aún. ¡Agrega uno!</div>
    <div v-else class="grid grid-cols-3 gap-4">
      <NuxtLink
        v-for="classItem in classes"
        :key="classItem._id"
        :to="`/curso/${classItem._id}`"
        class="block"
      >
        <ClassCard :classItem="classItem" />
      </NuxtLink>
    </div>
  </div>
</template>