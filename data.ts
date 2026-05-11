// Typ pro rozlišení druhu aktivity
export type TypAktivity = "kardio" | "silova";

// Typ jedné položky v katalogu
export type KatalogAktivity = {
  id: number;
  typ: TypAktivity;
  nazev: string;
  metHodnota: number; // MET koeficient – intenzita aktivity
};

export const katalog: KatalogAktivity[] = [
  { id: 1, typ: "kardio", nazev: "Běh",         metHodnota: 9.8 },
  { id: 2, typ: "kardio", nazev: "Plavání",     metHodnota: 7.0 },
  { id: 3, typ: "kardio", nazev: "Cyklistika",  metHodnota: 6.8 },
  { id: 4, typ: "silova", nazev: "Posilování",  metHodnota: 5.0 },
  { id: 5, typ: "silova", nazev: "Crossfit",    metHodnota: 8.0 },
];
