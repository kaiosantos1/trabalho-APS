const API_URL = "http://localhost:5001";

async function carregarEspecialidades() {
    const resposta = await fetch(`${API_URL}/especialidades`);
    const especialidades = await resposta.json();

    const lista = document.getElementById("listaEspecialidades");
    lista.innerHTML = "";

    especialidades.forEach(e => {
        const item = document.createElement("li");
        item.textContent = `${e.id} - ${e.nome}`;
        lista.appendChild(item);
    });
}

async function cadastrarEspecialidade() {
    const nome = document.getElementById("especialidadeNome").value;

    await fetch(`${API_URL}/especialidades`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ nome })
    });

    document.getElementById("especialidadeNome").value = "";
    carregarEspecialidades();
}

async function carregarPacientes() {
    const resposta = await fetch(`${API_URL}/pacientes`);
    const pacientes = await resposta.json();

    const lista = document.getElementById("listaPacientes");
    lista.innerHTML = "";

    pacientes.forEach(p => {
        const item = document.createElement("li");
        item.textContent = `${p.id} - ${p.nome} | CPF: ${p.cpf} | Tel: ${p.telefone} | Email: ${p.email}`;
        lista.appendChild(item);
    });
}

async function cadastrarPaciente() {
    const nome = document.getElementById("pacienteNome").value;
    const cpf = document.getElementById("pacienteCpf").value;
    const telefone = document.getElementById("pacienteTelefone").value;
    const email = document.getElementById("pacienteEmail").value;

    await fetch(`${API_URL}/pacientes`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ nome, cpf, telefone, email })
    });

    document.getElementById("pacienteNome").value = "";
    document.getElementById("pacienteCpf").value = "";
    document.getElementById("pacienteTelefone").value = "";
    document.getElementById("pacienteEmail").value = "";

    carregarPacientes();
}

async function carregarMedicos() {
    const resposta = await fetch(`${API_URL}/medicos`);
    const medicos = await resposta.json();

    const lista = document.getElementById("listaMedicos");
    lista.innerHTML = "";

    medicos.forEach(m => {
        const item = document.createElement("li");
        item.textContent = `${m.id} - ${m.nome} | CRM: ${m.crm} | Especialidade ID: ${m.especialidade_id}`;
        lista.appendChild(item);
    });
}

async function cadastrarMedico() {
    const nome = document.getElementById("medicoNome").value;
    const crm = document.getElementById("medicoCrm").value;
    const especialidade_id = Number(document.getElementById("medicoEspecialidadeId").value);

    await fetch(`${API_URL}/medicos`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ nome, crm, especialidade_id })
    });

    document.getElementById("medicoNome").value = "";
    document.getElementById("medicoCrm").value = "";
    document.getElementById("medicoEspecialidadeId").value = "";

    carregarMedicos();
}

carregarEspecialidades();
carregarPacientes();
carregarMedicos();