# Technische documentatie

Voor wie de site technisch beheert. Voor de leiding is er `docs/HANDLEIDING.md`, voor accounts en eigenaars `docs/OVERDRACHT.md`.

## Overzicht

- **Site:** Astro (statische output), inhoud in `src/content/`, schema's in `src/content.config.ts`.
- **CMS:** Sveltia CMS, bereikbaar op `/admin/`. De configuratie staat in `src/cms/config.ts`.
- **Repo:** `ScoutsVosselaar/scoutsvosselaar` op GitHub.
- **Hosting:** GitHub Pages, gebouwd door GitHub Actions bij elke commit op `main`. Nu op `https://scoutsvosselaar.github.io/scoutsvosselaar/`, later op `https://scoutsvosselaar.be/`.
- **Login CMS:** GitHub OAuth via de `sveltia-cms-auth` Worker op Cloudflare (nog op te zetten, zie de verhuischecklist, stap 5 en 6).

## Alles wat van de eigenaar afhangt

Staat op één plek: `deployment.config.ts`. Elke waarde kan ook via een omgevingsvariabele.

De Deploy-workflow zet `SITE_URL` en `BASE_PATH` zelf, op basis van de Pages-instellingen (`actions/configure-pages`). Staat er een custom domain in Settings → Pages, dan bouwt de site voor dat domein, anders voor `scoutsvosselaar.github.io/scoutsvosselaar`. De standaardwaarden in `deployment.config.ts` gelden enkel lokaal en in CI.

Links in de inhoud naar `scoutsvosselaar.be` (bv. overgenomen van de oude site) worden bij het bouwen links binnen de site (`src/lib/site-links.ts`). Enkel bestanden onder `/wordpress/` blijven naar de oude server wijzen.

| Waarde | Variabele | Nu | Na het koppelen van het domein |
|---|---|---|---|
| Repo voor de CMS | `CMS_REPO` | `ScoutsVosselaar/scoutsvosselaar` | `ScoutsVosselaar/scoutsvosselaar` |
| Branch | `CMS_BRANCH` | `main` | `main` |
| Site-URL | `SITE_URL` | `https://scoutsvosselaar.github.io` | `https://scoutsvosselaar.be` |
| Base path | `BASE_PATH` | `/scoutsvosselaar` | `/` |
| Auth-URL | `CMS_AUTH_URL` | leeg | URL van de Worker |

Zolang `siteUrl` niet het eigen domein is, krijgt elke pagina `noindex` en verbiedt `robots.txt` alles. Dat gaat vanzelf uit zodra `siteUrl` op `https://scoutsvosselaar.be` staat.

Zolang `CMS_AUTH_URL` leeg is, toont de CMS enkel "Inloggen met een toegangstoken" (en op localhost "Werken met een lokale repository").

## Lokaal ontwikkelen

Nodig: Node 22 (zie `.nvmrc`) en pnpm. pnpm krijg je met `corepack enable`; de versie staat in `package.json` (`packageManager`).

```sh
pnpm install
pnpm dev          # site op http://localhost:4321/scoutsvosselaar/
pnpm check        # typecontrole
pnpm test         # unit tests (datums, content-helpers)
pnpm test:e2e     # Playwright: CMS-flows op desktop en gsm
pnpm build
```

### CMS lokaal gebruiken

1. `pnpm dev`
2. Open `http://localhost:4321/scoutsvosselaar/admin/index.html` in Chrome, Edge of een andere Chromium-browser. (In de devserver werkt enkel het adres met `index.html`; online werkt ook `/admin/`.)
3. Kies "Werken met een lokale repository" en selecteer de map van de repo.

De CMS schrijft dan rechtstreeks in je bestanden, zonder commits. Controleer met `git diff` en commit zelf.

De admin is bewust een statisch bestand (`public/admin/index.html`) en geen Astro-pagina: de devserver herlaadt Astro-pagina's bij elke bestandswijziging, wat opslaan in de lokale modus kan onderbreken. De integratie `src/cms/integration.ts` bundelt `src/cms/admin.ts` met de configuratie naar `public/admin/app/` bij elke start van `pnpm dev` en `pnpm build`. Die map staat in `.gitignore`. Wijzig je `src/cms/config.ts`, herstart dan `pnpm dev`.

