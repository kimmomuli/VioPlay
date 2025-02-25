# Vioplay – YouTube-klooni

## Projektin esittely
Vioplay on YouTube-klooni, jonka tavoitteena on tutkia ja oppia uusimpia web-kehityksen ratkaisuja. Projekti on rakennettu moderneilla teknologioilla ja toimii esimerkkinä uusimpien työkalujen yhdistämisestä toimivaksi kokonaisuudeksi. Tässä projektissa hyödynnetään useita ulkopuolisia integraatioita, ja painopiste on erityisesti frontend-kehityksessä. Projekti pohjautuu YouTube-tutoriaaliin, mutta sitä on laajennettu ja mukautettu omien ratkaisujeni mukaan.

## Tavoitteet
- Hyödyntää mahdollisimman moderneja ratkaisuja.
- Oppia uusia asioita ja kehittyä web-kehittäjänä hyödyntämällä alan uusimpia teknologioita.

## Teknologiat ja työkalut (joita en ole aiemmin käyttänyt)
- **[Bun.js](https://bun.sh/)**
- **[Next.js 15](https://nextjs.org/)**
- **[React 19](https://reactjs.org/)**
- **[Shadcn UI](https://github.com/shadcn/ui)**
- **[Drizzle ORM](https://orm.drizzle.team/)**
- **[tRPC](https://trpc.io/)**

---

## Asennus ja kehitysympäristö

Tämän projektin suorittamiseen tarvitset seuraavat palvelut:
- **Clerk**
- **Neon**
- **Upstash**
- **Ngrok**

### Ympäristömuuttujien asettaminen  
Kopioi `.env.example`-tiedosto ympäristömuuttujia varten komennolla:  
```bash
mv .env.example .env
```

### Ngrok-domainin asettaminen  
Muokkaa **package.json** -tiedostossa `dev:webhook`-komennon **domain** vastaamaan omaa **ngrok-domainiasi**.  

Esimerkiksi:  
```json
"dev:webhook": "ngrok http --domain=oma-domain.ngrok-free.app 3000"
```

### Asennus ja käynnistys  

1. **Riippuvuuksien asennus:**  
   ```bash
   bun install
   ```
2. **Kehityspalvelimen käynnistys:**  
   ```bash
   bun run dev
   ```
   Clerk (Webhook) -toiminnallisuuden käyttöönottoa varten suorita:  
   ```bash
   bun run dev:all
   ```

## Build ja tuotantoympäristö
1. **Projektin buildaus:**  
   ```bash
   bun run build
   ```
2. **Tuotantoversion käynnistys:**  
   ```bash
   bun run start
   ```

   ---

### Tiedostorakenne  
```
📂 src/
├── 📂 app/                           # Sovelluksen pääkansio, sisältää reitit ja näkymät
│   ├── 📂 api/                       # API-reitit (tRPC ja Webhookit)
│   ├── 📂 (auth)/                    # Autentikointisivut (kirjautuminen ja rekisteröityminen)
│   ├── 📂 (home)/                    # Kotisivun näkymä ja asettelu
│   ├── 📄 globals.css                # Globaali tyylitiedosto
│   └── 📄 layout.tsx                  # Sovelluksen pääasettelu
│
├── 📂 components/                    # Yleiskäyttöiset React-komponentit
│   ├── 📄 filter-carousel.tsx        # Suodatin- ja karusellikomponentti
│   ├── 📂 ui/                         # UI-komponentit (painikkeet, lomake-elementit jne.)
│
├── 📂 db/                             # Tietokantaan liittyvät tiedostot
│   ├── 📄 index.ts                    # Tietokantayhteys
│   ├── 📄 schema.ts                    # Tietokantataulujen määrittely
│
├── 📂 hooks/                          # Mukautetut React-hookit
│
├── 📂 lib/                            # Apukirjastot ja integraatiot (Redis, utils jne.)
│
├── 📄 middleware.ts                   # Next.js Middleware
│
├── 📂 modules/                        # Modulaariset ominaisuudet (auth, categories, home)
│   ├── 📂 auth/                        # Autentikointiin liittyvät moduulit
│   ├── 📂 categories/                  # Kategoriatietojen käsittely
│   ├── 📂 home/                        # Kotinäkymän rakenne (komponentit, layoutit, osiot)
│
├── 📂 scripts/                        # Skriptit tietojen alustamiseen
│
└── 📂 trpc/                           # tRPC API ja sovelluslogiikka
    ├── 📂 routers/                     # Sovelluksen API-reitit
    ├── 📄 client.tsx                    # tRPC-asiakas
    ├── 📄 server.tsx                    # tRPC-palvelin
```
---

Tämän hetkinen tilanne kuvana

![image](https://github.com/user-attachments/assets/71279243-f7ef-437f-b5a8-80a5bb6ba17e)



