// Get API URL from multiple sources
export const getApiUrl = async () => {
  // First check environment variable (Vite build time)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Second, try to load from public config file
  try {
    const response = await fetch('/config.json');
    if (response.ok) {
      const config = await response.json();
      if (config.apiUrl) {
        return config.apiUrl;
      }
    }
  } catch (err) {
    console.log('Could not load config.json');
  }

  // Fallback for development
  return 'http://localhost:5000';
};
