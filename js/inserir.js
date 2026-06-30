import { supabase } from "./supabase.js";


// voltar para admin
window.voltar = function () {
    window.location.href = "cadastro.html";
};


const telefoneInput = document.getElementById("telefone");

telefoneInput.addEventListener("input", (e) => {
    let value = e.target.value;

    value = value.replace(/\D/g, "");

    if (value.length <= 2) {
        value = value.replace(/(\d{0,2})/, "($1");
    } else if (value.length <= 7) {
        value = value.replace(/(\d{2})(\d{0,5})/, "($1) $2");
    } else {
        value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    }

    e.target.value = value;
});

// salvar criança
window.salvarCrianca = async function () {

    const nome = document.getElementById("nome").value;
    const nascimento = document.getElementById("nascimento").value;

    const sexo = document.getElementById("sexo").value;
    const responsavel = document.getElementById("responsavel").value;

    const telefone = document.getElementById("telefone").value;
    const endereco = document.getElementById("endereco").value;

    
    const serie = document.getElementById("serie").value;
    const irmaos = document.getElementById("irmaos").value;

    const qtd_irmaos = document.getElementById("qtd_irmaos").value;
    const blusa = document.getElementById("blusa").value;

    const calca = document.getElementById("calca").value;
    const calcado = document.getElementById("calcado").value;

    const hobby = document.getElementById("hobby").value;
    const religiao = document.getElementById("religiao").value;
    
    const observacoes = document.getElementById("observacoes").value;

    const file = document.getElementById("foto").files[0];

    

    let fotoUrl = null;

    // upload da foto
   if (file) {

        const nomeArquivo = `${Date.now()}_${file.name}`;

        const { error: uploadError } = await supabase
            .storage
            .from("fotos-criancas")
            .upload(nomeArquivo, file);

        if (uploadError) {
            alert("Erro ao enviar foto");
            console.log(uploadError);
            return;
        }

        fotoUrl = nomeArquivo;
        
    }  

    // insert no banco
    const { error } = await supabase
        .from("criancas")
        .insert([{
            nome: nome,
            data_nascimento: nascimento || null,
            sexo: sexo,
            nome_responsavel: responsavel,
            telefone: telefone,
            endereco: endereco,
            
            serie_escolar: serie,
            possui_irmaos: irmaos,
            quantidade_irmaos: qtd_irmaos,
            
            tamanho_blusa: blusa,
            tamanho_calca: calca,
            tamanho_calcado: calcado,
            hobby: hobby,
            religiao_familia: religiao,
            observacoes: observacoes,
            foto_url: fotoUrl
        }]);

    if (error) {
        console.log(error);
        alert("Erro ao salvar criança");
        return;
    }

    alert("Criança cadastrada com sucesso!");

    window.location.href = "cadastro.html";
};