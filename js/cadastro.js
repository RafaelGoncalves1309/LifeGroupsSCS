import { supabase } from "./supabase.js";

// ======================
// PROTEÇÃO DE ROTA
// ======================

(async () => {

    const { data } = await supabase.auth.getUser();

    if (!data?.user) {
        window.location.replace("../login.html");
        return;
    }

    carregarCriancas();

})();

// ======================
// ELEMENTOS
// ======================

const lista = document.getElementById("lista-criancas");

// ======================
// UTIL: IDADE
// ======================

function calcularIdade(dataNascimento) {

    if (!dataNascimento) return "-";

    const hoje = new Date();
    const nasc = new Date(dataNascimento);

    let idade = hoje.getFullYear() - nasc.getFullYear();

    const mes = hoje.getMonth() - nasc.getMonth();

    if (
        mes < 0 ||
        (mes === 0 && hoje.getDate() < nasc.getDate())
    ) {
        idade--;
    }

    return idade;
}

// ======================
// UTIL: DATA
// ======================

function formatarData(data) {

    if (!data) return "";

    const [ano, mes, dia] = data.split("-");

    return `${dia}-${mes}-${ano}`;
}

// ======================
// CARREGAR CRIANÇAS
// ======================

async function carregarCriancas() {

    const { data, error } = await supabase
        .from("criancas")
        .select("*")
        .order("nome");

    if (error) {
        console.error("Erro ao buscar crianças:", error);
        return;
    }

    lista.innerHTML = "";

    data.forEach((crianca) => {

        const fotoUrl = crianca.foto_url
            ? `https://tcsgtzdmfzcqlaagnlcr.supabase.co/storage/v1/object/public/fotos-criancas/${crianca.foto_url}`
            : "/imagens/default.png";

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>
                <img class="foto-crianca" src="${fotoUrl}" alt="${crianca.nome}">
            </td>

            <td>${crianca.nome || ""}</td>
            <td>${formatarData(crianca.data_nascimento)}</td>
            <td>${calcularIdade(crianca.data_nascimento)} anos</td>
            <td>${crianca.nome_responsavel || ""}</td>
            <td>${crianca.telefone || ""}</td>
            <td>${crianca.ativo || "Não"}</td>

            <td>
                <button class="botao-editar" data-id="${crianca.id}">
                    Editar
                </button>
            </td>
        `;

        lista.appendChild(tr);

    });

    // eventos depois de renderizar
    document.querySelectorAll(".botao-editar").forEach(btn => {

        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            window.location.href = `editar.html?id=${id}`;
        });

    });
}

// ======================
// NOVA CRIANÇA
// ======================

document.getElementById("btnNovaCrianca")
    ?.addEventListener("click", () => {
        window.location.href = "inserir.html";
    });

// ======================
// BUSCA GLOBAL
// ======================

const campoBusca = document.getElementById("buscaGlobal");

campoBusca?.addEventListener("input", () => {

    const texto = campoBusca.value.toLowerCase();

    const linhas = document.querySelectorAll("#lista-criancas tr");

    linhas.forEach(linha => {

        const conteudo = linha.textContent.toLowerCase();

        linha.style.display =
            conteudo.includes(texto)
                ? ""
                : "none";

    });

});

// ======================
// LOGOUT
// ======================

window.voltar = async function () {

    
    window.location.href = "../pages/admin.html";

};