### Afspraken in de inhoud

- **Afbeeldingen** komen in `src/assets/uploads/<collectie>/`. In de inhoud staat een pad relatief aan het bestand (`../../assets/uploads/posts/foto.webp`), zodat `astro:assets` ze optimaliseert. Bij upload zet de CMS foto's om naar webp, max 2000 px breed, kwaliteit 80. Daarbij verdwijnen EXIF-gegevens, ook GPS (getest in `tests/e2e/cms.spec.ts`).
- **PDF's van 't Voske** komen in `public/voske/`, in de inhoud als `/voske/<bestand>.pdf` (zonder base path; de site zet dat ervoor).
- **Tijden** zijn Belgische tijd zonder tijdzone, bv. `2026-10-25T14:00`. De CMS zet de invoer altijd vast op `Europe/Brussels`, ook als de browser van de redacteur in een andere tijdzone staat. De site rekent nooit met de tijdzone van de buildserver (`src/lib/dates.ts`).
- **Bestandsnamen** van berichten en evenementen: `JJJJ-MM-DD-titel`, met de datum van het bericht of het begin van het evenement.
- **Inhoudsfouten breken de build niet.** Ongeldige waarden, ontbrekende afbeeldingen en verwijzingen naar verwijderde leiding of takken verschijnen als `[inhoud]`-waarschuwing in de buildlog en worden overgeslagen. Astro meldt een verwijzing naar een verwijderd item zelf ook als `[ERROR] Invalid content reference`, maar de build loopt gewoon door.

## Verhuis naar de organisatie

De organisatie heet `ScoutsVosselaar`, de repo staat op `ScoutsVosselaar/scoutsvosselaar` en de site tijdelijk op `https://scoutsvosselaar.github.io/scoutsvosselaar/`. Gebruik voor alle accounts het gedeelde scoutsadres met tweestapsverificatie, en noteer alles in `docs/OVERDRACHT.md`.

### 1. GitHub-organisatie klaarzetten

- [x] Organisatie `ScoutsVosselaar` aanmaken (plan Free). Eigenaars: het gedeelde scoutsaccount `ScoutsVosselaarAdmin` en Bent (`BentJ-01`).
- [ ] Settings → Authentication security: "Require two-factor authentication" aan.
- [ ] Team "Redactie" aanmaken.

### 2. Repo overdragen

- [x] In `BentJ-01/scoutsvosselaar`: Settings → General → Danger Zone → Transfer ownership → naar `ScoutsVosselaar`.
- [x] Controleer dat de repo publiek is.
- [ ] Repo → Settings → Collaborators and teams: team "Redactie" met rol **Write**.
- [x] Lokaal: `git remote set-url origin https://github.com/ScoutsVosselaar/scoutsvosselaar.git` (of opnieuw clonen)

GitHub stuurt het oude adres door, maar pas toch alles aan.

### 3. Configuratie aanpassen

- [x] In `deployment.config.ts`: `repo` naar `ScoutsVosselaar/scoutsvosselaar`, `siteUrl` naar `https://scoutsvosselaar.github.io`. `basePath` blijft `/scoutsvosselaar` tot het domein gekoppeld is (stap 7).
- [x] Commit en push op `main`.

### 4. GitHub Pages aanzetten

- [x] Repo → Settings → Pages → Source: **GitHub Actions**.
- [x] Repo → Actions: workflows toestaan als GitHub dat vraagt.
- [x] Workflow "Deploy" laten lopen en controleren dat de site op `https://scoutsvosselaar.github.io/scoutsvosselaar/` staat.
- [ ] Branch protection op `main`: force push en verwijderen blokkeren. Rechtstreeks committen moet toegelaten blijven, want de CMS commit op `main`. Zie "Branch protection" onder "CI en onderhoud".

### 5. OAuth App registreren

