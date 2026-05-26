const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const newsletterService = {
  subscribe: async (email: string, name?: string) => {
    const res = await fetch(`${API_BASE}/api/v2/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Subscription failed');
    return data;
  },
};
