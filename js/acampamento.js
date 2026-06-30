import { supabase } from "./supabase.js";

const grid = document.getElementById("grid-criancas");

let criancaSelecionada = null;

// ======================
// CACHE ELEMENTOS
// ======================

const modal = document.getElementById("modal-crianca");
const fecharModal = document.getElementById("fechar-modal");

const modalFoto = document.getElementById("modal-foto");
const modalNome = document.getElementById("modal-nome");
const modalIdade = document.getElementById("modal-idade");

const modalBlusa = document.getElementById("modal-blusa");
const modalCalca = document.getElementById("modal-calca");
const modalCalcado = document.getElementById("modal-calcado");
const modalTextoCrianca = document.getElementById("modal-texto-crianca");

// ======================
// IDADE
// ======================

function calcularIdade(dataNascimento) {

    const hoje = new Date();
    const nasc = new Date(dataNascimento);

    let idade = hoje.getFullYear() - nasc.getFullYear();

    const mes = hoje.getMonth() - nasc.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nasc.getDate())) {
        idade--;
    }

    return idade;
}

// ======================
// FOTO
// ======================

function montarFoto(c) {

    const baseURL =
        "https://tcsgtzdmfzcqlaagnlcr.supabase.co/storage/v1/object/public/fotos-criancas/";

    if (!c.foto_url || c.foto_url.trim() === "") {
        return "/imagens/default.png";
    }

    if (c.foto_url.startsWith("http")) {
        return c.foto_url;
    }

    return baseURL + c.foto_url;
}

// ======================
// CARREGAR CRIANÇAS
// ======================

async function carregarCriancas() {

    const { data, error } = await supabase
        .from("acampakids2026")
        .select("*")
        .eq("apadrinhado", false);

    console.log("Dados recebidos:", data);

    if (error) {
        console.log(error);
        return;
    }

    if (!data || data.length === 0) {
        grid.innerHTML = "<p>Nenhuma criança encontrada.</p>";
        return;
    }

    let html = "";

    data.forEach((c, index) => {

        const foto = montarFoto(c);

        html += `
            <div class="card-crianca" data-index="${index}">
                <img
                    class="card-img"
                    src="${foto}"
                    alt="${c.nome}"
                >

                <div class="overlay">
                    <h3>${c.nome}</h3>
                    <p>Clique para ver mais</p>
                </div>
            </div>
        `;
    });

    grid.innerHTML = html;

    // ======================
    // IMAGEM DEFAULT
    // ======================

    grid.querySelectorAll(".card-img").forEach(img => {

        img.addEventListener("error", () => {

            if (img.dataset.fallback) return;

            img.dataset.fallback = "true";

            img.classList.add("img-default");

            img.src = "/imagens/default.png";
        });

    });

    // ======================
    // EVENTOS DOS CARDS
    // ======================

    const cards = grid.querySelectorAll(".card-crianca");

    cards.forEach((card, index) => {

        card.addEventListener("click", () => {

            console.log("Card clicado:");

            console.log(data[index]);

            abrirModal(data[index]);

        });

    });

}

// ======================
// ABRIR MODAL
// ======================

function abrirModal(c) {

    console.log("Objeto recebido no modal:");

    console.log(c);

    criancaSelecionada = c;

    modalFoto.src = montarFoto(c);

    modalNome.textContent = c.nome;

    modalIdade.textContent =
        c.data_nascimento
            ? `${calcularIdade(c.data_nascimento)} anos`
            : "";

    modalBlusa.textContent = c.tamanho_blusa || "-";
    modalCalca.textContent = c.tamanho_calca || "-";
    modalCalcado.textContent = c.tamanho_calcado || "-";

    modalTextoCrianca.textContent =
        c.texto_crianca ||
        "Essa criança ainda não deixou uma mensagem 💙";

    modal.classList.remove("hidden");
}

// ======================
// FECHAR
// ======================

fecharModal.addEventListener("click", () => {

    modal.classList.add("hidden");

});

// ======================
// APADRINHAR
// ======================

document.getElementById("btn-apadrinhar").addEventListener("click", () => {

    console.log("Botão clicado");

    console.log("Crianca selecionada:");

    console.log(criancaSelecionada);

    if (!criancaSelecionada) {

        alert("Nenhuma criança selecionada.");

        return;
    }

    console.log("crianca_id =", criancaSelecionada.crianca_id);

    const url =
        "/pages/apadrinhar.html?id=" + criancaSelecionada.crianca_id;

    console.log("Redirecionando para:");

    console.log(url);

    console.log("OBJETO:", criancaSelecionada);
console.log("CRIANCA_ID:", criancaSelecionada.crianca_id);
console.log("URL:", "/pages/apadrinhar.html?id=" + criancaSelecionada.crianca_id);

    window.location.href = url;

});



// ======================
// ABRIR PAGINA DE ACOMPANHAMENTO
// ======================
const btn = document.querySelector(".btn-acompanhamento");

if (btn) {
    btn.addEventListener("click", () => {
        window.location.href = "/pages/consulta-acampa.html";
    });
}


// ======================
// BOTÃO VOLTAR
// ======================

document.querySelector(".btn-voltar").addEventListener("click", () => {
    window.location.href = "../index.html";
});

// ======================
// INIT
// ======================

carregarCriancas();