- [ ] Organisatie → Settings → Developer settings → OAuth Apps → New OAuth App.
  - Application name: `Scouts Vosselaar CMS`
  - Homepage URL: de site-URL
  - Authorization callback URL: `https://<worker-url>/callback` (de Worker-URL komt uit stap 6; vul eerst iets tijdelijks in en pas daarna aan)
- [ ] Client ID noteren, een client secret aanmaken. **Het secret komt nooit in de repo**, enkel in de Worker (stap 6) en in de wachtwoordkluis van de scouts.

### 6. Worker deployen

- [ ] In het Cloudflare-account van de scouts de Worker `sveltia-cms-auth` deployen. Volg de README van [sveltia/sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) (knop "Deploy to Cloudflare" of `wrangler deploy`). Lees de README van de dan actuele versie; namen van variabelen kunnen wijzigen.
- [ ] Bij de Worker de variabelen zetten (Settings → Variables and Secrets):
  - `GITHUB_CLIENT_ID`: uit stap 5
  - `GITHUB_CLIENT_SECRET`: uit stap 5, als **Secret** (versleuteld)
  - `ALLOWED_DOMAINS`: de domeinen van de site, bv. `scoutsvosselaar.be, www.scoutsvosselaar.be, scoutsvosselaar.github.io`
- [ ] De callback-URL van de OAuth App aanpassen naar `https://<worker-url>/callback`.
- [ ] In `deployment.config.ts` `cmsAuthUrl` op `https://<worker-url>` zetten, committen en pushen.
- [ ] Testen: `/admin/` openen, "Inloggen met GitHub", een bericht als concept opslaan en weer verwijderen.

### 7. Domein koppelen

Pas na een volledige test op `github.io`.

- [ ] Domein verifiëren: organisatie → Settings → Pages → Add a domain → `scoutsvosselaar.be`. Zet het TXT-record dat GitHub vraagt bij de DNS-beheerder. Dit voorkomt dat iemand anders het domein op GitHub Pages claimt.
- [ ] In `deployment.config.ts` de standaardwaarden ook aanpassen: `siteUrl` naar `https://scoutsvosselaar.be`, `basePath` naar `/` (voor lokaal en CI; de Deploy-workflow volgt de Pages-instellingen). Committen en pushen.
- [ ] Repo → Settings → Pages → Custom domain: `scoutsvosselaar.be`. **Pas als de DNS al naar GitHub wijst**: anders stuurt GitHub elke bezoeker van `github.io` door naar de oude site. De volgende Deploy-run bouwt dan vanzelf voor het domein.
- [ ] Bij de DNS-beheerder **enkel** de webrecords aanpassen:
  - apex `scoutsvosselaar.be`: A-records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (en eventueel AAAA `2606:50c0:8000::153` tot `2606:50c0:8003::153`)
  - `www`: CNAME naar `scoutsvosselaar.github.io`
  - Controleer de actuele IP-adressen in de GitHub-documentatie ("Managing a custom domain for your GitHub Pages site").
- [ ] **MX-, SPF- (TXT), DKIM- en andere mailrecords niet aanraken.** Noteer ze vooraf, en controleer achteraf dat ze ongewijzigd zijn en dat mail naar `info@scoutsvosselaar.be` nog aankomt.
- [ ] Zodra het certificaat klaar is: "Enforce HTTPS" aan.
- [ ] `ALLOWED_DOMAINS` van de Worker en de Homepage URL van de OAuth App nakijken.

### 8. Afronden

- [ ] Leiding met redactietoegang uitnodigen in team "Redactie".
- [ ] De open velden (`____`) in `docs/OVERDRACHT.md` invullen: accounts, eigenaars, waar de credentials staan.
- [ ] Bent blijft mede-eigenaar, nooit enige eigenaar.

## Sveltia CMS updaten

Sveltia is nog pre-1.0 en verschijnt vaak. De versie staat exact gepind in `package.json`.

