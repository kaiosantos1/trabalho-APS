export const SERVICE_URLS = {
    cadastro: "http://localhost:5001",
    faturamento: "http://localhost:5002",
    agendamento: "http://localhost:5003"
};

export const STORAGE_KEYS = {
    role: "areashealth.role",
    patient: "areashealth.patient",
    patientRegistry: "areashealth.patientRegistry",
    medico: "areashealth.medico"
};

export function getStoredRole() {
    return localStorage.getItem(STORAGE_KEYS.role) || "";
}

export function setStoredRole(role) {
    localStorage.setItem(STORAGE_KEYS.role, role);
}

export function getStoredPatient() {
    const rawValue = localStorage.getItem(STORAGE_KEYS.patient);

    if (!rawValue) {
        return null;
    }

    try {
        return JSON.parse(rawValue);
    } catch {
        return null;
    }
}

export function setStoredPatient(patient) {
    localStorage.setItem(STORAGE_KEYS.patient, JSON.stringify(patient));
}

export function getStoredPatientsRegistry() {
    const rawValue = localStorage.getItem(STORAGE_KEYS.patientRegistry);

    if (!rawValue) {
        return [];
    }

    try {
        const parsedValue = JSON.parse(rawValue);
        return Array.isArray(parsedValue) ? parsedValue : [];
    } catch {
        return [];
    }
}

export function setStoredPatientsRegistry(patients) {
    localStorage.setItem(STORAGE_KEYS.patientRegistry, JSON.stringify(Array.isArray(patients) ? patients : []));
}

export function addStoredPatientToRegistry(patient) {
    if (!patient || typeof patient !== "object") {
        return;
    }

    const existingPatients = getStoredPatientsRegistry();
    const filteredPatients = existingPatients.filter(item => item.id !== patient.id && item.cpf !== patient.cpf);
    filteredPatients.unshift(patient);
    setStoredPatientsRegistry(filteredPatients);
}

export function clearStoredPatient() {
    localStorage.removeItem(STORAGE_KEYS.patient);
}

export function getStoredMedico() {
    const rawValue = localStorage.getItem(STORAGE_KEYS.medico);

    if (!rawValue) {
        return null;
    }

    try {
        return JSON.parse(rawValue);
    } catch {
        return null;
    }
}

export function setStoredMedico(medico) {
    localStorage.setItem(STORAGE_KEYS.medico, JSON.stringify(medico));
}

export function parseCsvList(value) {
    if (!value) {
        return [];
    }

    return value
        .split(",")
        .map(item => item.trim())
        .filter(Boolean);
}

export function parseNumberList(value) {
    return parseCsvList(value)
        .map(item => Number(item))
        .filter(item => Number.isFinite(item));
}

export function formatDate(value) {
    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString("pt-BR");
}

export function formatDateTime(value) {
    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short"
    });
}

export function formatCurrency(value) {
    const numericValue = Number(value || 0);

    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(Number.isFinite(numericValue) ? numericValue : 0);
}

export async function requestJson(service, path, options = {}) {
    const { method = "GET", body, headers = {} } = options;
    const response = await fetch(`${SERVICE_URLS[service]}${path}`, {
        method,
        headers: {
            ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
            ...headers
        },
        body: body !== undefined ? JSON.stringify(body) : undefined
    });

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json") ? await response.json() : null;

    if (!response.ok) {
        throw new Error(data?.erro || data?.message || `Falha ao acessar ${path} (${response.status})`);
    }

    return data;
}

export function getTodayDate() {
    return new Date().toISOString().slice(0, 10);
}
