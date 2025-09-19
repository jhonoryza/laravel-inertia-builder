<script setup lang="ts">
import { marked } from 'marked';
import { cn } from '@/lib/utils';

interface Props {
    value: string;
}

const props = defineProps<Props>()
</script>

<template>
    <div class="space-y-1">
        <div :class="cn('prose-sm dark:prose-dark max-w-none p-3 border rounded bg-muted')"
            v-html="marked.parse(props.value || '')" />
    </div>
</template>
