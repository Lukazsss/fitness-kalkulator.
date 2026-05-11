/**
 * aktivity.ts
 * Definice hierarchie tříd pro Fitness Kalkulačku.
 *
 * Struktura:
 *   AktivitaZaznam (abstraktní) – společný základ
 *   ├── KardioAktivita           – výpočet dle MET vzorce
 *   └── SilovaAktivita           – výpočet dle objemu zátěže
 */

// ─────────────────────────────────────────────────────────────────────────────
// Abstraktní bázová třída
// ─────────────────────────────────────────────────────────────────────────────

/**
 * AktivitaZaznam – abstraktní rodičovská třída.
 * Obsahuje společné vlastnosti všech aktivit a předepisuje
 * abstraktní metodu spaliKcal(), kterou musí každý potomek implementovat.
 */
export abstract class AktivitaZaznam {
  // protected – přístupné v této třídě i v potomcích, ale ne zvenčí
  protected id: number;
  protected nazev: string;
  protected metHodnota: number;

  // private – přístupné pouze v této třídě, potomci používají setter
  private _trvaniMin: number;

  /**
   * Konstruktor – inicializuje společné vlastnosti aktivity.
   * @param id         - ID aktivity z číselníku
   * @param nazev      - název aktivity
   * @param trvaniMin  - délka cvičení v minutách (musí být > 0)
   * @param metHodnota - MET koeficient aktivity
   */
  constructor(id: number, nazev: string, trvaniMin: number, metHodnota: number) {
    this.id = id;

    // Validace: název nesmí být prázdný
    if (nazev.trim() === "") {
      console.error("Název aktivity nesmí být prázdný! Použit výchozí název.");
      this.nazev = "Neznámá aktivita";
    } else {
      this.nazev = nazev;
    }

    this.metHodnota = metHodnota;
    this._trvaniMin = 0;          // inicializace před použitím setteru
    this.trvaniMin = trvaniMin;   // použití setteru pro validaci
  }

  // ── Getter a setter pro trvaniMin ───────────────────────────────────────

  /** Vrátí délku trvání aktivity v minutách. */
  public get trvaniMin(): number {
    return this._trvaniMin;
  }

  /**
   * Setter pro trvaniMin – zajišťuje, že trvání bude vždy kladné číslo.
   * Záporné nebo nulové hodnoty jsou automaticky opraveny na 1 minutu.
   */
  public set trvaniMin(hodnota: number) {
    if (hodnota <= 0) {
      console.error(`Trvání musí být kladné číslo! Zadáno: ${hodnota}. Nastaveno na 1 min.`);
      this._trvaniMin = 1;
    } else {
      this._trvaniMin = hodnota;
    }
  }

  // ── Veřejné metody ───────────────────────────────────────────────────────

  /** Vrátí název aktivity. */
  public getNazev(): string {
    return this.nazev;
  }

  /** Vrátí ID aktivity. */
  public getId(): number {
    return this.id;
  }

  /**
   * ABSTRAKTNÍ METODA – každý potomek ji musí implementovat po svém.
   * Vypočítá a vrátí počet spálených kilokalorií pro danou aktivitu.
   */
  public abstract spaliKcal(): number;

