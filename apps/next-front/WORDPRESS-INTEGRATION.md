# 🛠️ Steg 1 – WordPress ↔ Next.js GraphQL-koppling ✅ GENOMFÖRT

## 📋 Vad som implementerats

### ✅ 1. Next.js Frontend-applikation
- **Framework**: Next.js 14 med App Router och React Server Components
- **Port**: 3001 (för att undvika konflikt med befintlig app på 3000)
- **Styling**: Tailwind CSS med anpassat designsystem
- **TypeScript**: Fullständig typsäkerhet

### ✅ 2. GraphQL Codegen Pipeline
```bash
# Monorepo-root konfiguration
pnpm graphql-codegen              # Generera typer
pnpm graphql-codegen:watch        # Watch-läge
```

**Konfiguration:**
- `codegen.yml` i repo-roten
- Outputfil: `apps/next-front/src/__generated__/graphql.tsx`
- Inkluderar typade React Apollo hooks

### ✅ 3. WordPress GraphQL-integration
**Beroenden installerade:**
```json
{
  "@apollo/client": "^3.8.8",
  "@graphql-codegen/cli": "^5.0.0", 
  "@graphql-codegen/typescript": "^4.0.1",
  "@graphql-codegen/typescript-operations": "^4.0.1",
  "@graphql-codegen/typescript-react-apollo": "^4.0.0",
  "graphql": "^16.8.1"
}
```

**GraphQL Queries implementerade:**
- `GET_SITE_SETTINGS` - Hämta webbplatsinställningar
- `GET_MENUS` - Hämta navigationsmenyer
- `GET_POSTS` - Hämta blogginlägg med paginering
- `GET_POST_BY_SLUG` - Hämta enskilt inlägg
- `GET_PAGES` - Hämta sidor med paginering  
- `GET_PAGE_BY_SLUG` - Hämta enskild sida

### ✅ 4. Robust Fallback-system
Alla funktioner fungerar **utan WordPress**:
- Fallback-data för site settings
- Fallback-meny med standard-navigation  
- Fallback-meddelanden för saknad data
- Graceful error handling

### ✅ 5. Komponenter implementerade
**Header-komponenter:**
- `HeaderBranding` - Logo och site title
- `MainMenu` - Responsiv navigation

**Footer-komponenter:**  
- `FooterBottomBar` - Copyright och social links

**Sidor:**
- `page.tsx` - Hemsida med hero-sektion och post-lista
- `[slug]/page.tsx` - Dynamisk sida för posts/pages

## 🔧 Miljövariabler (`.env.local`)

Kopiera `env.example` till `.env.local` och konfigurera:

```bash
# WordPress GraphQL-endpoint
NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL=https://din-site.com/graphql

# JWT för autentisering
WORDPRESS_JWT_AUTH_SECRET_KEY=din-hemliga-nyckel
WORDPRESS_JWT_AUTH_TOKEN=""

# Site-URL för bildhantering
NEXT_PUBLIC_WORDPRESS_SITE_URL=https://din-site.com

# Development overrides
# NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL=http://localhost:8000/graphql
# NEXT_PUBLIC_WORDPRESS_SITE_URL=http://localhost:8000
```

## 🚀 Använda applikationen

### Development
```bash
# Starta development server
pnpm dev:next-front

# Bygga för produktion  
pnpm build:next-front

# Type-checking
pnpm --filter next-front type-check
```

### DevContainer-stöd
Port 3001 är konfigurerad i `.devcontainer/devcontainer.json`:
- Automatisk port forwarding
- GraphQL-extensions för VS Code

## 📝 Nästa steg (Steg 2): WordPress-konfiguration

### 1. Installera WordPress-plugins
```bash
# Via WP-CLI eller WordPress admin
wp plugin install wp-graphql --activate
wp plugin install wp-graphql-jwt-authentication --activate  
wp plugin install wp-graphql-acf --activate  # Om ni använder ACF
```

### 2. Konfigurera JWT i `wp-config.php`
```php
define( 'GRAPHQL_JWT_AUTH_SECRET_KEY', 'super-hemlig-nyckel' );
define( 'GRAPHQL_JWT_AUTH_ENABLED', true );
```

