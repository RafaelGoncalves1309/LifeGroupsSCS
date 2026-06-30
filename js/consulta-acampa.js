import { supabase } from "./supabase.js";

const cpfInput = document.getElementById("cpf");
const resultado = document.getElementById("resultado");
const btnBuscar = document.getElementById("btn-buscar");

// ======================
// MÁSCARA CPF
// ======================

cpfInput.addEventListener("input", (e) => {

    let v = e.target.value.replace(/\D/g, "").slice(0, 11);

    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    e.target.value = v;
});

// ======================
// BUSCA
// ======================

btnBuscar.addEventListener("click", buscar);

async function buscar() {

    const cpf = cpfInput.value.replace(/\D/g, "");

    if (!cpf) {
        alert("Digite seu CPF.");
        return;
    }

    const { data, error } = await supabase
        .from("acampakids2026")
        .select("*")
        .eq("cpf_padrinho", cpf);

    if (error) {
        console.log(error);
        alert("Erro ao buscar dados.");
        return;
    }

    if (!data || data.length === 0) {
        resultado.innerHTML = "<p>Nenhum apadrinhamento encontrado.</p>";
        return;
    }

    resultado.innerHTML = data.map(renderCard).join("");
}

// ======================
// RENDER DO CARD
// ======================

function renderCard(c) {

    const status = c.status || "pendente";

    const statusClass =
        status === "entregue"
            ? "entregue"
            : "pendente";

    return `
    <div class="card">

        <div class="card-header">
            <img src="${c.foto_url 
                ? 'https://tcsgtzdmfzcqlaagnlcr.supabase.co/storage/v1/object/public/fotos-criancas/' + c.foto_url
                : '/imagens/default.png'}">

            <div>
                <h2>${c.nome}</h2>
                <small>Apadrinhado</small>
            </div>
        </div>

        <div class="section-title">🧒 Criança</div>

        <div class="row"><span>👕 Blusa</span><span>${c.tamanho_blusa || "-"}</span></div>
        <div class="row"><span>👖 Calça</span><span>${c.tamanho_calca || "-"}</span></div>
        <div class="row"><span>👟 Calçado</span><span>${c.tamanho_calcado || "-"}</span></div>

        <div class="divisor"></div>

        <div class="section-title">🎁 Apadrinhamento</div>

        <div class="row"><span>Nome</span><span>${c.nome_padrinho || "-"}</span></div>
        <div class="row"><span>CPF</span><span>${c.cpf_padrinho || "-"}</span></div>
        <div class="row"><span>Telefone</span><span>${c.telefone_padrinho || "-"}</span></div>
        <div class="row"><span>Email</span><span>${c.email_padrinho || "-"}</span></div>

        <div class="divisor"></div>

        <div class="section-title">📦 Entrega</div>

        <div class="row"><span>Local</span><span>${c.local_entrega || "Campus XXX"}</span></div>
        <div class="row"><span>Prazo</span><span>${c.data_limite || "-"}</span></div>

        <div class="row">
            <span>Status</span>
            <span class="tag ${statusClass}">
                ${status}
            </span>
        </div>

    </div>
    `;
}

document
    .getElementById("btn-voltar")
    .addEventListener("click", () => {

        window.location.href = "/pages/acampamento.html";

    });