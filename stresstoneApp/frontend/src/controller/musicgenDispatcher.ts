import { MusicGenSpec } from "../types";

export async function musicgenDispatcher(userRequest: MusicGenSpec) : Promise<ArrayBuffer> {
  const apiUrl = import.meta.env.VITE_MODEL_SERVICE_DOMAIN + '/text_to_music';
  // console.log(apiUrl)
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userRequest),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    // Convert response to blob (audio file)
    const audioBlob = await response.blob();
    // parse into arraybuffer
    // Convert blob to ArrayBuffer
    const arrayBuffer = await audioBlob.arrayBuffer();
    return arrayBuffer
  } catch (error) {
    console.error('Failed to generate music:', error);
    throw error;
  }
}
