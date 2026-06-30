import { supabase } from "./supabase.js";

const form = document.getElementById("formLogin");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email =
        document.getElementById("email").value;

    const senha =
        document.getElementById("senha").value;

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password: senha
    });

    if (error) {

        document.getElementById("mensagem").textContent =
            "Usuário ou senha inválidos";

        return;
    }

    window.location.href = "admin.html";

});