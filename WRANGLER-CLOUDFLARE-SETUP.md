# ⚡ Wrangler + Cloudflare - GraphQL-optimering

## 🎯 Vad Wrangler KAN och INTE kan göra

### ❌ **Wrangler INTE för:**
- **JWT-konfiguration** - Detta måste göras i WordPress `wp-config.php` på Cloudways-servern
- **WordPress-plugins** - WPGraphQL måste installeras via WordPress admin

### ✅ **Wrangler KAN användas för:**
- **DNS-inställningar** för GraphQL-endpoint
- **Page Rules** för GraphQL-caching
- **Security Rules** för GraphQL-säkerhet
- **Worker Scripts** för GraphQL-middleware
- **Cache-inställningar** för bättre prestanda

---

## 🛠️ **Installation av Wrangler**

```bash
# Installera Wrangler globalt
npm install -g wrangler

# Eller med pnpm
pnpm add -g wrangler

# Logga in på Cloudflare
wrangler auth login
```

---

## 📋 **GraphQL-optimerade Cloudflare-inställningar via Wrangler**

### **1. DNS-konfiguration för GraphQL**

```bash
# Lista befintliga DNS-poster
wrangler dns list --zone your-domain.com

# Lägg till/uppdatera A-record för WordPress (om behövs)
wrangler dns create your-domain.com --type A --name @ --content YOUR_CLOUDWAYS_IP

# Sätt DNS till "DNS Only" för GraphQL-tester (ingen proxy)
wrangler dns update your-domain.com --type A --name @ --content YOUR_CLOUDWAYS_IP --proxied false
```

### **2. Page Rules för GraphQL-prestanda**

```json
// cloudflare-page-rules.json
{
  "targets": [
    {
      "target": "url",
      "constraint": {
        "operator": "matches",
        "value": "your-domain.com/graphql*"
      }
    }
  ],
  "actions": [
    {
      "id": "cache_level",
      "value": "bypass"
    },
    {
      "id": "security_level",
      "value": "medium"
    },
    {
      "id": "ssl",
      "value": "full"
    }
  ],
  "priority": 1,
  "status": "active"
}
```

```bash
# Skapa Page Rule för GraphQL
wrangler page-rule create --zone your-domain.com --file cloudflare-page-rules.json
```

### **3. Security Rules för GraphQL**

```bash
# Skapa security rule för GraphQL-endpoint
wrangler firewall-rule create \
  --zone your-domain.com \
  --expression '(http.request.uri.path contains "/graphql")' \
  --action 'allow' \
  --description "Allow GraphQL endpoint"
```

---

## 🚀 **Cloudflare Worker för GraphQL-middleware (Avancerat)**

### **Skapa Worker för GraphQL-optimering:**

```bash
# Skapa ny Worker
wrangler init graphql-middleware --template worker

# Navigera till Worker-mappen
cd graphql-middleware
```

### **Worker-script för GraphQL-prestanda:**

```javascript
// src/index.js
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Kontrollera om det är GraphQL-request
    if (url.pathname === '/graphql') {
      // Lägg till CORS-headers för GraphQL
      const response = await fetch(request);
      
      const newResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          ...response.headers,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
      
      return newResponse;
    }
    
    // För alla andra requests, vidarebefordra som vanligt
    return fetch(request);
  }
};
```

### **Deploy Worker:**

```bash
# Konfigurera wrangler.toml
cat > wrangler.toml << EOF
name = "graphql-middleware"
main = "src/index.js"
compatibility_date = "2024-01-01"

[[routes]]
pattern = "your-domain.com/graphql*"
zone_name = "your-domain.com"
EOF

# Deploy Worker
wrangler deploy
```

---

## 📋 **Komplett Wrangler-setup för GraphQL**

### **Skript för automatisk konfiguration:**

```bash
#!/bin/bash
# cloudflare-graphql-setup.sh

DOMAIN="your-domain.com"
CLOUDWAYS_IP="your-cloudways-ip"

echo "🚀 Konfigurerar Cloudflare för GraphQL..."

# 1. Sätt DNS till DNS-only för tester
wrangler dns update $DOMAIN --type A --name @ --content $CLOUDWAYS_IP --proxied false

# 2. Skapa Page Rule för GraphQL
cat > page-rule.json << EOF
{
  "targets": [{"target": "url", "constraint": {"operator": "matches", "value": "$DOMAIN/graphql*"}}],
  "actions": [
    {"id": "cache_level", "value": "bypass"},
    {"id": "security_level", "value": "medium"},
    {"id": "ssl", "value": "full"}
  ],
  "priority": 1,
  "status": "active"
}
EOF

wrangler page-rule create --zone $DOMAIN --file page-rule.json

# 3. Sätt tillbaka proxy efter test
echo "✅ GraphQL-konfiguration klar!"
echo "🔧 Testa GraphQL-endpoint: https://$DOMAIN/graphql"
echo "🔄 Sätt tillbaka proxy med: wrangler dns update $DOMAIN --type A --name @ --content $CLOUDWAYS_IP --proxied true"
```

---

## 🔧 **Environment Variables för Wrangler**

```bash
# .env för Wrangler-projekt
CLOUDFLARE_API_TOKEN=your-api-token
CLOUDFLARE_ZONE_ID=your-zone-id
CLOUDWAYS_IP=your-server-ip
WORDPRESS_DOMAIN=your-domain.com
```

---

## ✅ **Wrangler-kommandon för GraphQL-drift**

### **Övervaka GraphQL-prestanda:**
```bash
# Analytics för GraphQL-endpoint
wrangler analytics --zone your-domain.com --filter 'path:/graphql'

# Kontrollera cache-status
wrangler cache status --zone your-domain.com --url https://your-domain.com/graphql
```

### **Felsökning:**
```bash
# Rensa cache för GraphQL
wrangler cache purge --zone your-domain.com --url https://your-domain.com/graphql

# Kontrollera DNS-inställningar
wrangler dns list --zone your-domain.com

# Testa säkerhetsregler
wrangler firewall-rule list --zone your-domain.com
```

---

## 🎯 **Rekommenderad workflow**

### **1. Grundkonfiguration (Gör detta först):**
```bash
# Installera Wrangler
pnpm add -g wrangler

# Logga in
wrangler auth login

# Sätt DNS till DNS-only för GraphQL-tester
wrangler dns update your-domain.com --type A --name @ --content YOUR_IP --proxied false
```

### **2. WordPress-konfiguration (Cloudways):**
- **JWT-konfiguration** - Via Cloudways File Manager (se CLOUDWAYS-JWT-GUIDE.md)
- **WPGraphQL-plugins** - Via WordPress admin

### **3. Cloudflare-optimering (Wrangler):**
```bash
# Page Rules för GraphQL
wrangler page-rule create --zone your-domain.com --file graphql-page-rules.json

# Aktivera proxy igen
wrangler dns update your-domain.com --type A --name @ --content YOUR_IP --proxied true
```

---

## ⚠️ **Viktigt att komma ihåg**

### **Wrangler löser INTE:**
- WordPress JWT-konfiguration (wp-config.php)
- WPGraphQL plugin-installation
- ACF-fältgrupper import

### **Wrangler hjälper med:**
- Cloudflare DNS och proxy-inställningar
- Cache-optimering för GraphQL
- CORS och säkerhetsinställningar
- Prestanda-övervakning

---

**🎉 Använd Wrangler för Cloudflare-optimering, men JWT-konfigurationen måste fortfarande göras i WordPress på Cloudways!** 