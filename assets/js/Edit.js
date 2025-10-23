document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("edit-form");
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) return;

  // Charger les infos du contact
  try {
    const res = await fetch(`http://localhost:3001/contact/${id}`);
    if (!res.ok) throw new Error("Impossible de récupérer le contact");
    const contact = await res.json();

    form.name.value = contact.name;
    form.email.value = contact.email;
    form.phone.value = contact.phone;
    form.location.value = contact.location;
    form.message.value = contact.message;
  } catch (err) {
    console.error(err);
  }

  // Mettre à jour le contact
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedContact = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      location: form.location.value.trim(),
      message: form.message.value.trim()
    };

    try {
      const res = await fetch(`http://localhost:3001/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedContact)
      });

      if (!res.ok) throw new Error("Erreur lors de la mise à jour");

      // Retour vers la liste
      window.location.href = "contact.html";
    } catch (err) {
      console.error(err);
    }
  });
  
});
