import axios from "axios";
import CryptoJS from "crypto-js";

const TOKEN = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ1c2VyLWNlbnRlciIsImV4cCI6MTc2Njc3NzEwMSwiaWF0IjoxNzY0MTg1MTAxLCJqdGkiOiJkNGpsODNiYWNjNGNoMWp0aTMwMCIsInR5cCI6ImFjY2VzcyIsImFwcF9pZCI6ImtpbWkiLCJzdWIiOiJkM2dkdGVlNnM0dDR2cXFnaHFqZyIsInNwYWNlX2lkIjoiZDNnZHRlNjZzNHQ0dnFxZ2htN2ciLCJhYnN0cmFjdF91c2VyX2lkIjoiZDNnZHRlNjZzNHQ0dnFxZ2htNzAiLCJzc2lkIjoiMTczMTQyOTU0NzY0NTM2MTk3NiIsImRldmljZV9pZCI6Ijc1NTcyODQyNjIwMTQxNDcwODAiLCJyZWdpb24iOiJvdmVyc2VhcyIsIm1lbWJlcnNoaXAiOnsibGV2ZWwiOjEwfX0.R5_6bmclWR8a5bFxgm1DCNnPnjGAXPxQNtAsN9ifncyVHXY8kC9Cz6rexQ3REHBksqD859mjjL9IEVTtUGkJ4w";

const generateDeviceId = () => {
  const bytes = CryptoJS.lib.WordArray.random(8);
  return BigInt("0x" + bytes.toString()).toString();
};

const api = axios.create({
  baseURL: "https://www.kimi.com/api",
  headers: {
    "authorization": `Bearer ${TOKEN}`,
    "content-type": "application/json",
    "origin": "https://www.kimi.com",
    "user-agent": "Mozilla/5.0 (Linux; Android 10)",
    "x-msh-device-id": generateDeviceId(),
    "x-msh-platform": "web",
    "x-language": "id-ID",
  },
});

export async function createSession(name: string = "Chat Baru") {
  const res = await api.post("/chat", {
    name,
    born_from: "home",
    kimiplus_id: "kimi",
    is_example: false,
    source: "web",
    tags: [],
  });
  return res.data.id;
}

export async function sendMessage(chatId: string, message: string) {
  const req = {
    kimiplus_id: "kimi",
    model: "k2",
    use_search: true,
    messages: [{ role: "user", content: message }],
  };

  const response = await api.post(`/chat/${chatId}/completion/stream`, req, {
    responseType: "stream",
  });

  return response.data;
}
