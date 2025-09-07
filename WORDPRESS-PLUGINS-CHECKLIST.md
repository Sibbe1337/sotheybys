# 🔧 WordPress Plugins Checklist - KRITISKA PLUGINS SAKNAS

## ❌ **Nuvarande problem:**
```
Error fetching properties: TypeError: Cannot read properties of undefined (reading 'posts')
Error fetching page by slug: TypeError: Cannot read properties of undefined (reading 'page')
```

**Orsak:** WordPress saknar WPGraphQL-plugins!

---

## ✅ **INSTALLERA DESSA PLUGINS I WORDPRESS:**

### **1. WPGraphQL (KRITISK)**
- **Plugin:** WPGraphQL
- **Installera:** WordPress Admin → Plugins → Add New → Sök "WPGraphQL"
- **Aktivera:** Ja
- **Varför:** Grundläggande GraphQL-funktionalitet

### **2. ACF (Advanced Custom Fields) (KRITISK)**
- **Plugin:** Advanced Custom Fields
- **Installera:** WordPress Admin → Plugins → Add New → Sök "Advanced Custom Fields"
- **Aktivera:** Ja
- **Varför:** För Property och Agent-fält

### **3. WPGraphQL for ACF (KRITISK)**
- **Plugin:** WPGraphQL for Advanced Custom Fields
- **Installera:** WordPress Admin → Plugins → Add New → Sök "WPGraphQL for Advanced Custom Fields"
- **Aktivera:** Ja
- **Varför:** Exponerar ACF-fält i GraphQL

### **4. WPGraphQL JWT Authentication (KLAR ✅)**
- **Status:** JWT-nycklar redan konfigurerade i wp-config.php
- **Installera:** WordPress Admin → Plugins → Add New → Sök "WPGraphQL JWT Authentication"
- **Aktivera:** Ja

---

## 📋 **Steg-för-steg installation:**

### **Via WordPress Admin (Enklast):**

1. **Gå till:** https://sothebysrealty.fi/wp-admin
2. **Logga in** med admin-uppgifter
3. **Plugins** → **Add New**
4. **Sök och installera:**
   - ✅ WPGraphQL
   - ✅ Advanced Custom Fields
   - ✅ WPGraphQL for Advanced Custom Fields
   - ✅ WPGraphQL JWT Authentication
5. **Aktivera alla plugins**

### **Via WP-CLI (Om du har Cloudways SSH):**

```bash
# Installera alla kritiska plugins
wp plugin install wp-graphql --activate
wp plugin install advanced-custom-fields --activate
wp plugin install wp-graphql-acf --activate
wp plugin install wp-graphql-jwt-authentication --activate

# Importera ACF-fältgrupper
wp acf import acf-export.json
```

---

## 🧪 **Test efter installation:**

### **1. GraphQL-endpoint test:**
```bash
curl -X POST https://sothebysrealty.fi/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"query { posts(first: 5) { nodes { id title excerpt } } }"}'
```

**Förväntat resultat:** JSON med posts-array

### **2. Next.js ska fungera:**
- Starta om Next.js: `pnpm dev`
- Gå till http://localhost:3001
- **Inga mer "undefined" fel**
- **Riktiga WordPress-data visas**

---

## 🎯 **När plugins är installerade:**

1. **✅ GraphQL queries fungerar**
2. **✅ Next.js visar riktiga data**
3. **✅ Property och Agent-fält blir tillgängliga**
4. **✅ Steg 3 komplett!**

---

## 🆘 **Om problem kvarstår:**

### **Kontrollera GraphQL-endpoint:**
- Gå till: https://sothebysrealty.fi/graphql
- Du bör se GraphQL Playground/Explorer

### **Debug-läge (tillfälligt):**
Lägg till i wp-config.php:
```php
define( 'GRAPHQL_DEBUG', true );
``` 