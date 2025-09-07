# 🔧 JWT-konfiguration via WordPress Admin (Utan SSH)

## 🎯 3 enkla alternativ utan SSH-tillgång

### 📁 **Alternativ 1: cPanel File Manager (Rekommenderat)**

1. **Logga in på ditt hosting-konto** (cPanel, Plesk, etc.)
2. **Öppna File Manager**
3. **Navigera till din WordPress-mapp** (oftast `public_html` eller `www`)
4. **Högerklicka på `wp-config.php`** → **Edit** eller **Code Editor**
5. **Hitta raden:**
   ```php
   /* That's all, stop editing! Happy publishing. */
   ```
6. **Lägg till FÖRE denna rad:**
   ```php
   /**
    * WPGraphQL JWT Auth Configuration
    */
   define( 'GRAPHQL_JWT_AUTH_SECRET_KEY', 'a1a3179c3751587661954461966f48e20e7595cce8bea69c1e4b54aa6830c791' );
   define( 'GRAPHQL_JWT_AUTH_ENABLED', true );
   ```
7. **Spara filen** (Ctrl+S eller Save-knappen)

---

### 📂 **Alternativ 2: FTP/SFTP (FileZilla, etc.)**

1. **Öppna din FTP-klient** (FileZilla, WinSCP, etc.)
2. **Anslut till din server** med FTP-uppgifter
3. **Navigera till WordPress-mappen**
4. **Ladda ned `wp-config.php`** till din dator
5. **Öppna filen i textredigerare** (Notepad++, VS Code, etc.)
6. **Hitta raden:**
   ```php
   /* That's all, stop editing! Happy publishing. */
   ```
7. **Lägg till FÖRE denna rad:**
   ```php
   /**
    * WPGraphQL JWT Auth Configuration
    */
   define( 'GRAPHQL_JWT_AUTH_SECRET_KEY', 'a1a3179c3751587661954461966f48e20e7595cce8bea69c1e4b54aa6830c791' );
   define( 'GRAPHQL_JWT_AUTH_ENABLED', true );
   ```
8. **Spara filen** och **ladda upp den** till servern (ersätt den gamla)

---

### 🔧 **Alternativ 3: WordPress Plugin (Temporär lösning)**

Om du inte kan redigera wp-config.php, kan du lägga till detta i ditt temas `functions.php`:

1. **Gå till WordPress Admin** → **Utseende** → **Temaredigerare**
2. **Välj `functions.php`** i ditt aktiva tema
3. **Lägg till i SLUTET av filen** (efter `<?php` men före `?>` om det finns):
   ```php
   /**
    * WPGraphQL JWT Auth Configuration
    */
   if (!defined('GRAPHQL_JWT_AUTH_SECRET_KEY')) {
       define('GRAPHQL_JWT_AUTH_SECRET_KEY', 'a1a3179c3751587661954461966f48e20e7595cce8bea69c1e4b54aa6830c791');
       define('GRAPHQL_JWT_AUTH_ENABLED', true);
   }
   ```
4. **Klicka "Uppdatera fil"**

⚠️ **Obs:** Alternativ 3 försvinner om du byter tema, så wp-config.php är bättre.

---

## 📋 **Steg-för-steg: cPanel File Manager (Vanligast)**

### 1. **Hitta din hosting-kontrollpanel**
- Gå till din hosting-leverantörs webbplats
- Logga in på ditt konto
- Hitta "cPanel", "Kontrollpanel" eller liknande

### 2. **Öppna File Manager**
- Klicka på **"File Manager"** eller **"Filhanterare"**
- Navigera till din WordPress-mapp (oftast `public_html`)

### 3. **Redigera wp-config.php**
- Högerklicka på `wp-config.php`
- Välj **"Edit"** eller **"Code Editor"**
- Bläddra ned till raden: `/* That's all, stop editing! Happy publishing. */`

### 4. **Klistra in JWT-konfigurationen**
```php
/**
 * WPGraphQL JWT Auth Configuration
 */
define( 'GRAPHQL_JWT_AUTH_SECRET_KEY', 'a1a3179c3751587661954461966f48e20e7595cce8bea69c1e4b54aa6830c791' );
define( 'GRAPHQL_JWT_AUTH_ENABLED', true );

/* That's all, stop editing! Happy publishing. */
```

### 5. **Spara och stäng**
- Klicka **"Save Changes"** eller **"Spara"**
- Stäng redigeraren

---

## ✅ **Testa att det fungerar**

1. **Gå till din WordPress GraphQL-endpoint:**
   ```
   https://your-site.com/graphql
   ```

2. **Testa denna mutation:**
   ```graphql
   mutation LoginUser {
     login(input: {
       clientMutationId: "test123"
       username: "your_admin_username"
       password: "your_admin_password"
     }) {
       authToken
       user {
         id
         name
       }
     }
   }
   ```

3. **Framgångsrik respons ser ut så här:**
   ```json
   {
     "data": {
       "login": {
         "authToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
         "user": {
           "id": "dXNlcjox",
           "name": "Admin"
         }
       }
     }
   }
   ```

---

## 🔍 **Felsökning**

### ❌ **Problem: "Kan inte hitta wp-config.php"**
- Kontrollera att du är i rätt mapp (public_html, www, domains/ditt-domän.com)
- Filen kan vara dold - aktivera "Visa dolda filer" i File Manager

### ❌ **Problem: "GraphQL endpoint svarar inte"**
- Kontrollera att WPGraphQL-pluginen är aktiverad
- Testa URL:en: `https://your-site.com/graphql`

### ❌ **Problem: "Permission denied"**
- Kontrollera att wp-config.php har rätt behörigheter (644)
- Kontakta din hosting-leverantör om du inte kan redigera filen

---

**🎉 Nu kan du konfigurera JWT utan SSH-tillgång!** 