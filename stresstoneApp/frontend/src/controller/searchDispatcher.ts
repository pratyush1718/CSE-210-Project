import axios from 'axios';
import { SearchSpec } from '../types';

export async function searchDispatcher(params: SearchSpec) {
  // Add port configuration
  const port = import.meta.env.VITE_BACKEND_PORT || 3000;
  
  try {
    // Use absolute URL with port
    const response = await axios.get(`http://localhost:${port}/api/search`, {
      params: params,
    });
    return response;
  } catch (error) {
    console.error("Search request failed:", error);
    throw error;
  }
}
