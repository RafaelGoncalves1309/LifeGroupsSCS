
// ======================
// LOGOUT
// ======================

window.logout = async function () {
    window.location.href = "../pages/login.html";
};

// ======================
// CARDS (NAVEGAÇÃO)
// ======================

document.querySelectorAll(".card").forEach(card => {

    card.addEventListener("click", () => {

        const view = card.dataset.view;

        if (view === "criancas") {
            window.location.href = "/pages/cadastro.html";
        }

        if (view === "campanhas") {
            window.location.href = "/pages/campanha_acampamento.html";
        }

    });

});