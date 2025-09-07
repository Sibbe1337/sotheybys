# 🌥️ Cloudways + Cloudflare - JWT-konfiguration

## 🎯 JWT-setup för Cloudways hosting

### **Cloudways använder INTE traditionell cPanel!**
Cloudways har sitt eget kontrollpanel med olika alternativ för att redigera filer.

---

## 📋 **Alternativ 1: Cloudways Application Management (Rekommenderat)**

### **Via Cloudways Dashboard:**

1. **Logga in på Cloudways Platform**
   - Gå till `https://platform.cloudways.com`
   - Logga in med dina Cloudways-uppgifter

2. **Välj din WordPress-applikation**
   - Klicka på din server
   - Välj din WordPress-app från listan

3. **Öppna File Manager**
   - Klicka på **"Application Management"**
   - Klicka på **"File Manager"** (webbaserad filredigerare)

4. **Navigera till wp-config.php**
   - Gå till `public_html/` eller root-mappen
   - Klicka på `wp-config.php`

5. **Redigera filen**
   - Klicka **"Edit"** eller högerklicka → **"Edit"**
   - Hitta raden: `/* That's all, stop editing! Happy publishing. */`
   - Lägg till FÖRE denna rad:

```php
/**
 * WPGraphQL JWT Auth Configuration
 */
define( 'GRAPHQL_JWT_AUTH_SECRET_KEY', 'a1a3179c3751587661954461966f48e20e7595cce8bea69c1e4b54aa6830c791' );
define( 'GRAPHQL_JWT_AUTH_ENABLED', true );
```

6. **Spara filen**
   - Klicka **"Save"** eller **"Update File"**

---

## 📋 **Alternativ 2: Cloudways SSH Terminal**

Cloudways erbjuder SSH-tillgång via deras plattform:

### **Aktivera SSH:**
1. **Gå till Cloudways Dashboard**
2. **Välj din server**
3. **Klicka på "Server Management"**
4. **Gå till "SSH Public Keys"**
5. **Lägg till din SSH-nyckel** (eller använd lösenord)

### **Anslut via SSH:**
```bash
# SSH-uppgifter finns i Cloudways Dashboard under "Server Management" → "Master Credentials"
ssh [username]@[server-ip]

# Navigera till WordPress
cd applications/[app-id]/public_html

# Backup
cp wp-config.php wp-config.php.backup

# Redigera med nano
nano wp-config.php
```

### **Lägg till JWT-konfiguration:**
```php
/**
 * WPGraphQL JWT Auth Configuration
 */
define( 'GRAPHQL_JWT_AUTH_SECRET_KEY', 'a1a3179c3751587661954461966f48e20e7595cce8bea69c1e4b54aa6830c791' );
define( 'GRAPHQL_JWT_AUTH_ENABLED', true );
```

**Spara:** `Ctrl+X` → `Y` → `Enter`

---

## 📋 **Alternativ 3: Cloudways WP-CLI**

Cloudways har WP-CLI installerat som standard:

```bash
# SSH in till servern först
ssh [username]@[server-ip]

# Navigera till WordPress-appen
cd applications/[app-id]/public_html

# Lägg till JWT-konfiguration
wp config set GRAPHQL_JWT_AUTH_SECRET_KEY "a1a3179c3751587661954461966f48e20e7595cce8bea69c1e4b54aa6830c791" --raw
wp config set GRAPHQL_JWT_AUTH_ENABLED true --raw

# Verifiera
wp config get GRAPHQL_JWT_AUTH_SECRET_KEY
```

---

## 📋 **Alternativ 4: SFTP (FileZilla)**

Om du föredrar SFTP:

### **Hitta SFTP-uppgifter:**
1. **Cloudways Dashboard** → **Server Management** → **Master Credentials**
2. **Använd uppgifterna i FileZilla:**
   - **Host:** Server IP eller hostname
   - **Username:** Din SSH-användare
   - **Password:** SSH-lösenord
   - **Port:** 22 (SFTP)

### **Redigera wp-config.php:**
1. Ladda ned `wp-config.php`
2. Redigera lokalt
3. Ladda upp igen

---

## 🔧 **Cloudflare-specifika inställningar**

### **Viktiga DNS/Proxy-inställningar:**

1. **Cloudflare Dashboard** → **DNS**
2. **Kontrollera att GraphQL-endpoint fungerar:**
   - `yourdomain.com/graphql` ska vara tillgänglig
   - Om problem: Sätt DNS-post för `yourdomain.com` till "DNS Only" (grå moln) temporärt

### **Page Rules för GraphQL:**
```
yourdomain.com/graphql*
Settings:
- Cache Level: Bypass
- Security Level: Medium
```

---

## 🔍 **Hitta dina Cloudways-uppgifter**

### **I Cloudways Dashboard:**

1. **Server-IP och SSH:**
   - **Server Management** → **Master Credentials**
   - **Public IP:** Din server-IP
   - **SSH Username:** cloudways-user eller liknande
   - **SSH Password:** Se under credentials

2. **WordPress-specifikt:**
   - **Application Management** → **Access Details**
   - **Admin Panel:** WordPress admin-URL
   - **Database Access:** Om du behöver det

3. **App Path:**
   ```
   /home/[cloudways-user]/applications/[app-id]/public_html/
   ```

---

## ✅ **Testa efter konfiguration**

### **1. Kontrollera WordPress:**
```bash
curl -I https://yourdomain.com
```

### **2. Testa GraphQL-endpoint:**
```bash
curl -I https://yourdomain.com/graphql
```

### **3. GraphQL JWT-test:**
```graphql
mutation LoginUser {
  login(input: {
    clientMutationId: "test123"
    username: "admin"
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

---

## 🔍 **Felsökning för Cloudways + Cloudflare**

### ❌ **Problem: "GraphQL endpoint 502/504"**
**Lösning:**
1. Kontrollera Cloudflare Page Rules
2. Sätt DNS till "DNS Only" temporärt
3. Kontrollera att WPGraphQL-plugin är aktiverat

### ❌ **Problem: "Kan inte nå Cloudways File Manager"**
**Lösning:**
1. Kontrollera att du är inloggad på rätt Cloudways-konto
2. Verifiera att applikationen körs
3. Testa SSH-tillgång istället

### ❌ **Problem: "JWT tokens funkar inte"**
**Lösning:**
1. Kontrollera att jwt-auth-pluginet är aktiverat
2. Verifiera att wp-config.php är sparad korrekt
3. Rensa Cloudflare-cache

---

**🎉 Med Cloudways är File Manager eller SSH de bästa alternativen för JWT-konfiguration!** 