/**
 * main.ts
 * Hlavní soubor aplikace – testování logiky v konzoli prohlížeče.
 *
 * Postup:
 *  1. Načtení dat z číselníku (data.ts)
 *  2. Vytvoření instancí tříd z načtených dat ("oživení" objektů)
 *  3. Polymorfní průchod polem a výpis výsledků do konzole
 */

import { katalog, KatalogAktivity } from "./data.js";
import { AktivitaZaznam, KardioAktivita, SilovaAktivita } from "./aktivity.js";

// ─────────────────────────────────────────────────────────────────────────────
// Pomocná funkce: najde položku v číselníku podle ID
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Vyhledá aktivitu v katalogu podle ID.
 * @param id - hledané ID
 * @returns nalezená položka nebo undefined
 */
function najdiVKatalogu(id: number): KatalogAktivity | undefined {
  return katalog.find((polozka) => polozka.id === id);
}

// ─────────────────────────────────────────────────────────────────────────────
// "Oživení" dat – vytvoření instancí tříd z číselníku
// ─────────────────────────────────────────────────────────────────────────────

// Základní data (název, MET) se načítají z číselníku.
// Uživatelské parametry (trvání, vzdálenost, zátěž…) jsou zadány zde.

const dataBehu      = najdiVKatalogu(1)!; // Běh
const dataPlavani   = najdiVKatalogu(2)!; // Plavání
const dataCyklo     = najdiVKatalogu(3)!; // Cyklistika
const dataPosilovani= najdiVKatalogu(4)!; // Posilování
const dataCrossfit  = najdiVKatalogu(5)!; // Crossfit

// Vytvoření instancí KardioAktivita
const beh = new KardioAktivita(
  dataBehu.id,
  dataBehu.nazev,
  30,          // trvání: 30 minut
  dataBehu.metHodnota,
  8.5,         // průměrná rychlost: 8.5 km/h
  4.25,        // vzdálenost: 4.25 km
  75           // hmotnost uživatele: 75 kg
);

const plavani = new KardioAktivita(
  dataPlavani.id,
  dataPlavani.nazev,
  45,           // trvání: 45 minut
  dataPlavani.metHodnota,
  2.0,          // průměrná rychlost: 2.0 km/h
  1.5,          // vzdálenost: 1.5 km
  75
);

const cyklo = new KardioAktivita(
  dataCyklo.id,
  dataCyklo.nazev,
  60,           // trvání: 60 minut
  dataCyklo.metHodnota,
  20,           // průměrná rychlost: 20 km/h
  20,           // vzdálenost: 20 km
  75
);

// Vytvoření instancí SilovaAktivita
const posilovani = new SilovaAktivita(
  dataPosilovani.id,
  dataPosilovani.nazev,
  50,           // trvání: 50 minut
  dataPosilovani.metHodnota,
  4,            // 4 série
  10,           // 10 opakování
  80            // zátěž: 80 kg
);

const crossfit = new SilovaAktivita(
  dataCrossfit.id,
  dataCrossfit.nazev,
  40,           // trvání: 40 minut
  dataCrossfit.metHodnota,
  5,            // 5 sérií
  15,           // 15 opakování
  40            // zátěž: 40 kg
);

// ─────────────────────────────────────────────────────────────────────────────
// Test zapouzdření – záměrně chybné hodnoty (validace setterů)
// ─────────────────────────────────────────────────────────────────────────────

console.log("=== TEST VALIDACE (záměrně chybné vstupy) ===");
const testValidace = new KardioAktivita(99, "Test", -5, 8.0, 10, 2, -10);
console.log("Výsledek po opravě:", testValidace.getSouhrn());
console.log("");

// ─────────────────────────────────────────────────────────────────────────────
// Pole s mixem různých typů objektů – základ pro polymorfismus
// ─────────────────────────────────────────────────────────────────────────────

// Pole je typované jako AktivitaZaznam[] – obsahuje různé potomky
const denníTrening: AktivitaZaznam[] = [beh, plavani, cyklo, posilovani, crossfit];

// ─────────────────────────────────────────────────────────────────────────────
// Polymorfní výpis do konzole
// ─────────────────────────────────────────────────────────────────────────────

console.log("╔══════════════════════════════════════════════════════════╗");
console.log("║           FITNESS KALKULAČKA – Tréninkový deník         ║");
console.log("╚══════════════════════════════════════════════════════════╝");
console.log("");
console.log("=== DENNÍ PŘEHLED AKTIVIT ===");
console.log("");

// Polymorfní průchod – u každého objektu se zavolá jeho vlastní
// implementace getSouhrn() a spaliKcal(), aniž by kód věděl, o jaký typ jde
denníTrening.forEach((aktivita, index) => {
  console.log(`${index + 1}. ${aktivita.getSouhrn()}`);
});

console.log("");
console.log("─────────────────────────────────────────────────────────");

// Celkový součet – polymorfní volání spaliKcal() přes reduce
const celkemKcal: number = denníTrening.reduce(
  (soucet, aktivita) => soucet + aktivita.spaliKcal(),
  0
);

const celkemMinut: number = denníTrening.reduce(
  (soucet, aktivita) => soucet + aktivita.trvaniMin,
  0
);

console.log(`CELKEM: ${celkemMinut} minut tréninku | ${celkemKcal} kcal spáleno`);
console.log("");

// Motivační hodnocení na základě celkového výdeje
if (celkemKcal >= 800) {
  console.log("🏆 Výborný výkon! Dnes jsi dal/a do toho všechno!");
} else if (celkemKcal >= 400) {
  console.log("💪 Dobrá práce! Solidní tréninkový den.");
} else {
  console.log("🌱 Dobrý začátek! Zítra přidej trochu více.");
}

console.log("");
console.log("=== DETAILNÍ PŘEHLED PODLE TYPU ===");
console.log("");

// Filtrování podle instanceOf – ukázka typové kontroly za běhu
const kardioAktivity = denníTrening.filter((a) => a instanceof KardioAktivita);
const silovaAktivity = denníTrening.filter((a) => a instanceof SilovaAktivita);

console.log(`Kardio aktivity (${kardioAktivity.length}):`);
kardioAktivity.forEach((a) => console.log(`  → ${a.getSouhrn()}`));

console.log("");
console.log(`Silové aktivity (${silovaAktivity.length}):`);
silovaAktivity.forEach((a) => console.log(`  → ${a.getSouhrn()}`));

console.log("");
console.log("╔══════════════════════════════════════════════════════════╗");
console.log("║  Veškerá logika funguje správně. Fáze 2 dokončena.      ║");
console.log("╚══════════════════════════════════════════════════════════╝");
