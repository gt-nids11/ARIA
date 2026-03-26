const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function isTokenExpired(token: string): boolean {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 < Date.now();
    } catch {
        return true;
    }
}

function getAuthHeaders(isFormData = false): any {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token || isTokenExpired(token)) {
        if (typeof window !== "undefined") {
            localStorage.clear();
            window.location.href = '/login';
        }
        return {};
    }
    const headers: any = {
        'Authorization': `Bearer ${token}`
    };
    if (!isFormData) headers['Content-Type'] = 'application/json';
    return headers;
}

async function apiCall(url: string, options: any = {}, isFormData = false) {
    try {
        const response = await fetch(
            `${BASE_URL}${url}`,
            {
                ...options,
                headers: {
                    ...getAuthHeaders(isFormData),
                    ...options.headers
                }
            }
        );
        
        if (response.status === 401) {
            if (typeof window !== "undefined") {
                localStorage.clear();
                window.location.href = '/login';
            }
            return null;
        }
        
        if (response.status === 429) {
            throw new Error('Too many requests. Please wait and try again.');
        }
        
        if (!response.ok) {
            let errMsg = "API Error";
            try {
                const errData = await response.json();
                errMsg = errData.detail || errMsg;
            } catch(e) {}
            throw new Error(errMsg);
        }
        
        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.includes("csv")) {
            return response.blob();
        }
        
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export const auth = {
    login: async (email: string, password: string) => {
        // We use standard fetch here because apiCall requires a valid token
        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        
        if (res.status === 429) {
            throw new Error('Too many requests. Please wait and try again.');
        }
        
        const data = await res.json();
        
        if (!res.ok) {
            throw new Error(data.detail || "Login failed");
        }
        
        if (data.access_token) {
            if (typeof window !== "undefined") {
                localStorage.setItem("token", data.access_token);
            }
        }
        return data;
    },
    register: async (name: string, email: string, password: string, role: string) => {
        // Register doesn't strictly need auth but following pattern
        const res = await fetch(`${BASE_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, role })
        });
        if (res.status === 429) {
            throw new Error('Too many requests. Please wait and try again.');
        }
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.detail || "Registration failed");
        }
        return data;
    },
    logout: async () => {
        try {
            await apiCall('/auth/logout', { method: 'POST' });
        } finally {
            if (typeof window !== "undefined") {
                localStorage.clear();
                window.location.href = '/login';
            }
        }
    }
};

export const documents = {
    upload: async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        return apiCall("/documents/upload", {
            method: "POST", body: formData
        }, true);
    },
    list: async () => apiCall("/documents"),
    query: async (question: string) => apiCall("/documents/query", {
        method: "POST", body: JSON.stringify({ question })
    })
};

export const meetings = {
    upload: async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        return apiCall("/meetings/upload", {
            method: "POST", body: formData
        }, true);
    },
    list: async () => apiCall("/meetings")
};

export const speeches = {
    draft: async (data: any) => apiCall("/speeches/draft", {
        method: "POST", body: JSON.stringify(data)
    })
};

export const complaints = {
    list: async (filters: any = {}) => {
        const q = new URLSearchParams(filters).toString();
        return apiCall(`/complaints${q ? '?'+q : ''}`);
    },
    heatmap: async () => apiCall("/complaints/heatmap"),
    create: async (data: any) => apiCall("/complaints", {
        method: "POST", body: JSON.stringify(data)
    }),
    stats: async () => apiCall("/complaints/stats")
};

export const alerts = {
    list: async (filters: any = {}) => {
        const q = new URLSearchParams(filters).toString();
        return apiCall(`/alerts${q ? '?'+q : ''}`);
    },
    resolve: async (id: number) => apiCall(`/alerts/${id}/resolve`, {
        method: "PATCH"
    })
};

export const schedule = {
    list: async (date?: string) => apiCall(`/schedule${date ? '?date='+date : ''}`),
    create: async (data: any) => apiCall("/schedule", {
        method: "POST", body: JSON.stringify(data)
    }),
    getBriefing: async (id: number) => apiCall(`/schedule/${id}/briefing`)
};

export const dashboard = {
    getBrief: async () => apiCall("/dashboard/brief"),
    getStats: async () => apiCall("/dashboard/stats")
};

export const audit = {
    list: async (filters: any = {}) => {
        const q = new URLSearchParams(filters).toString();
        return apiCall(`/audit${q ? '?'+q : ''}`);
    },
    export: async () => {
        const blob = await apiCall("/audit/export");
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "audit.csv";
        a.click();
    }
};
