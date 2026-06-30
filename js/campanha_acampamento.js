import { supabase } from "./supabase.js";

// ======================
// ELEMENTOS
// ======================

const lista = document.getElementById("listaCampanha");

const busca = document.getElementById("busca");

// ======================
// CARREGAR CAMPANHA
// ======================

async function carregarCampanha(){

    const {data,error}=await supabase

        .from("acampakids2026")

        .select("*")

        .order("nome");

    if(error){

        console.log(error);

        return;

    }

    atualizarDashboard(data);

    renderTabela(data);

}

// ======================
// DASHBOARD
// ======================

function atualizarDashboard(data){

    const total=data.length;

    const apadrinhadas=data.filter(c=>c.apadrinhado).length;

    const naoApadrinhadas=total-apadrinhadas;

    const entregues=data.filter(c=>c.status==="entregue").length;

    const pendentes=data.filter(c=>c.status==="pendente").length;

    document.getElementById("total").textContent=total;

    document.getElementById("naoApadrinhadas").textContent=naoApadrinhadas;

    document.getElementById("apadrinhadas").textContent=apadrinhadas;

    document.getElementById("percApadrinhadas").textContent=

        total?((apadrinhadas/total)*100).toFixed(1)+"%":"0%";

    document.getElementById("pendentes").textContent=pendentes;

    document.getElementById("entregues").textContent=entregues;

    document.getElementById("percEntregues").textContent=

        apadrinhadas?((entregues/apadrinhadas)*100).toFixed(1)+"%":"0%";

}

// ======================
// TABELA
// ======================

function renderTabela(data){

    lista.innerHTML="";

    data.forEach(c=>{

        lista.innerHTML+=`

        <tr>

            <td>

                <img

                    class="foto"

                    src="https://tcsgtzdmfzcqlaagnlcr.supabase.co/storage/v1/object/public/fotos-criancas/${c.foto_url}"

                >

            </td>

            <td>${c.nome}</td>

            <td>${c.nome_padrinho ?? "-"}</td>

             <td>${c.telefone_padrinho ?? "-"}</td>

            <td>${c.campus_padrinho ?? "-"}</td>

            <td>

                <span class="status ${c.status}">

                    ${c.status}

                </span>

            </td>

            <td>

                <button class="botao-editar">

                    Editar

                </button>

            </td>

        </tr>

        `;

    });

}

// ======================
// BUSCA
// ======================

busca.addEventListener("input",()=>{

    const texto=busca.value.toLowerCase();

    document.querySelectorAll("#listaCampanha tr").forEach(linha=>{

        linha.style.display=

            linha.textContent.toLowerCase().includes(texto)

            ?""

            :"none";

    });

});

// ======================
// VOLTAR
// ======================

document

.getElementById("btn-voltar")

.addEventListener("click",()=>{

    window.location.href="admin.html";

});

// ======================

carregarCampanha();