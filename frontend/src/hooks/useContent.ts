import axios from 'axios';
import { useEffect, useState } from 'react';

const BACKEND_URL = 'http://localhost:3000/api/v1/getContent';

export function useContent() {
  const [content, setContent] = useState([]);

  function refresh() {
    const token = localStorage.getItem('token');

    axios
      .get(BACKEND_URL, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Correct Bearer format
        },
      })
      .then((response) => {
        const data = response.data?.getContent ?? [];
        setContent(data);
        
      })
      .catch((error) => {
        console.log('❌ Error in fetching:', error);
        setContent([]);
      });
  }

  useEffect(() => {
    refresh();

    const interval = setInterval(() => {
      refresh();
    }, 100000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return { content, refresh };
}
