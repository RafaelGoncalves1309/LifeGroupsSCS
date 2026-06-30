import { supabase } from "./supabase.js";

// ======================
// ID DA CRIANÇA
// ======================

const params = new URLSearchParams(window.location.search);

const id = params.get("id");

// ======================
// VOLTAR
// ======================

window.voltar = function () {

    window.location.href = "cadastro.html";

};

// ======================
// MÁSCARA TELEFONE
// ======================

const telefoneInput = document.getElementById("telefone");

telefoneInput.addEventListener("input", (e) => {

    let value = e.target.value;

    value = value.replace(/\D/g, "");

    if (value.length <= 2) {

        value = value.replace(/(\d{0,2})/, "($1");

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

// ======================
// CARREGAR CRIANÇA
// ======================

async function carregarCrianca() {

    const { data, error } = await supabase
        .from("criancas")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {

        console.log(error);

        alert("Erro ao carregar criança");

        return;
    }

    document.getElementById("nome").value =
        data.nome || "";

    document.getElementById("nascimento").value =
        data.data_nascimento || "";

    document.getElementById("sexo").value =
        data.sexo || "";

    document.getElementById("responsavel").value =
        data.nome_responsavel || "";

    document.getElementById("telefone").value =
        data.telefone || "";

    document.getElementById("endereco").value =
        data.endereco || "";

    document.getElementById("serie").value =
        data.serie_escolar || "";

    document.getElementById("irmaos").value =
        data.possui_irmaos || "";

    document.getElementById("qtd_irmaos").value =
        data.quantidade_irmaos || "";

    document.getElementById("blusa").value =
        data.tamanho_blusa || "";

    document.getElementById("calca").value =
        data.tamanho_calca || "";

    document.getElementById("calcado").value =
        data.tamanho_calcado || "";

    document.getElementById("hobby").value =
        data.hobby || "";

    document.getElementById("religiao").value =
        data.religiao_familia || "";

    document.getElementById("observacoes").value =
        data.observacoes || "";

    document.getElementById("ativo").value =
        data.ativo || "Sim";

    // FOTO ATUAL

    if (data.foto_url) {

        const fotoAtual =
            document.getElementById("foto-atual");

        if (fotoAtual) {

            fotoAtual.src =
                `https://tcsgtzdmfzcqlaagnlcr.supabase.co/storage/v1/object/public/fotos-criancas/${data.foto_url}`;

        }

    }

}

carregarCrianca();

// ======================
// ATUALIZAR CRIANÇA
// ======================

window.atualizarCrianca = async function () {

    let fotoUrl = null;

    const file =
        document.getElementById("foto").files[0];

    // ======================
    // NOVA FOTO
    // ======================

    if (file) {

        const nomeArquivo =
            `${Date.now()}_${file.name}`;

        const { error: uploadError } =
            await supabase
                .storage
                .from("fotos-criancas")
                .upload(nomeArquivo, file);

        if (uploadError) {

            console.log(uploadError);

            alert("Erro ao enviar foto");

            return;
        }

        fotoUrl = nomeArquivo;

    }

    // ======================
    // DADOS
    // ======================

    const dadosAtualizados = {

        nome:
            document.getElementById("nome").value,

        data_nascimento:
            document.getElementById("nascimento").value || null,

        sexo:
            document.getElementById("sexo").value,

        nome_responsavel:
            document.getElementById("responsavel").value,

        telefone:
            document.getElementById("telefone").value,

        endereco:
            document.getElementById("endereco").value,

        serie_escolar:
            document.getElementById("serie").value,

        possui_irmaos:
            document.getElementById("irmaos").value,

        quantidade_irmaos:
            document.getElementById("qtd_irmaos").value,

        tamanho_blusa:
            document.getElementById("blusa").value,

        tamanho_calca:
            document.getElementById("calca").value,

        tamanho_calcado:
            document.getElementById("calcado").value,

        hobby:
            document.getElementById("hobby").value,

        religiao_familia:
            document.getElementById("religiao").value,

        observacoes:
            document.getElementById("observacoes").value,

        ativo:
            document.getElementById("ativo").value

    };

    // ======================
    // ATUALIZA FOTO
    // ======================

    if (fotoUrl) {

        dadosAtualizados.foto_url = fotoUrl;

    }

    // ======================
    // UPDATE
    // ======================

    const { error } = await supabase
        .from("criancas")
        .update(dadosAtualizados)
        .eq("id", id);

    if (error) {

        console.log(error);

        alert("Erro ao atualizar criança");

        return;
    }

    alert("Dados atualizados com sucesso!");

    window.location.href = "cadastro.html";

};