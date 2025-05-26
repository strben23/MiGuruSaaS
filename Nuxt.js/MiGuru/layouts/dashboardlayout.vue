<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="flex-1 flex flex-col">
      <DashboardHeader />
      <main class="p-4">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue';
import DashboardHeader from '@/components/DashBoardHeader.vue';
</script>