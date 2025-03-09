export const ToneLengthOptions = ['test', 'short', 'medium', 'long']
export type ToneLengthTypes = typeof ToneLengthOptions[number]

export interface MusicGenSpec {
  text: string;
  length: ToneLengthTypes;
}

export interface TonePreviewProps {
  id: number;
  title: string;
  tags: string[];
  audioData: ArrayBuffer;
}

export interface UploadPageProps {
  generatedAudioFile?: File;
  generatedAudioTitle?: string;
  generatedAudioTags?: string[];
}

export interface TagProps {
  type: string;
  description: string;
}