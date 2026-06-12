/**
 * app.js
 * Fitness Kalkulačka – kompletní logika aplikace
 *
 * Obsah:
 *   1. Datový číselník (odpovídá data.ts)
 *   2. Abstraktní třída AktivitaZaznam
 *   3. Potomek KardioAktivita
 *   4. Potomek SilovaAktivita
 *   5. Stav aplikace + pomocné funkce
 *   6. DOM – inicializace, obsluha událostí, překreslení
 */

"use strict";


/* ============================================================
   1. DATOVÝ ČÍSELNÍK  (odpovídá data.ts)
   ============================================================ */

/** @typedef {'kardio'|'silova'} TypAktivity */

/**
 * @typedef {Object} KatalogAktivity
 * @property {number}       id
 * @property {TypAktivity}  typ
 * @property {string}       nazev
 * @property {number}       metHodnota
 */

/** @type {KatalogAktivity[]} */
const katalog = [
  { id: 1, typ: "kardio", nazev: "Běh",         metHodnota: 9.8 },
  { id: 2, typ: "kardio", nazev: "Plavání",     metHodnota: 7.0 },
  { id: 3, typ: "kardio", nazev: "Cyklistika",  metHodnota: 6.8 },
  { id: 4, typ: "kardio", nazev: "Chůze",       metHodnota: 3.5 },
  { id: 5, typ: "kardio", nazev: "Veslování",   metHodnota: 7.0 },
  { id: 6, typ: "silova", nazev: "Posilování",  metHodnota: 5.0 },
  { id: 7, typ: "silova", nazev: "Crossfit",    metHodnota: 8.0 },
  { id: 8, typ: "silova", nazev: "Bench press", metHodnota: 5.0 },
  { id: 9, typ: "silova", nazev: "Dřepy",       metHodnota: 5.0 },
];

/* ============================================================
   2. ABSTRAKTNÍ TŘÍDA AktivitaZaznam  (odpovídá aktivity.ts)
   ============================================================ */

/**
 * AktivitaZaznam – abstraktní rodičovská třída.
 * Definuje společné vlastnosti a předpis metody spaliKcal(),
 * kterou musí každý potomek implementovat po svém.
 */
class AktivitaZaznam {
  /**
   * @param {number} id
   * @param {string} nazev
   * @param {number} trvaniMin
   * @param {number} metHodnota
   */
  constructor(id, nazev, trvaniMin, metHodnota) {
    this.id          = id;
    this.nazev       = nazev.trim() === "" ? "Neznámá aktivita" : nazev;
    this.metHodnota  = metHodnota;
    this._trvaniMin  = 0;
    this.trvaniMin   = trvaniMin; // setter provede validaci
  }

  /** Getter: vrátí trvání v minutách. */
  get trvaniMin() { return this._trvaniMin; }

  /**
   * Setter: zabrání záporné nebo nulové hodnotě.
   * Neplatná hodnota je automaticky opravena na 1 min.
   */
  set trvaniMin(hodnota) {
    if (hodnota <= 0) {
      console.error(`Trvání musí být > 0. Zadáno: ${hodnota}. Opraveno na 1 min.`);
      this._trvaniMin = 1;
    } else {
      this._trvaniMin = hodnota;
    }
  }

  /** Vrátí název aktivity. */
  getNazev() { return this.nazev; }

  /** Vrátí ID záznamu. */
  getId() { return this.id; }

  /**
   * ABSTRAKTNÍ METODA – potomci ji musí přepsat.
   * Vypočítá a vrátí počet spálených kcal.
   * @returns {number}
   */
  spaliKcal() {
    throw new Error(`spaliKcal() není implementováno v ${this.constructor.name}`);
  }

  /**
   * Polymorfní metoda – vrátí textový souhrn záznamu.
   * Interně volá spaliKcal() → výsledek závisí na skutečném typu objektu.
   * @returns {string}
   */
  getSouhrn() {
    return `[${this.nazev}] Trvání: ${this._trvaniMin} min | Spáleno: ${this.spaliKcal()} kcal`;
  }
}

/* ============================================================
   3. POTOMEK KardioAktivita
   ============================================================ */

/**
 * KardioAktivita – vytrvalostní aktivity (běh, plavání, kolo…).
 * Výpočet kalorií: Kcal = (MET × váha [kg] × čas [min]) / 60
 */
