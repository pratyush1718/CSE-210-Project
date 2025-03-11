export async function uploadDispatcher(formData: FormData): Promise<boolean> {
  try {
    const port = import.meta.env.VITE_BACKEND_PORT || 3000;
    const response = await fetch(`http://localhost:${port}/api/upload/`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      alert('Your music file has been uploaded successfully!');
      return true;
    } else {
      alert('Upload failed: ' + data.error);
      return false;
    }
  } catch (error) {
    console.error('Upload Failed:', error);
    alert('Upload failed! Please try again.');
    return false;
  }
}
