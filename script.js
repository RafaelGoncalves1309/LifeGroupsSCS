// script.js FINAL COMPLETO

const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRgdH0cmFEiB6QLb2SyvgXI5DxIp8T-Q80sBt-r8GFbixEOb04DbK78zVgYsao-uX9etEm3_IVc-AxC/pub?output=csv";

let map;
let markersLayer;
let markers = {};
let markerSelecionado = null;
let markerIgreja;

const igrejaLat = -23.6232483430473;
const igrejaLng = -46.5494611915352;

// 🔥 ÍCONES
const iconPadrao = L.icon({
  //iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  // iconUrl: 'https://cdn-icons-png.flaticon.com/512/660/660624.png',
  iconUrl: 'https://cdn-icons-png.flaticon.com/128/17939/17939340.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30]
});

const iconSelecionado = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

const iconIgreja = L.icon({
  //iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684809.png',
 // iconUrl: 'https://cdn-icons-png.flaticon.com/128/11354/11354912.png',
 iconUrl: 'logo_paz.png',
  iconSize: [35, 35],
  iconAnchor: [17, 35]
});


// ================= BUSCAR DADOS =================
async function buscarGrupos() {
  const res = await fetch(sheetURL + "&t=" + new Date().getTime());
  const csvText = await res.text();

  const grupos = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true
  }).data;

  const gruposCorrigidos = grupos.map(g => {
    const obj = {};
    for (let key in g) obj[key.trim()] = g[key].trim();
    return obj;
  });

  return gruposCorrigidos.map(g => ({
    ...g,
    latitude: parseFloat(g.Latitude),
    longitude: parseFloat(g.Longitude)
  }));
}

// ================= INICIAR MAPA =================
async function iniciarMapa() {
  if (map) map.remove();

  map = L.map('mapa').setView([igrejaLat, igrejaLng], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  markersLayer = L.layerGroup().addTo(map);

  // ⛪ IGREJA FIXA
  markerIgreja = L.marker([igrejaLat, igrejaLng], { icon: iconIgreja })
    .addTo(map)
    .bindPopup("Campus São Caetano", {
      offset: [0,-20]
    })
    .openPopup();

  const grupos = await buscarGrupos();

  mostrarGrupos(grupos, igrejaLat, igrejaLng);
  mostrarMapa(grupos, igrejaLat, igrejaLng);
}

// ================= DISTÂNCIA =================
function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ================= LISTA =================
function mostrarGrupos(grupos, userLat, userLng) {
  const div = document.getElementById("lista");
  div.innerHTML = "";

  const gruposFiltrados = aplicarFiltros(grupos);

  gruposFiltrados.sort((a, b) =>
    calcularDistancia(userLat, userLng, a.latitude, a.longitude) -
    calcularDistancia(userLat, userLng, b.latitude, b.longitude)
  );

  if (gruposFiltrados.length === 0) {
    div.innerHTML = "<p>Nenhum Life encontrado com esses filtros.</p>";
    return;
  }

  gruposFiltrados.forEach((g, index) => {
    const dist = calcularDistancia(userLat, userLng, g.latitude, g.longitude).toFixed(2);

    const card = document.createElement("div");
    card.classList.add("life-card");

    if (index === 0) {
      card.classList.add("proximo");
    }

    card.innerHTML = `
      <div class="life-titulo">${g["Nome do Life"]}</div>

      <div class="life-info">
        ${g.Endereco}, ${g.Bairro}, ${g.Cidade}
      </div>

      <div class="life-info">
        ${g.Dia} às ${g.Horario}
      </div>

      <div class="life-info">
        Líder: ${g.Lider} | ${g.Telefone}
      </div>

      <div class="life-info">
        Público: ${g.Publico}
      </div>

      <div class="life-distancia">
        📍 ${dist} km de você
      </div>
    `;

    // 🔥 CLICK → DESTACA NO MAPA
    card.addEventListener("click", () => {
      const marker = markers[g["Nome do Life"]];
      if (!marker) return;

      if (markerSelecionado) {
        markerSelecionado.setIcon(iconPadrao);
      }

      marker.setIcon(iconSelecionado);
      marker.openPopup();

      markerSelecionado = marker;

      map.setView([g.latitude, g.longitude], 15);
    });

    div.appendChild(card);
  });
}

function mostrarMapa(grupos, userLat, userLng) {
  map.setView([userLat, userLng], 15);

  markersLayer.clearLayers();
  markers = {}; // limpa referência

  // 🔥 verifica se é a mesma localização da igreja
  const mesmaLocalizacao = 
    Math.abs(userLat - igrejaLat) < 0.0001 &&
    Math.abs(userLng - igrejaLng) < 0.0001;

  // ⛪ mantém igreja fixa
  if (markerIgreja) {
    markerIgreja.addTo(map);

    // 🔥 se for a mesma localização, abre o popup da igreja
    if (mesmaLocalizacao) {
      markerIgreja.openPopup();
    }
  }

  // 📍 usuário (só se NÃO for a igreja)
  if (!mesmaLocalizacao) {
    L.marker([userLat, userLng])
      .addTo(markersLayer)
      .bindPopup("Você está aqui")
      .openPopup();
  }

  // 🔥 aplica filtros
  const gruposFiltrados = aplicarFiltros(grupos);

  gruposFiltrados.forEach(g => {
    if (!isNaN(g.latitude) && !isNaN(g.longitude)) {
      const dist = calcularDistancia(userLat, userLng, g.latitude, g.longitude).toFixed(2);

      const marker = L.marker([g.latitude, g.longitude], { icon: iconPadrao })
        .addTo(markersLayer)
        .bindPopup(`
          <b>${g["Nome do Life"]}</b><br>
          ${g.Endereco}<br>
          ${g.Bairro}, ${g.Cidade}<br>
          ${g.Dia} às ${g.Horario}<br>
          Distância: ${dist} km<br>
          Público: ${g.Publico}
        `);

      markers[g["Nome do Life"]] = marker;
    }
  });
}

// ================= MAPA =================
/* function mostrarMapa(grupos, userLat, userLng) {
  map.setView([userLat, userLng], 15);

  markersLayer.clearLayers();
  markers = {}; // 🔥 limpa referência

  // ⛪ mantém igreja fixa
  if (markerIgreja) {
    markerIgreja.addTo(map);
  }

  // 📍 usuário
  L.marker([userLat, userLng])
    .addTo(markersLayer)
    .bindPopup("Você está aqui")
    .openPopup();

  const gruposFiltrados = aplicarFiltros(grupos);

  gruposFiltrados.forEach(g => {
    if (!isNaN(g.latitude) && !isNaN(g.longitude)) {
      const dist = calcularDistancia(userLat, userLng, g.latitude, g.longitude).toFixed(2);

      const marker = L.marker([g.latitude, g.longitude], { icon: iconPadrao })
        .addTo(markersLayer)
        .bindPopup(`
          <b>${g["Nome do Life"]}</b><br>
          ${g.Endereco}<br>
          ${g.Bairro}, ${g.Cidade}<br>
          ${g.Dia} às ${g.Horario}<br>
          Distância: ${dist} km<br>
          Público: ${g.Publico}
        `);

      markers[g["Nome do Life"]] = marker;
    }
  });
} */



// ================= GEOLOCALIZAÇÃO =================
function buscarLocalizacao() {
  navigator.geolocation.getCurrentPosition(async pos => {
    const userLat = pos.coords.latitude;
    const userLng = pos.coords.longitude;

    const grupos = await buscarGrupos();

    mostrarGrupos(grupos, userLat, userLng);
    mostrarMapa(grupos, userLat, userLng);
  });
}

// ================= GEOCODE =================
async function geocodeEnderecoOSM(endereco) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon)
    };
  }

  alert("Endereço não encontrado.");
  return null;
}