class KardioAktivita extends AktivitaZaznam {
  /**
   * @param {number} id
   * @param {string} nazev
   * @param {number} trvaniMin
   * @param {number} metHodnota
   * @param {number} rychlostKmh  - průměrná rychlost v km/h
   * @param {number} vzdalenostKm - vzdálenost v km
   * @param {number} vahaKg       - tělesná hmotnost uživatele v kg
   */
  constructor(id, nazev, trvaniMin, metHodnota, rychlostKmh, vzdalenostKm, vahaKg) {
    super(id, nazev, trvaniMin, metHodnota);
    this.rychlostKmh  = rychlostKmh;
    this.vzdalenostKm = vzdalenostKm;
    this._vahaKg      = 0;
    this.vahaKg       = vahaKg; // setter provede validaci
  }

  /** Getter pro tělesnou hmotnost. */
  get vahaKg() { return this._vahaKg; }

  /**
   * Setter pro tělesnou hmotnost – povolený rozsah 20–300 kg.
   * Hodnoty mimo rozsah jsou automaticky opraveny na 70 kg.
   */
  set vahaKg(hodnota) {
    if (hodnota < 20 || hodnota > 300) {
      console.error(`Hmotnost ${hodnota} kg je mimo rozsah (20–300). Opraveno na 70 kg.`);
      this._vahaKg = 70;
    } else {
      this._vahaKg = hodnota;
    }
  }

  /**
   * Implementace abstraktní metody – MET vzorec.
   * @returns {number}
   */
  spaliKcal() {
    return Math.round((this.metHodnota * this._vahaKg * this.trvaniMin) / 60);
  }

  /** Vrátí podrobný textový souhrn pro konzoli. */
  getSouhrn() {
    return (
      `[KARDIO] ${this.nazev} | ` +
      `${this.vzdalenostKm} km @ ${this.rychlostKmh} km/h | ` +
      `${this.trvaniMin} min | Spáleno: ${this.spaliKcal()} kcal`
    );
  }

  /** Vrátí krátký detail pro zobrazení v UI. */
  getDetail() {
    return `${this.vzdalenostKm} km · ${this.rychlostKmh} km/h · ${this.trvaniMin} min`;
  }
}

/* ============================================================
   4. POTOMEK SilovaAktivita
   ============================================================ */

/**
 * SilovaAktivita – silový trénink (posilování, crossfit…).
 * Výpočet kalorií: Kcal = série × opakování × zátěž [kg] × 0.05
 */
class SilovaAktivita extends AktivitaZaznam {
  /** Kalibrační koeficient pro silový trénink střední intenzity. */
  static KOEFICIENT = 0.05;

  /**
   * @param {number} id
   * @param {string} nazev
   * @param {number} trvaniMin
   * @param {number} metHodnota
   * @param {number} pocetSerii  - počet sérií
   * @param {number} opakovani   - počet opakování v sérii
   * @param {number} zatezKg     - pracovní zátěž v kg
   */
  constructor(id, nazev, trvaniMin, metHodnota, pocetSerii, opakovani, zatezKg) {
    super(id, nazev, trvaniMin, metHodnota);
    this._pocetSerii = 0;
    this._opakovani  = 0;
    this._zatezKg    = 0;
    // Settery provedou validaci všech tří hodnot
    this.pocetSerii = pocetSerii;
    this.opakovani  = opakovani;
    this.zatezKg    = zatezKg;
  }

  // ── Settery s validací ──────────────────────────────────────

  /** Počet sérií – minimum 1. */
  set pocetSerii(v) {
    if (v < 1) {
      console.error(`Počet sérií musí být ≥ 1. Zadáno: ${v}. Opraveno na 1.`);
      this._pocetSerii = 1;
    } else {
      this._pocetSerii = Math.round(v);
    }
  }

  /** Počet opakování – minimum 1. */
  set opakovani(v) {
    if (v < 1) {
      console.error(`Počet opakování musí být ≥ 1. Zadáno: ${v}. Opraveno na 1.`);
      this._opakovani = 1;
    } else {
      this._opakovani = Math.round(v);
    }
  }

  /** Zátěž – musí být kladné číslo. */
  set zatezKg(v) {
    if (v <= 0) {
      console.error(`Zátěž musí být > 0. Zadáno: ${v}. Opraveno na 1 kg.`);
      this._zatezKg = 1;
    } else {
      this._zatezKg = v;
    }
  }

  // ── Gettery ─────────────────────────────────────────────────
  get pocetSerii() { return this._pocetSerii; }
  get opakovani()  { return this._opakovani;  }
  get zatezKg()    { return this._zatezKg;    }

