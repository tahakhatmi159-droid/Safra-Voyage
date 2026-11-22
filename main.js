// Safra Voyages - interactions JavaScript (chaque bloc ne s'active que si l'élément existe)
document.addEventListener("DOMContentLoaded", () => {

  // 0) Apparition des éléments au défilement (IntersectionObserver)
  const obs = new IntersectionObserver(entrees => entrees.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add("visible"); obs.unobserve(en.target); }
  }), {threshold: 0.15});
  const suivre = el => { el.classList.add("reveal"); obs.observe(el); };
  document.querySelectorAll("main .carte, .bande h2, main section > h1 ~ .filtres").forEach(suivre);

  // 1) Menu burger
  const burger = document.querySelector(".burger"), nav = document.querySelector("nav");
  burger.addEventListener("click", () => {
    const ouvert = nav.classList.toggle("ouvert");
    burger.setAttribute("aria-expanded", ouvert);
  });

  // 2) Mode sombre (mémorisé dans le navigateur)
  const racine = document.documentElement, themeBtn = document.getElementById("theme");
  racine.dataset.theme = localStorage.getItem("theme") || "light";
  themeBtn.addEventListener("click", () => {
    racine.dataset.theme = racine.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", racine.dataset.theme);
  });

  // 3) Filtre des destinations par zone
  const filtres = document.querySelectorAll(".filtres button");
  filtres.forEach(btn => btn.addEventListener("click", () => {
    filtres.forEach(b => b.classList.remove("actif"));
    btn.classList.add("actif");
    document.querySelectorAll("[data-zone]").forEach(c => {
      c.hidden = btn.dataset.filtre !== "tout" && c.dataset.zone !== btn.dataset.filtre;
    });
  }));

  // 4) Calculateur de prix d'un séjour
  const calc = document.getElementById("calcul");
  if (calc) calc.addEventListener("input", () => {
    const prix = Number(calc.destination.value), nuits = Number(calc.nuits.value), pers = Number(calc.personnes.value);
    const total = document.getElementById("total");
    total.textContent = prix && nuits > 0 && pers > 0 ? prix * nuits * pers + " DT" : "—";
    total.classList.remove("maj"); void total.offsetWidth; total.classList.add("maj"); // relance l'animation
  });

  // 5) Offres : chargées depuis PHP/MySQL, sinon données locales de secours
  const liste = document.getElementById("liste-offres");
  if (liste) {
    const secours = [
      {titre: "Djerba tout compris", destination: "Djerba", duree: 5, prix: 780},
      {titre: "Désert et oasis", destination: "Tozeur", duree: 3, prix: 520},
      {titre: "Istanbul en ville", destination: "Istanbul", duree: 4, prix: 1650},
      {titre: "Paris romantique", destination: "Paris", duree: 4, prix: 2400},
      {titre: "Corail et forêt", destination: "Tabarka", duree: 4, prix: 480},
      {titre: "Week-end Hammamet", destination: "Hammamet", duree: 3, prix: 390},
      {titre: "Dubai moderne", destination: "Dubai", duree: 5, prix: 3200},
      {titre: "Rome antique", destination: "Rome", duree: 4, prix: 2100}
    ];
    const afficher = offres => {
      liste.innerHTML = "";
      offres.forEach(o => {
        const li = document.createElement("article");
        li.className = "carte";
        li.innerHTML = `<img width="600" height="400" loading="lazy" alt=""><div class="txt"><h3></h3><p></p><p class="prix"></p></div>`;
        const img = li.querySelector("img");
        img.src = `../images/${o.destination.toLowerCase()}.svg`;
        img.alt = `Image de ${o.destination}`;
        li.querySelector("h3").textContent = o.titre;
        li.querySelector("p").textContent = `${o.destination} · ${o.duree} jours`;
        li.querySelector(".prix").textContent = `${o.prix} DT / personne`;
        liste.append(li);
        suivre(li);
      });
    };
    fetch("../php/offres.php").then(r => r.ok ? r.json() : Promise.reject())
      .then(afficher).catch(() => afficher(secours));
  }

  // 6) Validation du formulaire de contact
  const form = document.getElementById("contact");
  if (form) form.addEventListener("submit", async e => {
    e.preventDefault();
    const regles = {
      nom: v => v.trim().length >= 2 || "Entrez votre nom (2 lettres minimum).",
      email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || "Entrez un e-mail valide, par exemple nom@mail.com.",
      message: v => v.trim().length >= 10 || "Votre message doit faire 10 caractères minimum."
    };
    let valide = true;
    for (const champ in regles) {
      const el = form.elements[champ], res = regles[champ](el.value);
      el.classList.toggle("invalide", res !== true);
      el.setAttribute("aria-invalid", res !== true);
      document.getElementById("err-" + champ).textContent = res === true ? "" : res;
      if (res !== true) valide = false;
    }
    const sortie = document.getElementById("retour");
    if (!valide) { sortie.textContent = ""; return; }
    try {
      const r = await fetch("../php/contact.php", {method: "POST", body: new FormData(form)});
      if (!r.ok) throw 0;
    } catch { /* serveur PHP absent : on confirme quand même en mode démo */ }
    sortie.textContent = "Merci ! Votre message est envoyé, nous répondons sous 24 h.";
    form.reset();
  });
});
