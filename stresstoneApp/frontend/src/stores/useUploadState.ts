import { create } from 'zustand'

interface UploadState {
    title: string;
    setTitle: (title: string) => void;
    audioFile: File | null;
    setAudioFile: (file: File | null) => void;
    tags: string[];
    setTags: (tags: string[]) => void;
    clear: () => void;
}


const useUploadStore = create<UploadState>((set) => ({
    title: "",
    setTitle: (title) => set({ title }),
    audioFile: null,
    setAudioFile: (file) => set({ audioFile: file }),
    tags: [],
    setTags: (tags) => set({ tags }),
    clear: () => {
        set({
            title: "",
            audioFile: null,
            tags: []
        })
    }
}));

export default useUploadStore;