// ================= BOTÕES =================

document.getElementById("btn-buscar").addEventListener("click", async () => {
  const endereco = document.getElementById("input-endereco").value.trim();

  const grupos = await buscarGrupos();

  // 🔥 vazio → usa igreja
  if (!endereco) {
    mostrarGrupos(grupos, igrejaLat, igrejaLng);
    mostrarMapa(grupos, igrejaLat, igrejaLng);
    return;
  }

  // 🔥 tenta buscar endereço
  const pos = await geocodeEnderecoOSM(endereco);

  // 🔥 inválido → erro
  if (!pos) {
    alert("Endereço não encontrado!");
    return;
  }

  mostrarGrupos(grupos, pos.lat, pos.lng);
  mostrarMapa(grupos, pos.lat, pos.lng);
});

/*
document.getElementById("btn-buscar").addEventListener("click", async () => {
  const endereco = document.getElementById("input-endereco").value;

  if (!endereco) {
    alert("Digite um endereço válido!");
    return;
  }

  const pos = await geocodeEnderecoOSM(endereco);
  if (!pos) return;

  const grupos = await buscarGrupos();

  mostrarGrupos(grupos, pos.lat, pos.lng);
  mostrarMapa(grupos, pos.lat, pos.lng);
}); */

document.getElementById("btn-limpar").addEventListener("click", () => {
  document.getElementById("input-endereco").value = "";
  document.getElementById("filtroDia").value = "";
  document.getElementById("filtroPublico").value = "";
  document.getElementById("lista").innerHTML = "";

  iniciarMapa();
});

// ================= FILTROS =================
function aplicarFiltros(grupos) {
  const diaSelecionado = document.getElementById("filtroDia").value.toLowerCase();
  const publicoSelecionado = document.getElementById("filtroPublico").value.toLowerCase();

  return grupos.filter(g => {
    const diaGrupo = (g.Dia || "").toLowerCase();
    const publicoGrupo = (g.Publico || "").toLowerCase();

    const bateDia = !diaSelecionado || diaGrupo.includes(diaSelecionado);
    const batePublico = !publicoSelecionado || publicoGrupo.includes(publicoSelecionado);

    return bateDia && batePublico;
  });
}

// ================= AUTO UPDATE FILTRO =================
document.getElementById("filtroDia").addEventListener("change", atualizarBusca);
document.getElementById("filtroPublico").addEventListener("change", atualizarBusca);

async function atualizarBusca() {
  const endereco = document.getElementById("input-endereco").value;
  const grupos = await buscarGrupos();

  if (endereco) {
    const pos = await geocodeEnderecoOSM(endereco);
    if (!pos) return;

    mostrarGrupos(grupos, pos.lat, pos.lng);
    mostrarMapa(grupos, pos.lat, pos.lng);
  } else {
    mostrarGrupos(grupos, igrejaLat, igrejaLng);
    mostrarMapa(grupos, igrejaLat, igrejaLng);
  }
}

// ================= INÍCIO =================
window.onload = () => {
  iniciarMapa();
};

document.getElementById("input-endereco").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    document.getElementById("btn-buscar").click();
  }
});