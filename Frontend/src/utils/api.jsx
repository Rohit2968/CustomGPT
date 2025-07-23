// Frontend/src/utils/api.jsx

const baseUrl = import.meta.env.VITE_API_URL;

export const sendChatMessage = async (message) => {
  const res = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message })
  });
  return await res.json();
};
