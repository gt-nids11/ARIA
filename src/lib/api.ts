const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function getHeaders(isFormData = false) {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers: any = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (!isFormData) headers["Content-Type"] = "application/json";
    return headers;
}

async function fetchWithAuth(url: string, options: any = {}) {
    const res = await fetch(`${BASE_URL}${url}`, options);
    if (res.status === 401) {
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
    }
    if (!res.ok) {
        let errMsg = "API Error";
        try {
            const errData = await res.json();
            errMsg = errData.detail || errMsg;
        } catch(e) {}
        throw new Error(errMsg);
    }
    
    // For exported files
    const contentType = res.headers.get("Content-Type");
    if (contentType && contentType.includes("csv")) {
        return res.blob();
    }
    return res.json();
}

export const auth = {
    login: async (email: string, password: string) => {
        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.access_token) {
            localStorage.setItem("token", data.access_token);
        } else {
            throw new Error(data.detail || "Login failed");
        }
        return data;
    },
    register: async (name: string, email: string, password: string, role: string) => {
        return fetchWithAuth("/auth/register", {
            method: "POST", headers: getHeaders(),
            body: JSON.stringify({ name, email, password, role })
        });
    }
};

export const documents = {
    upload: async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        return fetchWithAuth("/documents/upload", {
            method: "POST", headers: getHeaders(true), body: formData
        });
    },
    list: async () => fetchWithAuth("/documents", { headers: getHeaders() }),
    query: async (question: string) => fetchWithAuth("/documents/query", {
        method: "POST", headers: getHeaders(), body: JSON.stringify({ question })
    })
};

export const meetings = {
    upload: async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        return fetchWithAuth("/meetings/upload", {
            method: "POST", headers: getHeaders(true), body: formData
        });
    },
    list: async () => fetchWithAuth("/meetings", { headers: getHeaders() })
};

export const speeches = {
    draft: async (data: any) => fetchWithAuth("/speeches/draft", {
        method: "POST", headers: getHeaders(), body: JSON.stringify(data)
    })
};

export const complaints = {
    list: async (filters: any = {}) => {
        const q = new URLSearchParams(filters).toString();
        return fetchWithAuth(`/complaints${q ? '?'+q : ''}`, { headers: getHeaders() });
    },
    heatmap: async () => fetchWithAuth("/complaints/heatmap", { headers: getHeaders() }),
    create: async (data: any) => fetchWithAuth("/complaints", {
        method: "POST", headers: getHeaders(), body: JSON.stringify(data)
    }),
    stats: async () => fetchWithAuth("/complaints/stats", { headers: getHeaders() })
};

export const alerts = {
    list: async (filters: any = {}) => {
        const q = new URLSearchParams(filters).toString();
        return fetchWithAuth(`/alerts${q ? '?'+q : ''}`, { headers: getHeaders() });
    },
    resolve: async (id: number) => fetchWithAuth(`/alerts/${id}/resolve`, {
        method: "PATCH", headers: getHeaders()
    })
};

export const schedule = {
    list: async (date?: string) => fetchWithAuth(`/schedule${date ? '?date='+date : ''}`, { headers: getHeaders() }),
    create: async (data: any) => fetchWithAuth("/schedule", {
        method: "POST", headers: getHeaders(), body: JSON.stringify(data)
    }),
    getBriefing: async (id: number) => fetchWithAuth(`/schedule/${id}/briefing`, { headers: getHeaders() })
};

export const dashboard = {
    getBrief: async () => fetchWithAuth("/dashboard/brief", { headers: getHeaders() }),
    getStats: async () => fetchWithAuth("/dashboard/stats", { headers: getHeaders() })
};

export const audit = {
    list: async (filters: any = {}) => {
        const q = new URLSearchParams(filters).toString();
        return fetchWithAuth(`/audit${q ? '?'+q : ''}`, { headers: getHeaders() });
    },
    export: async () => {
        const blob = await fetchWithAuth("/audit/export", { headers: getHeaders() });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "audit.csv";
        a.click();
    }
};