  /**
   * Implementace abstraktní metody – výpočet z objemu zátěže.
   * @returns {number}
   */
  spaliKcal() {
    return Math.round(
      this._pocetSerii * this._opakovani * this._zatezKg * SilovaAktivita.KOEFICIENT
    );
  }

  /** Vrátí podrobný textový souhrn pro konzoli. */
  getSouhrn() {
    return (
      `[SILOVÁ] ${this.nazev} | ` +
      `${this._pocetSerii} série × ${this._opakovani} opak × ${this._zatezKg} kg | ` +
      `${this.trvaniMin} min | Spáleno: ${this.spaliKcal()} kcal`
    );
  }

  /** Vrátí krátký detail pro zobrazení v UI. */
  getDetail() {
    return `${this._pocetSerii} série · ${this._opakovani} opak · ${this._zatezKg} kg · ${this.trvaniMin} min`;
  }
}

/* ============================================================
   5. STAV APLIKACE
   ============================================================ */

/** @type {AktivitaZaznam[]} Pole všech záznamů – mix KardioAktivita a SilovaAktivita */
let denníTrening = [];

/** Aktuálně vybraný typ aktivity ve formuláři */
let aktualniTyp = "kardio";

/** Čítač pro generování unikátních ID nových záznamů */
let nextId = 1;

/* ============================================================
   6. DOM – INICIALIZACE A OBSLUHA UDÁLOSTÍ
   ============================================================ */

/**
 * Naplní <select> aktivitami odpovídajícího typu z číselníku.
 * Odděluje data (katalog) od logiky (DOM manipulace).
 */
function naplnSelect() {
  const sel = document.getElementById("sel-aktivita");
  sel.innerHTML = "";
  katalog
    .filter(a => a.typ === aktualniTyp)
    .forEach(a => {
      const opt = document.createElement("option");
      opt.value       = a.id;
      opt.textContent = a.nazev;
      sel.appendChild(opt);
    });
}

/**
 * Přepne aktivní typ (kardio / silová) a překreslí formulář.
 * @param {TypAktivity} typ
 */
function setTyp(typ) {
  aktualniTyp = typ;

  // Aktualizace tlačítek přepínače
  document.getElementById("btn-kardio").className =
    "type-btn" + (typ === "kardio" ? " active-kardio" : "");
  document.getElementById("btn-silova").className =
    "type-btn" + (typ === "silova" ? " active-silova" : "");

  // Zobrazení/skrytí skupin polí
  document.getElementById("fields-kardio").className =
    "fields-kardio" + (typ === "kardio" ? " active" : "");
  document.getElementById("fields-silova").className =
    "fields-silova" + (typ === "silova" ? " active" : "");

  naplnSelect();
}

/**
 * Načte hodnoty z formuláře, provede validaci a vytvoří
 * instanci příslušné třídy (KardioAktivita nebo SilovaAktivita).
 * Přidá ji do pole denníTrening a překreslí seznam.
 */
function pridatAktivitu() {
  const selId   = parseInt(document.getElementById("sel-aktivita").value);
  const trvani  = parseFloat(document.getElementById("inp-trvani").value);
  const polozka = katalog.find(a => a.id === selId);

  if (!polozka || isNaN(trvani) || trvani <= 0) {
    showToast("Trvání musí být kladné číslo (minuty)."); return;
  }

  let aktivita;

  if (aktualniTyp === "kardio") {
    const vaha       = parseFloat(document.getElementById("inp-vaha").value);
    const vzdalenost = parseFloat(document.getElementById("inp-vzdalenost").value);
    const rychlost   = parseFloat(document.getElementById("inp-rychlost").value);

    if (isNaN(vaha) || vaha < 20 || vaha > 300) {
      showToast("Hmotnost musí být v rozsahu 20–300 kg."); return;
    }
    if (isNaN(vzdalenost) || vzdalenost < 0) {
      showToast("Vzdálenost musí být kladné číslo."); return;
    }
    if (isNaN(rychlost) || rychlost < 0) {
      showToast("Rychlost musí být kladné číslo."); return;
    }

    // "Oživení" záznamu – vytvoření instance z dat číselníku + uživatelských vstupů
    aktivita = new KardioAktivita(
      nextId++, polozka.nazev, trvani, polozka.metHodnota, rychlost, vzdalenost, vaha
    );

  } else {
    const serie     = parseInt(document.getElementById("inp-serie").value);
    const opakovani = parseInt(document.getElementById("inp-opakovani").value);
    const zatez     = parseFloat(document.getElementById("inp-zatez").value);

    if (isNaN(serie) || serie < 1)         { showToast("Počet sérií musí být alespoň 1.");      return; }
    if (isNaN(opakovani) || opakovani < 1) { showToast("Počet opakování musí být alespoň 1."); return; }
    if (isNaN(zatez) || zatez <= 0)        { showToast("Zátěž musí být kladné číslo (kg).");    return; }

    aktivita = new SilovaAktivita(
      nextId++, polozka.nazev, trvani, polozka.metHodnota, serie, opakovani, zatez
    );
  }

  denníTrening.push(aktivita);

  // Výpis do konzole (testování polymorfismu – getSouhrn() se liší podle typu)
  console.log("Přidána aktivita:", aktivita.getSouhrn());

  prekresliSeznam();
}

