# 🔑 JWT Setup Guide - WordPress wp-config.php

## 🎯 Snabb referens för JWT-konfiguration

### 📋 Steg-för-steg instruktioner

1. **SSH in på servern** (eller öppna filen i cPanel/fil-gränssnitt)
2. **Öppna wp-config.php**
3. **Hitta raden:**
   ```php
   /* That's all, stop editing! Happy publishing. */
   ```
4. **Lägg till FÖRE denna rad:**

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

---

## 🔐 Generera säker JWT-nyckel

### **Unix / macOS:**
```bash
openssl rand -hex 32
```

### **Windows (PowerShell ≥ 5):**
```powershell
[guid]::NewGuid().ToString('N') + [guid]::NewGuid().ToString('N')
```

### **Exempel på genererad nyckel:**
```
a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
```

---

## 🚀 WP-CLI-alternativ (snabbare)

```bash
# Generera och sätt JWT-nyckel direkt
wp config set GRAPHQL_JWT_AUTH_SECRET_KEY "$(openssl rand -hex 32)" --raw
wp config set GRAPHQL_JWT_AUTH_ENABLED true --raw
```

---

## ✅ Testa JWT-funktionalitet

### GraphQL-mutation för att hämta token:
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

### Framgångsrik respons:
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

Uppdatera `.env.local` i `apps/next-front/`:

```env
# WordPress GraphQL-endpoint
NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL=https://your-site.com/graphql
NEXT_PUBLIC_WORDPRESS_SITE_URL=https://your-site.com

# JWT Authentication
WORDPRESS_JWT_AUTH_SECRET_KEY=your-64-character-secret-key-here
WORDPRESS_JWT_AUTH_TOKEN=""
WORDPRESS_JWT_USERNAME=api_user
WORDPRESS_JWT_PASSWORD=super-secret-password

# Next.js
NEXT_PUBLIC_SITE_URL=https://your-nextjs-site.com
WORDPRESS_PREVIEW_SECRET=preview-secret-key
```

---

## 🔍 Felsökning

### ❌ Problem: "JWT Auth not working"
**Lösning:**
1. Kontrollera att `GRAPHQL_JWT_AUTH_SECRET_KEY` är satt i wp-config.php
2. Verifiera att JWT-pluginet är aktiverat
3. Testa med GraphQL-mutation för att hämta token
4. Kontrollera att nyckeln är 64 tecken lång

### ❌ Problem: "Invalid JWT token"
**Lösning:**
1. Generera ny JWT-nyckel med `openssl rand -hex 32`
2. Uppdatera wp-config.php med den nya nyckeln
3. Rensa cache och testa igen

### ❌ Problem: "GraphQL endpoint not responding"
**Lösning:**
1. Kontrollera att WPGraphQL-pluginen är aktiverat
2. Verifiera URL:en i miljövariablerna
3. Testa direkt i webbläsaren: `https://your-site.com/graphql`

---

**🎉 När JWT-konfigurationen är klar kan Next.js-appen ansluta säkert till WordPress!** 