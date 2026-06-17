// As URLs dos serviços são derivadas do endereço usado para abrir o frontend,
// para funcionar tanto localmente (localhost) quanto em uma VM (IP/domínio público).
// É possível sobrescrever via window.APP_CONFIG (ver frontend/config.js).
const _cfg = (typeof window !== "undefined" && window.APP_CONFIG) || {};
const _host = (typeof window !== "undefined" && window.location && window.location.hostname) || "localhost";
const _proto = (typeof window !== "undefined" && window.location && window.location.protocol.startsWith("http"))
    ? window.location.protocol
    : "http:";
const _base = _cfg.serviceHost || `${_proto}//${_host}`;

export const SERVICE_URLS = {
    cadastro: _cfg.cadastroUrl || `${_base}:5001`,
    faturamento: _cfg.faturamentoUrl || `${_base}:5002`,
    agendamento: _cfg.agendamentoUrl || `${_base}:5003`
};

export const STORAGE_KEYS = {
    role: "areashealth.role",
    patient: "areashealth.patient",
    patientRegistry: "areashealth.patientRegistry",
    medico: "areashealth.medico",
    token: "areashealth.token",
    auth: "areashealth.auth"
};

// Mapeia o perfil retornado no login para a rota da area correspondente.
export const PERFIL_ROTA = {
    diretor: "diretor",
    gerente: "gerente",
    atendente: "atendente",
    medico: "medico",
    paciente: "usuario"
};

export function getStoredToken() {
    return localStorage.getItem(STORAGE_KEYS.token) || "";
}

export function setStoredToken(token) {
    localStorage.setItem(STORAGE_KEYS.token, token || "");
}

export function getStoredAuth() {
    const rawValue = localStorage.getItem(STORAGE_KEYS.auth);
    if (!rawValue) {
        return null;
    }
    try {
        return JSON.parse(rawValue);
    } catch {
        return null;
    }
}

export function setStoredAuth(auth) {
    localStorage.setItem(STORAGE_KEYS.auth, JSON.stringify(auth || {}));
}

export function clearAuth() {
    Object.values(STORAGE_KEYS).forEach(chave => {
        if (chave !== STORAGE_KEYS.patientRegistry) {
            localStorage.removeItem(chave);
        }
    });
}

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
    const token = getStoredToken();
    const response = await fetch(`${SERVICE_URLS[service]}${path}`, {
        method,
        headers: {
            ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

// Autentica no cadastro-service. Lanca erro (ex.: "Usuario ou senha invalidos").
export async function login(perfil, username, senha) {
    return requestJson("cadastro", "/auth/login", {
        method: "POST",
        body: { perfil, username, senha }
    });
}

// Auto-cadastro de paciente (cria paciente + usuario e ja retorna o token).
export async function registrarPaciente(payload) {
    return requestJson("cadastro", "/auth/registro", {
        method: "POST",
        body: payload
    });
}

export function getTodayDate() {
    return new Date().toISOString().slice(0, 10);
}
