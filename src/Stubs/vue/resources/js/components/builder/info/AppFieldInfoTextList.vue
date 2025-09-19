<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
interface Props {
    value: any[]
}

const props = defineProps<Props>()
</script>

<template>
    <ul class="w-full list-disc space-y-1 px-3 text-sm shadow-sm">
        <li v-for="(v, i) in props.value" :key="i" class="text-muted-foreground">
            {{ typeof v === 'boolean' ? (v ? 'true' : 'false') : v || '-' }}
        </li>
    </ul>
</template>
