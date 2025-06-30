import React from 'react'
import { Palette, Shield, Diamond, Ruler, Heart } from 'lucide-react'

export const productConfigurator = {
  name: "Žiedas su akmeniu",
  basePrice: 450,
  image: "/src/assets/screenshots/joaze_lt_2025-06-17_19-34-22_6571.webp",
  parameters: [
    {
      id: "metal",
      name: "Metalas",
      icon: React.createElement(Palette, { className: "w-5 h-5" }),
      description: "Pasirinkite metalo tipą ir spalvą. Skirtingi metalai turi skirtingas savybes ir kainas.",
      detailedInfo: "Metalas yra pagrindinis žiedo komponentas, lemiantis jo išvaizdą, tvarumą ir kainą. Aukso spalva priklauso nuo lydinio sudėties - baltas auksas maišomas su paladžiu ar platina, rožinis - su variu.",
      options: [
        { value: "silver", label: "Sidabras 925", priceModifier: 0, description: "Klasikinis pasirinkimas, tinkamas kasdieniam nešiojimui" },
        { value: "gold-yellow", label: "Geltonas auksas", priceModifier: 200, description: "Tradicinis ir prestižinis pasirinkimas" },
        { value: "gold-white", label: "Baltas auksas", priceModifier: 220, description: "Modernus ir elegantiškas" },
        { value: "gold-rose", label: "Rožinis auksas", priceModifier: 210, description: "Romantiškas ir šiuolaikiškas" }
      ],
      currentValue: "silver"
    },
    {
      id: "purity",
      name: "Praba",
      icon: React.createElement(Shield, { className: "w-5 h-5" }),
      description: "Metalo grynumas. Aukštesnė praba reiškia didesnį grynojo metalo kiekį.",
      detailedInfo: "Praba nurodo grynojo metalo kiekį lydinyje. 585 praba reiškia 58.5% grynojo aukso, 750 praba - 75%. Aukštesnė praba yra brangesnė, bet ir minkštesnė.",
      options: [
        { value: "585", label: "585 praba", priceModifier: 0, description: "Standartinė praba, tvirta ir patikima" },
        { value: "750", label: "750 praba", priceModifier: 150, description: "Aukštesnė kokybė, intensyvesnė spalva" }
      ],
      currentValue: "585"
    },
    {
      id: "stones",
      name: "Žiedo akmenys",
      icon: React.createElement(Diamond, { className: "w-5 h-5" }),
      description: "Akmenų skaičius žiede. Daugiau akmenų padidina žiedo blizgesį ir kainą.",
      detailedInfo: "Akmenų skaičius keičia žiedo išvaizdą ir kainą. Kiekvienas papildomas akmuo yra kruopščiai parinktas ir įtvirtintas, užtikrinant maksimalų blizgesį ir saugumą.",
      min: 1,
      max: 7,
      currentValue: 3,
      pricePerStone: 45
    },
    {
      id: "size",
      name: "Dydis",
      icon: React.createElement(Ruler, { className: "w-5 h-5" }),
      description: "Žiedo dydis (skersmuo). Svarbu tiksliai išmatuoti pirštą optimaliam tinkamumui.",
      detailedInfo: "Žiedo dydis matuojamas pagal vidinio skersmens milimetrus. Rekomenduojame išmatuoti pirštą vakare, kai jis šiek tiek patinęs. Galime pasiūlyti nemokamą dydžio nustatymą mūsų salone.",
      min: 15,
      max: 22,
      currentValue: 18,
      priceModifier: 0
    },
    {
      id: "comfort",
      name: "Komfortas",
      icon: React.createElement(Heart, { className: "w-5 h-5" }),
      description: "Žiedo vidaus formos tipas, paveiks nešiojimo komfortą.",
      detailedInfo: "Komforto profilis keičia žiedo vidaus formą. Comfort fit profilis turi šiek tiek išgaubtą vidinį paviršių, kuris geriau prisitaiko prie piršto formos ir yra patogesnė nešioti.",
      options: [
        { value: "standard", label: "Standartinis", priceModifier: 0, description: "Klasikinis plokščias profilis" },
        { value: "comfort", label: "Comfort Fit", priceModifier: 25, description: "Ergonomiškas profilis patogesniam nešiojimui" }
      ],
      currentValue: "standard"
    }
  ]
} 