<script setup lang="ts">
import { ref, watch } from 'vue';

interface FilePreview {
    name: string;
    url: string;
    type: string;
    isFromServer?: boolean;
}

interface Props {
    value: string | string[] | null;
}

const props = defineProps<Props>()
const serverPreviews = ref<FilePreview[]>([])

const guessFileType = (url: string) => {
    const ext = url.split('.').pop()?.toLowerCase()
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return `image/${ext}`
    if (ext === 'pdf') return 'application/pdf'
    return 'application/octet-stream'
}

watch(
    () => props.value,
    (value) => {
        if (!value) {
            serverPreviews.value = []
            return
        }

        let previews: FilePreview[] = []

        if (typeof value === 'string') {
            previews = [{
                name: value.split('/').pop() || 'file',
                url: value,
                type: guessFileType(value),
                isFromServer: true
            }]
        } else if (Array.isArray(value) && typeof value[0] === 'string') {
            previews = value.map(url => ({
                name: url.split('/').pop() || 'file',
                url,
                type: guessFileType(url),
                isFromServer: true
            }))
        }

        serverPreviews.value = previews
    },
    { immediate: true }
)
</script>

<template>
    <div class="space-y-2">
        <div v-if="serverPreviews.length > 0" class="mt-2 space-y-2">
            <ul class="text-sm text-muted-foreground mt-1 space-y-2">
                <li v-for="(file, index) in serverPreviews" :key="index" class="flex flex-col gap-1">
                    <span>{{ file.name }}</span>
                    <template v-if="file.type.startsWith('image/')">
                        <img :src="file.url" :alt="file.name" class="w-32 h-32 object-cover rounded border" />
                    </template>
                    <template v-else>
                        <a :href="file.url" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline">
                            Preview
                        </a>
                    </template>
                </li>
            </ul>
        </div>
    </div>
</template>
