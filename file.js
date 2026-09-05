let donnees = JSON.parse(localStorage.getItem("donnees")) || {};

// Fonction pour ajouter un objet
function ajouterObjet() {
  let categorieBrute = document.getElementById("categorie").value.trim();
  const categorie = categorieBrute.toLowerCase();

  const objet = document.getElementById("objet").value;
  const importance = document.getElementById("importance").value;

  if (!categorie || !objet.trim()) {
    alert("Veuillez remplir tous les champs !");
    return;
  }

  if (!donnees[categorie]) {
    donnees[categorie] = [];
  }

  donnees[categorie].push({ nom: objet.trim(), importance });
  localStorage.setItem("donnees", JSON.stringify(donnees));

  // Une fois que l'objet est ajouté on affiche le bloc entier
  afficherCategories();

  document.getElementById("categorie").value = "";
  document.getElementById("objet").value = "";
  document.getElementById("importance").value = "";
}

// Le rendu visuel
function afficherCategories() {
  const container = document.getElementById("liste-categories");

  if (!container) {
    console.error("Conteneur non trouvé");
    return;
  }

  container.innerHTML = "";

  if (Object.keys(donnees).length === 0) {
    container.innerHTML = "<p>Aucune catégorie créée.</p>";
    return;
  }

  for (let cat in donnees) {
    const div = document.createElement("div");
    div.className = "categorie";
    div.innerHTML = `<h3>${cat}</h3>`;

    // Index sert à connaître la position de l'objet dans le tableau
    donnees[cat].forEach((item, index) => {
      // On crée un conteneur pour tout afficher

      const wrapper = document.createElement("div");
      wrapper.style.display = "inline-block";
      wrapper.style.margin = "3px";

      const span = document.createElement("span");
      span.className = `objet ${item.importance}`;

      // On enlève la margin du span puisqu'elle est gérée par le wrapper
      span.style.margin = "0";
      span.textContent = item.nom;

      // Bouton de suppression (avec du style évidemment)
      const btnSupprimer = document.createElement("button");
      btnSupprimer.textContent = "X";
      btnSupprimer.style.marginLeft = "5px";
      btnSupprimer.style.cursor = "pointer";
      btnSupprimer.style.borderRadius = "3px";
      btnSupprimer.style.border = "none";
      btnSupprimer.style.background = "#ddd";

      // On fait fonctionner le bouton..(quand même)
      btnSupprimer.addEventListener("click", function () {
        // On retire l'objet du tableau en utilisant sa position (index)
        donnees[cat].splice(index, 1);

        // Si jamais la catégorie se retrouve vide après la suppression, on l'efface complètement
        if (donnees[cat].length === 0) {
          delete donnees[cat];
        }

        // On sauvegarde la nouvelle version des données et on rafraîchit l'affichage
        localStorage.setItem("donnees", JSON.stringify(donnees));
        afficherCategories();
      });

      // On met l'objet et le bouton dans le conteneur, puis dans la catégorie
      wrapper.appendChild(span);
      wrapper.appendChild(btnSupprimer);
      div.appendChild(wrapper);
    });

    const divAjout = document.createElement("div");
    divAjout.style.marginTop = "10px";

    divAjout.innerHTML = `
      <input type="text" class="input-rapide" placeholder="Nouvel objet dans ${cat}" />
      <select class="select-rapide">
        <option value="rouge">Très important</option>
        <option value="jaune">Moyennement Important</option>
        <option value="vert">Pas très important</option>
      </select>
      <button class="btn-rapide">Ajouter ici</button>
    `;

    const btnRapide = divAjout.querySelector(".btn-rapide");

    btnRapide.addEventListener("click", function () {
      const nouvelObjet = divAjout.querySelector(".input-rapide").value;
      const nouvelleImportance = divAjout.querySelector(".select-rapide").value;

      if (!nouvelObjet.trim()) {
        alert("Veuillez saisir un nom d'objet !");
        return;
      }

      donnees[cat].push({
        nom: nouvelObjet.trim(),
        importance: nouvelleImportance,
      });

      localStorage.setItem("donnees", JSON.stringify(donnees));
      afficherCategories();
    });

    div.appendChild(divAjout);
    container.appendChild(div);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("btnAjouter").addEventListener("click", ajouterObjet);

  document.getElementById("objet").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      ajouterObjet();
    }
  });

  // Barre de recherche
  document.getElementById("recherche").addEventListener("input", function (e) {
    const texteRecherche = e.target.value.toLowerCase().trim();

    const blocsCategories = document.querySelectorAll(".categorie");

    blocsCategories.forEach((bloc) => {
      const contenuBloc = bloc.textContent.toLowerCase();

      if (contenuBloc.includes(texteRecherche)) {
        bloc.style.display = "block";
      } else {
        bloc.style.display = "none";
      }
    });
  });
  afficherCategories();
});
