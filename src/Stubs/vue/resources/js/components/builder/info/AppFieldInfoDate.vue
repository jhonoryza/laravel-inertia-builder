<script setup lang="ts">
import { format } from 'date-fns';

interface Props {
    value: string | Date | null;
}

const props = defineProps<Props>()
</script>

<template>
    <div class="flex w-full items-center text-sm text-muted-foreground">
        {{ props.value ? format(new Date(props.value), 'dd/MM/yyyy') : 'select date' }}
    </div>
</template>
