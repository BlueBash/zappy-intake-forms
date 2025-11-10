import { useEffect, useState } from 'react';

interface ReceivedData {
  token?: string;
  [key: string]: any;
}

interface UsePostMessageDataReturn {
  data: ReceivedData | null;
  loading: boolean;
  error: string | null;
}

export const usePostMessageData = (sourceOrigin: string): UsePostMessageDataReturn => {
  const [data, setData] = useState<ReceivedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Request data from parent window when component mounts
    const requestData = () => {
      if (window.opener) {
        try {
          window.opener.postMessage(
            { type: 'REQUEST_DATA' },
            sourceOrigin
          );
        } catch (err) {
          console.error('Failed to request data:', err);
          setError('Failed to communicate with parent window');
          setLoading(false);
        }
      } else {
        // Not opened from another window, set loading to false
        setLoading(false);
      }
    };

    // Listen for messages from parent window
    const handleMessage = (event: MessageEvent) => {
      // CRITICAL: Always verify the origin for security
      if (event.origin !== sourceOrigin) {
        console.warn('Unauthorized origin:', event.origin, 'Expected:', sourceOrigin);
        return;
      }

      if (event.data && event.data.type === 'INIT_DATA') {
        console.log('Received data from parent:', event.data.payload);
        setData(event.data.payload);
        setLoading(false);
        setError(null);
      }
    };

    // Request data immediately
    requestData();

    // Set up message listener
    window.addEventListener('message', handleMessage);

    // Fallback: Try requesting again after a short delay
    const retryTimeout = setTimeout(() => {
      if (!data) {
        requestData();
      }
    }, 500);

    // Another fallback: Try after 2 seconds
    const retryTimeout2 = setTimeout(() => {
      if (!data) {
        requestData();
        // If still no data after 2 seconds, stop loading
        setLoading(false);
      }
    }, 2000);

    // Cleanup
    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(retryTimeout);
      clearTimeout(retryTimeout2);
    };
  }, [sourceOrigin]); // Only depend on sourceOrigin

  return { data, loading, error };
};

