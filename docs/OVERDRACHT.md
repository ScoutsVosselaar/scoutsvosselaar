# Overdracht

Welke accounts de site gebruikt, wie eigenaar is en waar de toegang bewaard wordt. Hou dit bestand bij als er iets wijzigt, bv. bij een nieuwe webmaster of groepsleiding.

**Zet hier nooit wachtwoorden, tokens of secrets.** Dit bestand staat in een publieke repo. Noteer enkel *waar* iets bewaard wordt.

Velden met `____` moeten nog ingevuld worden.

## Afspraken

- Alle accounts staan op naam van de scouts, niet van één persoon. Gebruik het gedeelde scoutsadres: `____`.
- Overal tweestapsverificatie aan. De herstelcodes gaan in de wachtwoordkluis.
- Altijd minstens twee eigenaars. De webmaster is mede-eigenaar, nooit enige eigenaar.
- Wachtwoordkluis van de scouts: `____` (bv. Bitwarden-organisatie of 1Password-kluis). Wie heeft toegang: `____`.

## Accounts

### GitHub-organisatie

| | |
|---|---|
| Naam | `ScoutsVosselaar` (https://github.com/ScoutsVosselaar) |
| Plan | Free |
| Eigenaars | `ScoutsVosselaarAdmin` (gedeeld scoutsaccount) en `BentJ-01` (Bent, webmaster) |
| Repo | `ScoutsVosselaar/scoutsvosselaar` (publiek) |
| Team | `Redactie`, rol Write op de repo: de leiding die de site beheert. Nog aan te maken. |
| 2FA verplicht | Nog aan te zetten (Settings → Authentication security) |
| Login `ScoutsVosselaarAdmin` | E-mail: `____`. Wachtwoord en herstelcodes: `____` |

Het gedeelde account is wat overblijft als de webmaster stopt. Wie het beheert: `____`.

### Cloudflare

| | |
|---|---|
| Account | `____` (op het gedeelde scoutsadres) |
| Plan | Free (Workers free tier volstaat) |
| Eigenaars / leden | `____` |
| Login | Wachtwoord en herstelcodes: `____` |

### Worker `sveltia-cms-auth`

Regelt het inloggen met GitHub in de CMS. Zonder de Worker kan de leiding niet inloggen (enkel met een persoonlijk toegangstoken).

| | |
|---|---|
| Cloudflare-account | zie hierboven |
| URL | `____` (staat ook als `cmsAuthUrl` in `deployment.config.ts`) |
| Broncode | https://github.com/sveltia/sveltia-cms-auth, versie `____` |
| Variabelen | `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` (secret), `ALLOWED_DOMAINS` |
| Waar staat het secret | Enkel in de Worker en in de wachtwoordkluis: `____` |

### GitHub OAuth App

| | |
|---|---|
| Waar | Organisatie `ScoutsVosselaar` → Settings → Developer settings → OAuth Apps |
| Naam | `Scouts Vosselaar CMS` |
| Homepage URL | `https://scoutsvosselaar.github.io/scoutsvosselaar/` (na het domein: `https://scoutsvosselaar.be/`) |
| Callback URL | `https://____/callback` (de Worker-URL) |
| Client ID | `____` (niet geheim) |
| Client secret | In de Worker en in de wachtwoordkluis. Aangemaakt op `____`. |

Lekt het secret: maak in de OAuth App een nieuw secret aan, zet het in de Worker en verwijder het oude.

### Domein en mail

| | |
|---|---|
| Domein | `scoutsvosselaar.be` |
| Registrar / DNS-beheerder | `____` |
| Eigenaar van het domein (houder) | `____` |
| Login DNS-beheer | `____` |
| Vervaldatum / verlenging | `____` (automatisch verlengen: ja / nee) |
| Mail (`info@scoutsvosselaar.be`) | Gehost bij `____` |
| Huidige site op het domein | WordPress, gehost bij `____`. Opzeggen pas na de domeinverhuis. |

## Wat de domeinverhuis later nog vraagt

De volledige stappen staan in `docs/TECHNISCH.md`, "Verhuis naar de organisatie", stap 7. Kort:

1. Eerst alles getest op `scoutsvosselaar.github.io/scoutsvosselaar`, inclusief inloggen in de CMS via de Worker.
2. Toegang tot het DNS-beheer van `scoutsvosselaar.be` (zie hierboven).
3. **Vooraf** alle bestaande DNS-records noteren, vooral MX, SPF, DKIM en andere mailrecords. Die blijven ongewijzigd.
4. Het domein verifiëren bij GitHub (TXT-record).
5. In `deployment.config.ts`: `siteUrl` naar `https://scoutsvosselaar.be`, `basePath` naar `/`. Daarmee gaat ook `noindex` uit en mag Google de site indexeren.
6. Custom domain instellen in GitHub Pages, A-records en `www`-CNAME aanpassen, "Enforce HTTPS" aan.
7. `ALLOWED_DOMAINS` van de Worker en de Homepage URL van de OAuth App bijwerken.
8. Controleren dat mail naar `info@scoutsvosselaar.be` nog aankomt.
9. Oude links van de WordPress-site nakijken, dan pas de oude hosting opzeggen.

## Bij een nieuwe webmaster

- [ ] Uitnodigen als eigenaar van de GitHub-organisatie en als lid van het Cloudflare-account.
- [ ] Toegang geven tot de wachtwoordkluis.
- [ ] Vertrekkende webmaster: pas verwijderen als de nieuwe alles kan. Er blijven altijd minstens twee eigenaars.
- [ ] Dit bestand bijwerken.

Laatst bijgewerkt: 11 november 2026, door `____`.