1. Lees de release notes van alle versies sinds de huidige (GitHub releases van `sveltia/sveltia-cms`).
2. `pnpm add -E @sveltia/cms@<versie>`
3. `pnpm check && pnpm test && pnpm test:e2e`
4. Test kort zelf in de lokale modus en daarna online.

Dependabot slaat `@sveltia/cms` bewust over (`.github/dependabot.yml`). Update Sveltia enkel met de stappen hierboven.

## CI en onderhoud

- **Deploy** (`.github/workflows/deploy.yml`): bij elke commit op `main`, ook van de CMS, en elke nacht. Typecontrole, unit tests, build en publicatie. Mislukt ze, dan opent ze een issue met label `deploy` en blijft de vorige versie online.
- **CI** (`.github/workflows/ci.yml`): bij elke pull request. Installeren, `astro check`, unit tests en build. Ze publiceert niets.
- **Dependabot** (`.github/dependabot.yml`): elke maandag voorstellen voor npm-pakketten en GitHub Actions, gegroepeerd: kleine npm-updates (minor en patch) samen, grote (major) samen, en alle actions samen. Merge een voorstel pas als CI groen is. Bij een grote update: lees de release notes en test lokaal met `pnpm dev`.
- Gebruik in alle workflows dezelfde versies van de actions. Dependabot werkt ze samen bij.
- De Playwright-tests (`pnpm test:e2e`) draaien niet in CI. Draai ze lokaal bij wijzigingen aan de CMS en bij elke Sveltia-update.

### Als publiceren mislukt

1. Open het issue "Publiceren van de site is mislukt" of Actions → Deploy en bekijk de rode stap.
2. Een fout in de inhoud breekt de build niet; zoek dus eerst in code, configuratie of afhankelijkheden. Een recente Dependabot-merge is een goede verdachte.
3. Herstel op `main` en push. De volgende geslaagde run zet de site weer goed. Sluit daarna het issue.
4. Stond Pages uit of is de omgeving `github-pages` verdwenen: Settings → Pages → Source op **GitHub Actions** zetten.

### Branch protection

Een ruleset op `main` die force push en verwijderen blokkeert, maar gewone commits toelaat:

1. Repo → **Settings** → **Rules** → **Rulesets** → **New ruleset** → **New branch ruleset**.
2. **Ruleset Name:** `main beschermen`. **Enforcement status:** **Active**.
3. **Bypass list:** leeg laten.
4. **Target branches** → **Add target** → **Include default branch**.
5. Bij **Rules** enkel **Restrict deletions** en **Block force pushes** aangevinkt laten. Vink **niet** aan: "Require a pull request before merging", "Require status checks to pass", "Require signed commits" of "Restrict updates". Die kunnen de commits van de CMS tegenhouden.
6. **Create**.

## Kalender en agenda-feeds

- `/kalender/` toont alle activiteiten per maand, met filters per tak. Voorbije activiteiten verbergt een klein script op basis van de huidige datum, dus ook zonder nieuwe build. Een tak-link naar `/kalender/#tak-welpen` zet de filter meteen op die tak.
- Feeds (iCalendar, RFC 5545): `/ics/alle.ics`, `/ics/<tak>.ics` (die tak plus de activiteiten voor de hele groep) en `/ics/evenement/<id>.ics`. Gemaakt in `src/lib/ics.ts` met `ical-generator`.
- Tijden staan in de feed als Belgische tijd met `TZID=Europe/Brussels` en een VTIMEZONE-blok. De datums gaan als Luxon-objecten in die zone naar `ical-generator`: met een gewone `Date` zou de tijd in de tijdzone van de buildserver komen. Getest rond zomer- en wintertijd en in verschillende tijdzones (`tests/ics.test.ts`).
- UID per activiteit is `<id>@scoutsvosselaar.be`, en DTSTAMP is vast. Zo geeft dezelfde inhoud altijd hetzelfde bestand en zien agenda-apps een gewijzigde activiteit als dezelfde.
- Een geannuleerde activiteit krijgt `STATUS:CANCELLED` en blijft in de feed, zodat ze uit de agenda's van wie geabonneerd is verdwijnt of als geannuleerd verschijnt.
