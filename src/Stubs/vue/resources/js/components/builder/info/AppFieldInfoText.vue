<script setup lang="ts">
interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any
}

const props = defineProps<Props>()
</script>

<template>
    <div class="flex w-full items-center text-sm text-muted-foreground">
        {{ typeof props.value === 'boolean' ? (props.value ? 'true' : 'false') : props.value || '-' }}
    </div>
</template>