### 3. Uppdatera miljövariabler
Ersätt placeholder-värden i `.env.local` med riktiga WordPress-URLs.

### 4. Generera GraphQL-typer
```bash
# När WordPress är konfigurerat
pnpm graphql-codegen
```

### 5. Testa kopplingen
```bash
# Bygg med riktig WordPress-data
pnpm build:next-front
```

## 🎯 Verifiering

### ✅ Vad som fungerar nu
- ✅ Next.js app byggds framgångsrikt
- ✅ Fallback-data visas korrekt
- ✅ TypeScript-typer är korrekta
- ✅ Komponenter renderas utan fel
- ✅ GraphQL codegen pipeline redo
- ✅ DevContainer konfigurerat

### ⏳ Vad som väntar på WordPress
- ⏳ Live GraphQL-data från WordPress
- ⏳ JWT-autentisering för preview
- ⏳ Bildhändelse via WordPress Media Library
- ⏳ Menyer från WordPress admin
- ⏳ ACF-fält (om installerat)

## 🛠️ Teknisk arkitektur

```
apps/next-front/
├── src/
│   ├── __generated__/          # GraphQL-genererade typer (skapas av codegen)
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Hemsida
│   │   └── [slug]/page.tsx    # Dynamiska sidor
│   ├── components/            # React-komponenter
│   │   ├── Header/
│   │   └── Footer/
│   └── lib/
│       └── wordpress.ts       # GraphQL client & queries
├── codegen.yml               # GraphQL Codegen konfiguration  
├── next.config.js           # Next.js konfiguration
├── tailwind.config.ts       # Tailwind CSS konfiguration
└── env.example              # Miljövariabel-mall
```

## 🔍 Felsökning

### GraphQL-fel
```bash
# Kontrollera WordPress GraphQL endpoint
curl https://din-site.com/graphql -H "Content-Type: application/json" -d '{"query":"{ __typename }"}'
```

### TypeScript-fel
```bash
# Regenerera GraphQL-typer
pnpm graphql-codegen
```

### Build-fel
```bash
# Kontrollera TypeScript
pnpm --filter next-front type-check
```

---

## 🎉 Sammanfattning

**Steg 1 är komplett!** Du har nu:

1. ✅ **Fungerande Next.js frontend** med fallback-data
2. ✅ **Komplett GraphQL-pipeline** redo för WordPress
3. ✅ **Production-ready build** som kan deployeras
4. ✅ **TypeScript-säker** implementation
5. ✅ **DevContainer-stöd** för utveckling

**Nästa steg**: Konfigurera WordPress med WPGraphQL-plugins och uppdatera miljövariablerna för att aktivera live-dataanslutning. 

# 🔧 WordPress Integration Guide

## 📋 Steg-för-steg setup

### ✅ Steg 1: Installera WPGraphQL plugins

```bash
# Installera grundläggande GraphQL-stöd
wp plugin install wp-graphql --activate

# Installera JWT-autentisering
wp plugin install wp-graphql-jwt-authentication --activate

# Installera ACF-stöd för GraphQL
wp plugin install advanced-custom-fields --activate
wp plugin install wp-graphql-acf --activate
```

### ✅ Steg 2: Importera ACF-fältgrupper

```bash
# Importera Property och Agent-fälten
wp acf import acf-export.json
```

### 🔑 Steg 3: Konfigurera JWT-autentisering i wp-config.php

**Steg-för-steg:**

1. **SSH in på servern** (eller öppna filen i cPanel/fil-gränssnitt)
2. **Öppna wp-config.php**
3. **Scrolla ned** tills precis före raden som säger:
   ```php
   /* That's all, stop editing! Happy publishing. */
   ```
4. **Klistra in blocket nedan:**

```php
/**
 * ──────────────────────────────────────────────────────────────
 *  WPGraphQL JWT Auth – lägg till strax före "That's all…"
 * ──────────────────────────────────────────────────────────────
 *  Byt ut STRONG_RANDOM_STRING mot en riktig hemlig sträng.
 *  Skapa t.ex. en 64-teckens nyckel med:
 *      openssl rand -hex 32
 */
define( 'GRAPHQL_JWT_AUTH_SECRET_KEY', 'STRONG_RANDOM_STRING' );
define( 'GRAPHQL_JWT_AUTH_ENABLED', true );
```