  /**
   * Polymorfní metoda – vrátí textový souhrn záznamu.
   * Interně volá spaliKcal(), čímž využívá polymorfismus –
   * výsledek závisí na tom, jaký typ objektu metodu volá.
   */
  public getSouhrn(): string {
    return `[${this.nazev}] Trvání: ${this._trvaniMin} min | Spáleno: ${this.spaliKcal()} kcal`;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Potomek 1: KardioAktivita
// ─────────────────────────────────────────────────────────────────────────────

/**
 * KardioAktivita – reprezentuje vytrvalostní aktivity (běh, plavání, kolo…).
 * Kalorický výdej se počítá pomocí MET vzorce:
 *   Kcal = (MET × tělesná hmotnost [kg] × trvání [min]) / 60
 */
export class KardioAktivita extends AktivitaZaznam {
  private rychlostKmh: number;
  private vzdalenostKm: number;
  private _vahaKg: number;

  /**
   * @param id           - ID z číselníku
   * @param nazev        - název aktivity
   * @param trvaniMin    - délka cvičení v minutách
   * @param metHodnota   - MET koeficient
   * @param rychlostKmh  - průměrná rychlost v km/h
   * @param vzdalenostKm - ujetá vzdálenost v km
   * @param vahaKg       - tělesná hmotnost uživatele v kg
   */
  constructor(
    id: number,
    nazev: string,
    trvaniMin: number,
    metHodnota: number,
    rychlostKmh: number,
    vzdalenostKm: number,
    vahaKg: number
  ) {
    // Volání konstruktoru rodičovské třídy (povinné při dědičnosti)
    super(id, nazev, trvaniMin, metHodnota);
    this.rychlostKmh  = rychlostKmh;
    this.vzdalenostKm = vzdalenostKm;
    this._vahaKg      = 0;
    this.vahaKg       = vahaKg; // setter pro validaci
  }

  // ── Getter a setter pro vahaKg ──────────────────────────────────────────

  public get vahaKg(): number {
    return this._vahaKg;
  }

  /**
   * Setter pro tělesnou hmotnost – musí být v reálném rozsahu 20–300 kg.
   */
  public set vahaKg(hodnota: number) {
    if (hodnota < 20 || hodnota > 300) {
      console.error(`Hmotnost ${hodnota} kg je mimo rozsah (20–300 kg). Nastaveno na 70 kg.`);
      this._vahaKg = 70;
    } else {
      this._vahaKg = hodnota;
    }
  }

  /**
   * Implementace abstraktní metody – MET vzorec pro kardio aktivity.
   * Výsledek je zaokrouhlen na celé číslo.
   */
  public spaliKcal(): number {
    return Math.round((this.metHodnota * this._vahaKg * this.trvaniMin) / 60);
  }

  /**
   * Přepisuje rodičovský getSouhrn() – přidává informaci o vzdálenosti a rychlosti.
   */
  public getSouhrn(): string {
    return (
      `[KARDIO] ${this.nazev} | ` +
      `${this.vzdalenostKm} km @ ${this.rychlostKmh} km/h | ` +
      `${this.trvaniMin} min | ` +
      `Spáleno: ${this.spaliKcal()} kcal`
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Potomek 2: SilovaAktivita
// ─────────────────────────────────────────────────────────────────────────────

/**
 * SilovaAktivita – reprezentuje silový trénink (posilování, crossfit…).
 * Kalorický výdej se počítá z objemu zátěže:
 *   Kcal = série × opakování × zátěž [kg] × koeficient (0.05)
 */
export class SilovaAktivita extends AktivitaZaznam {
  private _pocetSerii: number;
  private _opakovani: number;
  private _zatezKg: number;

  // Koeficient kalibrace pro silový trénink střední intenzity
  private static readonly KOEFICIENT = 0.05;

  /**
   * @param id          - ID z číselníku
   * @param nazev       - název aktivity
   * @param trvaniMin   - délka tréninku v minutách
   * @param metHodnota  - MET koeficient
   * @param pocetSerii  - počet sérií cviku
   * @param opakovani   - počet opakování v sérii
   * @param zatezKg     - pracovní zátěž v kg
   */
  constructor(
    id: number,
    nazev: string,
    trvaniMin: number,
    metHodnota: number,
    pocetSerii: number,
    opakovani: number,
    zatezKg: number
  ) {
    super(id, nazev, trvaniMin, metHodnota);
    this._pocetSerii = 0;
    this._opakovani  = 0;
    this._zatezKg    = 0;
    // Použití setterů pro validaci všech tří hodnot
    this.pocetSerii = pocetSerii;
    this.opakovani  = opakovani;
    this.zatezKg    = zatezKg;
  }

  // ── Settery s validací ──────────────────────────────────────────────────

  /** Počet sérií musí být alespoň 1. */
  public set pocetSerii(hodnota: number) {
    if (hodnota < 1) {
      console.error(`Počet sérií musí být alespoň 1! Zadáno: ${hodnota}. Nastaveno na 1.`);
      this._pocetSerii = 1;
    } else {
      this._pocetSerii = Math.round(hodnota);
    }
  }

  /** Počet opakování musí být alespoň 1. */
  public set opakovani(hodnota: number) {
    if (hodnota < 1) {
      console.error(`Počet opakování musí být alespoň 1! Zadáno: ${hodnota}. Nastaveno na 1.`);
      this._opakovani = 1;
    } else {
      this._opakovani = Math.round(hodnota);
    }
  }

  /** Zátěž musí být kladné číslo. */
  public set zatezKg(hodnota: number) {
    if (hodnota <= 0) {
      console.error(`Zátěž musí být kladné číslo! Zadáno: ${hodnota}. Nastaveno na 1 kg.`);
      this._zatezKg = 1;
    } else {
      this._zatezKg = hodnota;
    }
  }

  /**
   * Implementace abstraktní metody – výpočet z objemu zátěže.
   * Výsledek je zaokrouhlen na celé číslo.
   */
  public spaliKcal(): number {
    return Math.round(
      this._pocetSerii * this._opakovani * this._zatezKg * SilovaAktivita.KOEFICIENT
    );
  }

  /**
   * Přepisuje rodičovský getSouhrn() – přidává informaci o sériích a zátěži.
   */
  public getSouhrn(): string {
    return (
      `[SILOVÁ] ${this.nazev} | ` +
      `${this._pocetSerii} série × ${this._opakovani} opakování × ${this._zatezKg} kg | ` +
      `${this.trvaniMin} min | ` +
      `Spáleno: ${this.spaliKcal()} kcal`
    );
  }
}
