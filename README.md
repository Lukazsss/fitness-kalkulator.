# Fitness Kalkulačka – Tréninkový deník

Školní projekt z předmětu **Programování** (OOP v TypeScriptu).

**Autor:** Lukáš Nácovský  
**Škola:** VOŠ, SPŠ a JŠ Kutná Hora  
**Třída:** IT2A  
**Školní rok:** 2025/2026

---

## Popis projektu

Aplikace slouží jako digitální tréninkový deník. Uživatel zaznamenává sportovní aktivity a aplikace vypočítá počet spálených kalorií.

## Struktura tříd (OOP)

```
AktivitaZaznam (abstraktní)
├── KardioAktivita  → výpočet: MET × váha × čas / 60
└── SilovaAktivita  → výpočet: série × opakování × zátěž × 0.05
```

## Soubory

| Soubor | Popis |
|--------|-------|
| `data.ts` | Datový číselník aktivit (surová data) |
| `aktivity.ts` | Hierarchie tříd (abstraktní třída + 2 potomci) |
| `main.ts` | Hlavní soubor – oživení dat, testování v konzoli |
| `tsconfig.json` | Konfigurace TypeScript kompilátoru |

## Spuštění

```bash
npm install -g typescript
tsc
# Otevřít dist/main.js v prohlížeči nebo node
node dist/main.js
```
