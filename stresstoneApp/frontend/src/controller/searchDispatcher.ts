import axios from 'axios';
import { SearchSpec } from '../types';

export async function searchDispatcher(params: SearchSpec) {
  const port = import.meta.env.VITE_BACKEND_PORT;
  const response = axios.get(`http://localhost:${port}/api/search`, {
    params: params,
  });
  return response;
}
