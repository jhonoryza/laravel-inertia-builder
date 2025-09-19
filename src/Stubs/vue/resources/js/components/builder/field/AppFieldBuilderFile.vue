<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FieldDefinition } from '@/types/field-builder';
import { useFormStore } from '@/stores/form';
import { cn } from '@/lib/utils';

interface Props {
    field: FieldDefinition & { accept?: string[]; multiple?: boolean };
    modelValue: File | File[] | null;
    idx: string;
}

interface FilePreview {
    name: string;
    url: string;
    type: string;
    isFromServer?: boolean;
}

const props = defineProps<Props>();
const model = defineModel<File | File[] | null>();
const store = useFormStore(props.idx)();

const fileInputRef = ref<HTMLInputElement | null>(null);
const serverPreviews = ref<FilePreview[]>([]);
const localPreviews = ref<FilePreview[]>([]);

const guessFileType = (url: string) => {
    const ext = url.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return `image/${ext}`;
    if (ext === 'pdf') return 'application/pdf';
    return 'application/octet-stream';
};

// generate preview awal dari server
onMounted(() => {
    const preview = props.field.preview;
    if (!preview) {
        serverPreviews.value = [];
        return;
    }

    let previews: FilePreview[] = [];

    if (typeof preview === 'string') {
        previews = [{
            name: preview.split('/').pop() || 'file',
            url: preview,
            type: guessFileType(preview),
            isFromServer: true
        }];
    } else if (Array.isArray(preview) && typeof preview[0] === 'string') {
        previews = preview.map((url: string) => ({
            name: url.split('/').pop() || 'file',
            url,
            type: guessFileType(url),
            isFromServer: true
        }));
    }

    serverPreviews.value = previews;
});

const handleFileChange = (files: FileList | null) => {
    if (!files) return;
    model.value = props.field.multiple ? Array.from(files) : files[0] || null;
    store.onReactive(props.field.key, model.value);

    // buat preview URL
    const previews: FilePreview[] = Array.from(files).map(file => ({
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        isFromServer: false
    }));
    localPreviews.value = previews;
};

const handleButtonClick = () => {
    fileInputRef.value?.$el.click();
};

onBeforeUnmount(() => {
    localPreviews.value.forEach(p => URL.revokeObjectURL(p.url));
});

const previewsToShow = computed(() => {
    return localPreviews.value.length > 0 ? localPreviews.value : serverPreviews.value;
});

const acceptAttribute = props.field.accept ? props.field.accept.join(',') : undefined;
</script>

<template>
    <div class="space-y-2">
        <div v-if="previewsToShow.length" class="mt-2 space-y-2">
            <ul class="text-sm text-muted-foreground mt-1 space-y-2">
                <li v-for="(file, index) in previewsToShow" :key="index" class="flex flex-col gap-1">
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

        <Input
            ref="fileInputRef"
            type="file"
            :id="props.field.key"
            :name="props.field.key"
            :accept="acceptAttribute"
            :multiple="props.field.multiple"
            class="hidden"
            @change="(e: any) => handleFileChange(e.target.files)"
        />

        <Button type="button" variant="outline" @click="handleButtonClick" :class="cn('hover:cursor-pointer', props.field.mergeClass)">
            {{ props.field.placeholder || (props.field.multiple ? 'Choose Files' : 'Choose File') }}
        </Button>
    </div>
</template>
