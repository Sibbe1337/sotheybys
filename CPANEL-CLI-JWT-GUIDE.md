# 🔧 cPanel CLI - JWT-konfiguration

## 🎯 Använda cPanel CLI för JWT-setup

### 📋 **Alternativ 1: cPanel Terminal (Vanligast)**

Många hosting-leverantörer erbjuder en **Terminal** direkt i cPanel:

1. **Logga in på cPanel**
2. **Hitta "Terminal"** eller **"SSH Terminal"** under "Advanced" eller "Verktyg"
3. **Öppna terminalen** (körs direkt i webbläsaren)
4. **Navigera till WordPress-mappen:**
   ```bash
   cd public_html
   # eller
   cd www
   # eller
   cd domains/ditt-domän.com/public_html
   ```

5. **Skapa backup av wp-config.php:**
   ```bash
   cp wp-config.php wp-config.php.backup
   ```

6. **Redigera wp-config.php med nano/vim:**
   ```bash
   nano wp-config.php
   ```

7. **Hitta raden:** `/* That's all, stop editing! Happy publishing. */`

8. **Lägg till FÖRE denna rad:**
   ```php
   /**
    * WPGraphQL JWT Auth Configuration
    */
   define( 'GRAPHQL_JWT_AUTH_SECRET_KEY', 'a1a3179c3751587661954461966f48e20e7595cce8bea69c1e4b54aa6830c791' );
   define( 'GRAPHQL_JWT_AUTH_ENABLED', true );
   ```

9. **Spara i nano:** `Ctrl+X` → `Y` → `Enter`

---

### 📋 **Alternativ 2: cPanel API (Avancerat)**

Om du har API-tillgång till cPanel:

```bash
# Hämta befintlig wp-config.php
curl -u username:password \
  "https://yourdomain.com:2083/execute/Fileman/get_file_content" \
  -d "dir=/public_html&file=wp-config.php"

# Redigera filen lokalt och ladda upp igen
curl -u username:password \
  "https://yourdomain.com:2083/execute/Fileman/save_file_content" \
  -d "dir=/public_html&file=wp-config.php&content=<NEW_CONTENT>"
```

---

### 📋 **Alternativ 3: cPanel WP-CLI (Om tillgängligt)**

Vissa hosting-leverantörer har WP-CLI installerat i cPanel:

```bash
# Testa om WP-CLI finns
wp --info

# Om det fungerar, lägg till JWT-konfiguration
wp config set GRAPHQL_JWT_AUTH_SECRET_KEY "a1a3179c3751587661954461966f48e20e7595cce8bea69c1e4b54aa6830c791" --raw
wp config set GRAPHQL_JWT_AUTH_ENABLED true --raw
```

---

### 📋 **Alternativ 4: Sed/Awk (En-radskommando)**

Om du har Terminal-tillgång via cPanel:

```bash
# Navigera till WordPress-mappen
cd public_html

# Skapa backup
cp wp-config.php wp-config.php.backup

# Lägg till JWT-konfiguration med sed
sed -i.bak '/That'\''s all, stop editing!/i\
/**\
 * WPGraphQL JWT Auth Configuration\
 */\
define( '\''GRAPHQL_JWT_AUTH_SECRET_KEY'\'', '\''a1a3179c3751587661954461966f48e20e7595cce8bea69c1e4b54aa6830c791'\'' );\
define( '\''GRAPHQL_JWT_AUTH_ENABLED'\'', true );\
' wp-config.php

# Verifiera ändringen
tail -10 wp-config.php
```

---

## 🔍 **Hitta cPanel Terminal**

### **Vanliga platser i cPanel:**
- **"Terminal"** under "Advanced Tools"
- **"SSH Terminal"** under "Security"
- **"Command Line"** under "Files"
- **"Shell Access"** under "Advanced"

### **Så här ser det ut:**
1. Logga in på `https://yourdomain.com/cpanel`
2. Sök efter "Terminal" eller "SSH"
3. Klicka på ikonen
4. En svart terminal öppnas i webbläsaren

---

## 🛠️ **Snabb konfiguration med cPanel Terminal**

### **Komplett script (copy-paste):**
```bash
# Navigera till WordPress
cd public_html

# Backup
cp wp-config.php wp-config.php.backup

# Lägg till JWT-konfiguration
cat << 'EOF' > jwt-config.tmp
/**
 * WPGraphQL JWT Auth Configuration
 */
define( 'GRAPHQL_JWT_AUTH_SECRET_KEY', 'a1a3179c3751587661954461966f48e20e7595cce8bea69c1e4b54aa6830c791' );
define( 'GRAPHQL_JWT_AUTH_ENABLED', true );

EOF

# Infoga före "That's all..."
sed -i.bak '/That'\''s all, stop editing!/e cat jwt-config.tmp' wp-config.php

# Rensa temp-fil
rm jwt-config.tmp

# Verifiera
echo "JWT-konfiguration tillagd! Kontrollera:"
grep -A 5 -B 5 "GRAPHQL_JWT_AUTH_SECRET_KEY" wp-config.php
```

---

## ✅ **Testa konfigurationen**

Efter att ha lagt till JWT-konfigurationen:

```bash
# Testa att WordPress fungerar
curl -I https://yourdomain.com

# Testa GraphQL-endpoint
curl -I https://yourdomain.com/graphql

# Testa JWT-login (om WP-CLI finns)
wp user list
```

---

## 🔍 **Felsökning**

### ❌ **Problem: "Terminal finns inte i cPanel"**
**Lösning:** Kontakta din hosting-leverantör och fråga om:
- SSH-tillgång kan aktiveras
- Terminal-funktionen kan aktiveras
- WP-CLI är installerat

### ❌ **Problem: "Permission denied"**
**Lösning:**
```bash
# Kontrollera rättigheter
ls -la wp-config.php

# Sätt rätt rättigheter
chmod 644 wp-config.php
```

### ❌ **Problem: "Kan inte hitta wp-config.php"**
**Lösning:**
```bash
# Hitta WordPress-installationen
find . -name "wp-config.php" -type f

# Vanliga platser
ls -la public_html/wp-config.php
ls -la www/wp-config.php
ls -la domains/*/public_html/wp-config.php
```

---

## 🎯 **Hosting-leverantörer som stöder cPanel Terminal**

- **SiteGround** - Terminal under "Advanced"
- **Bluehost** - SSH Terminal under "Advanced"
- **HostGator** - Terminal under "Advanced Tools"
- **GoDaddy** - SSH Terminal (måste aktiveras)
- **Namecheap** - Terminal under "Advanced"

---

**🎉 Med cPanel Terminal kan du använda kommandoraden utan SSH-setup!** 