import { supabase } from "./supabase.js";

// =========================================
// ID DA CRIANÇA
// =========================================

const params = new URLSearchParams(window.location.search);
const criancaId = params.get("id");

console.log("QueryString:", window.location.search);
console.log("ID recebido:", criancaId);

// =========================================
// ELEMENTOS
// =========================================

const foto = document.getElementById("foto-crianca");
const nome = document.getElementById("nome-crianca");
const idade = document.getElementById("idade-crianca");

const blusa = document.getElementById("blusa");
const calca = document.getElementById("calca");
const calcado = document.getElementById("calcado");

const texto = document.getElementById("texto-crianca");

const cpfInput = document.getElementById("cpf");
const telefoneInput = document.getElementById("telefone");

const btnConfirmar =
    document.getElementById("btn-confirmar");

// =========================================
// MÁSCARA TELEFONE
// =========================================

telefoneInput.addEventListener("input", (e) => {

    let value = e.target.value.replace(/\D/g, "");

    if (value.length <= 2) {

        value = value.replace(
            /(\d{0,2})/,
            "($1"
        );

    } else if (value.length <= 7) {

        value = value.replace(
            /(\d{2})(\d{0,5})/,
            "($1) $2"
        );

    } else {

        value = value.replace(
            /(\d{2})(\d{5})(\d{0,4})/,
            "($1) $2-$3"
        );

    }

    e.target.value = value;

});

// =========================================
// MÁSCARA CPF
// =========================================

cpfInput.addEventListener("input", (e) => {

    let value = e.target.value
        .replace(/\D/g, "")
        .substring(0, 11);

    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    e.target.value = value;

});

// =========================================
// UTILITÁRIOS
// =========================================

function limparCPF(cpf) {

    return (cpf || "")
        .replace(/\D/g, "");

}

function calcularIdade(dataNascimento) {

    const hoje = new Date();
    const nasc = new Date(dataNascimento);

    let idade =
        hoje.getFullYear() - nasc.getFullYear();

    const mes =
        hoje.getMonth() - nasc.getMonth();

    if (
        mes < 0 ||
        (mes === 0 && hoje.getDate() < nasc.getDate())
    ) {
        idade--;
    }

    return idade;

}

// =========================================
// CARREGAR CRIANÇA
// =========================================

async function carregarCrianca() {

    if (!criancaId) {

        alert("Criança não encontrada.");
        return;

    }

    const { data, error } = await supabase
        .from("criancas")
        .select("*")
        .eq("id", criancaId)
        .single();

    if (error) {

        console.log(error);

        alert("Erro ao carregar criança.");

        return;

    }

    foto.src = data.foto_url
        ? `https://tcsgtzdmfzcqlaagnlcr.supabase.co/storage/v1/object/public/fotos-criancas/${data.foto_url}`
        : "/imagens/default.png";

    nome.textContent =
        data.nome || "Sem nome";

    idade.textContent =
        data.data_nascimento
            ? `${calcularIdade(data.data_nascimento)} anos`
            : "Idade não informada";

    blusa.textContent =
        `👕 ${data.tamanho_blusa || "-"}`;

    calca.textContent =
        `👖 ${data.tamanho_calca || "-"}`;

    calcado.textContent =
        `👟 ${data.tamanho_calcado || "-"}`;

    texto.textContent =
        data.texto_crianca ||
        "Essa criança ainda não deixou uma mensagem 💙";

}

// =========================================
// SALVAR APADRINHAMENTO
// =========================================

async function salvarApadrinhamento() {

    const nomePadrinho =
        document.getElementById("nome").value.trim();

    const cpfPadrinho =
        limparCPF(document.getElementById("cpf").value);

    const telefonePadrinho =
        document.getElementById("telefone").value.trim();

    const emailPadrinho =
        document.getElementById("email").value.trim();

    const campusPadrinho =
        document.getElementById("campus").value;

    // ======================
    // VALIDAÇÕES
    // ======================

    if (!nomePadrinho) {

        alert("Informe seu nome.");
        return;

    }

    if (cpfPadrinho.length !== 11) {

        alert("Informe um CPF válido.");
        return;

    }

    if (!telefonePadrinho) {

        alert("Informe seu telefone.");
        return;

    }

    if (!campusPadrinho) {

        alert("Selecione um campus.");
        return;

    }

    if (emailPadrinho) {

        const emailValido =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                .test(emailPadrinho);

        if (!emailValido) {

            alert("Informe um e-mail válido.");
            return;

        }

    }

    // ======================
    // VERIFICA APADRINHAMENTO
    // ======================

    const {
        data: crianca,
        error: erroConsulta
    } = await supabase
        .from("acampakids2026")
        .select("apadrinhado")
        .eq("crianca_id", criancaId)
        .single();

    if (erroConsulta) {

        console.log(erroConsulta);

        alert("Erro ao verificar apadrinhamento.");

        return;

    }

    if (crianca.apadrinhado) {

        alert(
            "Essa criança já foi apadrinhada por outra pessoa."
        );

        return;

    }

    // ======================
    // UPDATE ATÔMICO
    // ======================

    const { data, error } = await supabase
        .from("acampakids2026")
        .update({

            nome_padrinho: nomePadrinho,
            cpf_padrinho: cpfPadrinho,
            telefone_padrinho: telefonePadrinho,
            email_padrinho: emailPadrinho,
            campus_padrinho: campusPadrinho,

            apadrinhado: true

        })
        .eq("crianca_id", criancaId)
        .eq("apadrinhado", false)
        .select();

    if (error) {

        console.log(error);

        alert("Erro ao registrar apadrinhamento.");

        return;

    }

    if (!data || data.length === 0) {

        alert(
            "Essa criança já foi apadrinhada por outra pessoa."
        );

        return;

    }

    alert(
        "Apadrinhamento realizado com sucesso!"
    );

    window.location.href = "../index.html";

}

// =========================================
// EVENTOS
// =========================================

btnConfirmar.addEventListener(
    "click",
    salvarApadrinhamento
);

// =========================================
// INIT
// =========================================

carregarCrianca();