/**
 * Odebere záznam podle ID a překreslí seznam.
 * @param {number} id
 */
function odebratAktivitu(id) {
  denníTrening = denníTrening.filter(a => a.getId() !== id);
  prekresliSeznam();
}

/**
 * Překreslí celý pravý panel:
 *  - souhrnné karty (polymorfní reduce přes spaliKcal)
 *  - seznam aktivit
 *  - motivační banner
 */
function prekresliSeznam() {
  const list = document.getElementById("activity-list");

  // Polymorfní výpočet celkových hodnot přes reduce
  // JavaScript automaticky volá správnou implementaci spaliKcal()
  // podle skutečného typu každého objektu (KardioAktivita / SilovaAktivita)
  const celkemKcal  = denníTrening.reduce((s, a) => s + a.spaliKcal(), 0);
  const celkemMinut = denníTrening.reduce((s, a) => s + a.trvaniMin,   0);

  // Aktualizace souhrnných karet
  document.getElementById("stat-kcal").textContent  = celkemKcal;
  document.getElementById("stat-cas").textContent   = celkemMinut;
  document.getElementById("stat-pocet").textContent = denníTrening.length;

  // Badge s počtem záznamů v hlavičce panelu
  const badge = document.getElementById("badge-count");
  badge.textContent    = denníTrening.length;
  badge.style.display  = denníTrening.length > 0 ? "inline-block" : "none";

  // Prázdný stav
  if (denníTrening.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="16" stroke="currentColor" stroke-width="1.5"/>
            <path d="M12 18h6v-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="empty-text">Zatím žádné aktivity.<br>Přidej první záznam vlevo.</div>
      </div>`;
    document.getElementById("motivation").classList.remove("show");
    return;
  }

  // Polymorfní průchod polem – forEach volá getDetail() a spaliKcal()
  // na každém objektu bez znalosti konkrétního typu
  list.innerHTML = denníTrening.map(a => {
    const typCls   = (a instanceof KardioAktivita) ? "kardio" : "silova";
    const typLabel = (a instanceof KardioAktivita) ? "KARDIO" : "SILOVÁ";
    return `
      <div class="activity-item ${typCls}">
        <span class="activity-badge ${typCls}">${typLabel}</span>
        <div class="activity-info">
          <div class="activity-name">${a.getNazev()}</div>
          <div class="activity-detail">${a.getDetail()}</div>
        </div>
        <div>
          <div class="activity-kcal">${a.spaliKcal()}</div>
          <div class="activity-kcal-unit">kcal</div>
        </div>
        <button class="btn-remove" onclick="odebratAktivitu(${a.getId()})" title="Odebrat">×</button>
      </div>`;
  }).join("");

  // Motivační banner – stejná logika jako v main.ts
  const mot = document.getElementById("motivation");
  if (celkemKcal >= 800) {
    mot.className = "motivation show gold";
    mot.innerHTML = "🏆 Výborný výkon! Dnes jsi dal/a do toho všechno!";
  } else if (celkemKcal >= 400) {
    mot.className = "motivation show blue";
    mot.innerHTML = "💪 Dobrá práce! Solidní tréninkový den.";
  } else {
    mot.className = "motivation show green";
    mot.innerHTML = "🌱 Dobrý začátek! Zítra přidej trochu více.";
  }

  // Výpis souhrnné statistiky do konzole
  console.log(`─── Denní souhrn: ${celkemMinut} min | ${celkemKcal} kcal ───`);
}

/**
 * Zobrazí dočasnou toast notifikaci s chybovou hláškou.
 * @param {string} msg
 */
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3000);
}

/* ── Inicializace při načtení stránky ── */
document.addEventListener("DOMContentLoaded", () => {
  naplnSelect();
  console.log("✅ Fitness Kalkulačka inicializována. Katalog obsahuje", katalog.length, "aktivit.");
});
