import React from 'react'
import { Eye, ShoppingCart, Settings, Zap, CreditCard, Mail, Package } from 'lucide-react'

export const learningSteps = [
  {
    id: 1,
    title: "Registracija / Prisijungimas",
    description: "Sužinokite, kaip užsiregistruoti arba prisijungti prie JOAZE.LT platformos",
    icon: React.createElement(Eye, { className: "w-6 h-6" }),
    videoUrl: "https://www.youtube.com/embed/XLNh87thSGI",
    content: `Šiame skyriuje sužinosite, kaip užsiregistruoti arba prisijungti prie JOAZE.LT platformos. Sukūrus paskyrą, galėsite stebėti savo užsakymus, peržiūrėti pirkinių istoriją ir mėgautis kitais privalumais.`
  },
  {
    id: 2,
    title: "Perėjimas į parduotuvę",
    description: "Išmokite naršyti JOAZE.LT gaminių asortimentą",
    icon: React.createElement(ShoppingCart, { className: "w-6 h-6" }),
    videoUrl: "https://www.youtube.com/embed/UilOYdYVqxE",
    content: `Norėdami pradėti naršyti JOAZE.LT gaminių asortimentą, turite pereiti į parduotuvę. Tai galite padaryti keliais būdais.`
  },
  {
    id: 3,
    title: "Konfigūracija – pasirinkimų aiškinimas",
    description: "Sužinokite, kaip naudotis interaktyviu konfigūratoriumi",
    icon: React.createElement(Settings, { className: "w-6 h-6" }),
    videoUrl: "https://www.youtube.com/embed/moiandWE8A4",
    content: `JOAZE.LT platformoje galite konfigūruoti juvelyrinius dirbinius pagal savo individualius poreikius, naudodamiesi interaktyviu konfigūratoriumi.`
  },
  {
    id: 4,
    title: "Kaina keičiasi realiu laiku",
    description: "Stebėkite, kaip Jūsų pasirinkimai konfigūratoriuje tiesiogiai veikia produkto kainą.",
    icon: React.createElement(Zap, { className: "w-6 h-6" }),
    videoUrl: "https://www.youtube.com/embed/juEOCWn9pto",
    content: `Vienas iš patogiausių JOAZE.LT konfigūratoriaus aspektų yra realaus laiko kainos atnaujinimas. Keisdami metalo tipą, prabą, akmenų skaičių ar dydį, iškart matysite, kaip keičiasi galutinė produkto kaina. Tai padeda priimti informuotus sprendimus ir išlaikyti biudžetą.`
  },
  {
    id: 5,
    title: "Įdėjimas į krepšelį ir peržiūra",
    description: "Sužinokite, kaip pridėti sukonfigūruotą prekę į krepšelį ir peržiūrėti užsakymą.",
    icon: React.createElement(ShoppingCart, { className: "w-6 h-6" }),
    videoUrl: "https://www.youtube.com/embed/sRjATADPdaE",
    content: `Kai esate patenkinti savo sukonfigūruotu produktu, spauskite mygtuką 'Įdėti į krepšelį'. Produktas bus pridėtas į Jūsų pirkinių krepšelį. Galite tęsti apsipirkimą arba pereiti į krepšelį, kad peržiūrėtumėte savo užsakymą. Krepšelyje galėsite koreguoti kiekius arba pašalinti prekes.`
  },
  {
    id: 6,
    title: "Atsiskaitymas",
    description: "Detalus vadovas, kaip atlikti mokėjimą ir užbaigti užsakymą.",
    icon: React.createElement(CreditCard, { className: "w-6 h-6" }),
    videoUrl: "https://www.youtube.com/embed/eoByDGrR_Pw",
    content: `Kai esate pasiruošę užbaigti užsakymą, pereikite į atsiskaitymo puslapį. Čia turėsite pasirinkti pristatymo būdą, įvesti pristatymo adresą ir pasirinkti mokėjimo metodą. JOAZE.LT palaiko įvairius mokėjimo būdus, įskaitant banko pavedimus ir elektroninius mokėjimus. Patvirtinkite užsakymą ir atlikite mokėjimą.`
  },
  {
    id: 7,
    title: "Patvirtinimas el. paštu",
    description: "Ką daryti po užsakymo? Gaukite patvirtinimą ir sekite savo užsakymo eigą.",
    icon: React.createElement(Mail, { className: "w-6 h-6" }),
    videoUrl: "https://www.youtube.com/embed/sSjN0ChIHqU",
    content: `Po sėkmingo atsiskaitymo, gausite patvirtinimo el. laišką į savo registruotą el. pašto adresą. Laiške bus pateikta visa užsakymo informacija, įskaitant užsakymo numerį, prekių sąrašą ir pristatymo detales. Išsaugokite šį el. laišką ateičiai.`
  },
  {
    id: 8,
    title: "Užsakymo stebėjimas",
    description: "Sužinokite, kaip stebėti savo užsakymo būseną ir pristatymo eigą.",
    icon: React.createElement(Package, { className: "w-6 h-6" }),
    videoUrl: "https://www.youtube.com/embed/hBouBFensck",
    content: `JOAZE.LT suteikia galimybę stebėti savo užsakymo būseną realiu laiku. Prisijungę prie savo paskyros, rasite skiltį 'Mano užsakymai', kurioje galėsite matyti visų savo užsakymų būseną, nuo apdorojimo iki išsiuntimo ir pristatymo. Taip pat gausite pranešimus el. paštu apie užsakymo būsenos pasikeitimus.`
  }
] 