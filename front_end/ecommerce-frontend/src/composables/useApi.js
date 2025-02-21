// composables/useApi.js
import api from '@/services/api'; // Import your existing api.js file

export function useApi() {

    const get = async (url, config = {}) => {
        try {
            const response = await api.get(url, config); // Use your existing 'api' instance
            return response;
        } catch (error) {
            console.error("API GET request error:", error);
            throw error; // Re-throw for component-level handling
        }
    };

    const post = async (url, data, config = {}) => {
      try {
        const response = await api.post(url, data, config);
        return response;
      } catch (error) {
        console.error("API POST request error:", error);
        throw error;
      }
    };

    const put = async (url, data, config = {}) => {
      try {
        const response = await api.put(url, data, config);
        return response;
      } catch (error) {
        console.error("API PUT request error:", error);
        throw error;
      }
    };

    const del = async (url, config = {}) => { // Add delete if needed
      try {
        const response = await api.delete(url, config);
        return response;
      } catch (error) {
        console.error("API DELETE request error:", error);
        throw error;
      }
    };

    return { get, post, put, del }; // Return the functions
}