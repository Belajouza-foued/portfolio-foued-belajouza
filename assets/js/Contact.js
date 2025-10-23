document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const tableBody = document.getElementById("contact-table-body");

  if (!form || !tableBody) {
    console.error("❌ Formulaire ou tableau non trouvé !");
    return;
  }

  // 🟢 Fonction pour charger tous les contacts
  async function loadContacts() {
    try {
      const res = await fetch("http://localhost:3001/contact");
      if (!res.ok) throw new Error("Erreur de chargement");
      const contacts = await res.json();

      tableBody.innerHTML = ""; // vider le tableau avant de le remplir

      contacts.forEach((c) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${c.name}</td>
          <td>${c.email}</td>
          <td>${c.phone}</td>
          <td>${c.location}</td>
          <td>${c.message}</td>
          <td>
            <button class="edit-btn" data-id="${c._id}">✏️</button>
            <button class="delete-btn" data-id="${c._id}">🗑️</button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    } catch (err) {
      console.error("⚠️ Erreur :", err);
    }
  }

  // 🟢 Ajouter un contact
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const location = document.getElementById("location").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !phone || !location || !message) {
      alert("⚠️ Tous les champs sont obligatoires !");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, location, message }),
      });

      if (!response.ok) throw new Error("Erreur HTTP : " + response.status);

      alert("✅ Message envoyé avec succès !");
      form.reset();
      loadContacts(); // recharger le tableau après ajout
    } catch (error) {
      console.error("Erreur lors de la requête :", error);
      alert("⚠️ Impossible d’envoyer le message. Vérifie le serveur NestJS !");
    }
  });

  // 🟢 Gérer les boutons Éditer et Supprimer
  tableBody.addEventListener("click", async (e) => {
    const btn = e.target;
    const id = btn.dataset.id;

    // Supprimer un contact
    if (btn.classList.contains("delete-btn")) {
      if (confirm("❌ Supprimer ce contact ?")) {
        await fetch(`http://localhost:3001/contact/${id}`, { method: "DELETE" });
        alert("🗑️ Contact supprimé !");
        loadContacts();
      }
    }
    // Modifier un contact
   
    if (btn.classList.contains("edit-btn")) {
      window.location.href = `edit.html?id=${id}`;
    }
  });

  // Charger les contacts au démarrage
  loadContacts();
});