5. **Spara filen** – klart!

### 💡 Skapa säker JWT-nyckel

| Metod | Kommando |
|-------|----------|
| **Unix / macOS** | `openssl rand -hex 32` |
| **Windows (PowerShell ≥ 5)** | `[guid]::NewGuid().ToString('N') + [guid]::NewGuid().ToString('N')` |

### 🚀 WP-CLI-variant (snabbare)

```bash
# Generera och sätt JWT-nyckel direkt
wp config set GRAPHQL_JWT_AUTH_SECRET_KEY "$(openssl rand -hex 32)" --raw
wp config set GRAPHQL_JWT_AUTH_ENABLED true --raw
```

---

### ✅ Steg 4: Testa JWT-autentisering

När du har sparat wp-config.php kan du testa att hämta en token med denna GraphQL-mutation:

```graphql
mutation LoginUser {
  login(input: {
    clientMutationId: "uniqueId"
    username: "your_username"
    password: "your_password"
  }) {
    authToken
    user {
      id
      name
    }
  }
}
```

**Framgångsrik respons:**
```json
{
  "data": {
    "login": {
      "authToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
      "user": {
        "id": "dXNlcjox",
        "name": "Admin User"
      }
    }
  }
}
```

---

## 🔧 Environment Variables

Skapa `.env.local` i `apps/next-front/`:

```env
# WordPress GraphQL-endpoint
NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL=https://your-site.com/graphql
NEXT_PUBLIC_WORDPRESS_SITE_URL=https://your-site.com

# JWT Authentication
WORDPRESS_JWT_AUTH_SECRET_KEY=your-64-character-secret-key
WORDPRESS_JWT_AUTH_TOKEN=""
WORDPRESS_JWT_USERNAME=api_user
WORDPRESS_JWT_PASSWORD=super-secret-password

# Next.js
NEXT_PUBLIC_SITE_URL=https://your-nextjs-site.com
WORDPRESS_PREVIEW_SECRET=preview-secret-key
```

---

## 🚀 Produktionsdeploy

### 1. Bygg applikationen
```bash
pnpm build:next-front
```

### 2. Starta produktionsservern
```bash
pnpm start:next-front
```

### 3. Verifiera GraphQL-anslutning
- Besök `/api/graphql-test` för att testa anslutningen
- Kontrollera att properties och agents laddas korrekt
- Testa bilduppladdning och ACF-fält

---

## 🔍 Felsökning

### Problem: "GraphQL JWT Auth not working"
**Lösning:**
1. Kontrollera att `GRAPHQL_JWT_AUTH_SECRET_KEY` är satt i wp-config.php
2. Verifiera att JWT-pluginet är aktiverat
3. Testa med GraphQL-mutation för att hämta token

### Problem: "ACF fields not showing in GraphQL"
**Lösning:**
1. Kontrollera att ACF-fälten är importerade: `wp acf export`
2. Verifiera att `wp-graphql-acf` är aktiverat
3. Kontrollera att fälten har `graphql_field_name` satt

### Problem: "Images not loading"
**Lösning:**
1. Kontrollera `NEXT_PUBLIC_WORDPRESS_SITE_URL` i .env
2. Verifiera next.config.js image domains
3. Testa direktlänk till WordPress-bilder

---

## 📊 GraphQL Schema

Efter konfiguration bör ditt GraphQL-schema innehålla:

```graphql
type Post {
  id: ID!
  title: String
  content: String
  slug: String
  property: Post_Property
  agent: Post_Agent
}

type Post_Property {
  price: Float
  address: String
  city: String
  bedrooms: Int
  bathrooms: Int
  area: Float
  gallery: [MediaItem]
  location: ACF_GoogleMap
}

type Post_Agent {
  name: String
  photo: MediaItem
  phone: String
  email: String
  bio: String
}
```

**🎉 Din WordPress ↔ Next.js integration är nu komplett!** 