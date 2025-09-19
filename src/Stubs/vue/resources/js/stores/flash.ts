// stores/flash.ts
import { defineStore } from 'pinia';
import { h, ref } from 'vue';
import { toast } from 'vue-sonner';

interface FlashMessage {
    success?: string;
    error?: string;
    link?: string;
}

export const useFlashStore = defineStore('flash', () => {
    // State untuk menyimpan flash message saat ini
    const currentFlash = ref<FlashMessage | null>(null)

    // Method untuk set flash message
    const setFlash = (flash: FlashMessage | null) => {
        currentFlash.value = flash
        if (flash) {
            handleFlashMessage(flash)
        }
    }

    // Method untuk handle flash message dan show toast
    const handleFlashMessage = (flash: FlashMessage) => {
        if (flash.success) {
            toast.success("success", {
                position: "top-right",
                closeButton: true,
                description: flash.success,
            })
        }

        if (flash.error) {
            toast.error("error", {
                position: "top-right",
                closeButton: true,
                description: flash.error,
            })
        }

        if (flash.link) {
            toast.success("download", {
                position: "top-right",
                duration: 10_000,
                closeButton: true,
                description: h(
                    "a",
                    {
                        href: flash.link,
                        class: "text-blue-500 underline hover:cursor-pointer",
                        target: "_blank",
                        rel: "noopener noreferrer",
                    },
                    "Download file"
                ),
            })
        }
    }

    // Method untuk clear flash message
    const clearFlash = () => {
        currentFlash.value = null
    }

    // Method untuk show toast secara manual
    const showSuccess = (message: string) => {
        toast.success("success", {
            position: "top-right",
            closeButton: true,
            description: message,
        })
    }

    const showError = (message: string) => {
        toast.error("error", {
            position: "top-right",
            closeButton: true,
            description: message,
        })
    }

    const showDownloadLink = (link: string) => {
        toast.success("download", {
            position: "top-right",
            duration: 10_000,
            closeButton: true,
            description: h(
                "a",
                {
                    href: link,
                    class: "text-blue-500 underline hover:cursor-pointer",
                    target: "_blank",
                    rel: "noopener noreferrer",
                },
                "Download file"
            ),
        })
    }

    return {
        // State
        currentFlash,

        // Actions
        setFlash,
        clearFlash,
        showSuccess,
        showError,
        showDownloadLink,
        handleFlashMessage
    }
})
