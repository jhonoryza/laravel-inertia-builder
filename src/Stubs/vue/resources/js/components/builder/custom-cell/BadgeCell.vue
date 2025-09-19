<script setup lang="ts">
import { Badge } from "@/components/ui/badge";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

defineProps<{
    value: string | number | null | undefined;
    variant?: BadgeVariant;
}>();
</script>

<template>
    <Badge v-if="value" :variant="variant ?? 'default'" class="capitalize">
        {{ value }}
    </Badge>
</template>
