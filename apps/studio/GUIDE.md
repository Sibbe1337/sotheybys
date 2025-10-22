# Sanity CMS Guide för Sotheby's Team

## 🔐 Logga in

1. Gå till https://sothebys-cms.sanity.studio (kommer att vara tillgänglig efter deployment)
2. Klicka "Sign in with Google"
3. Använd din @sothebysrealty.fi email

## 📝 Redigera "Om Oss" sida

1. Klicka "Pages" i menyn
2. Välj "Om Oss"
3. Redigera text (fungerar som Word)
4. Klicka "Publish" (grön knapp)
5. Vänta 60 sekunder → ändringen syns på hemsidan

## 👤 Lägg till ny mäklare

1. Klicka "Staff Member" i menyn
2. Klicka "+ Create" (blå knapp)
3. Fyll i:
   - **Name**: "Lisa Virtanen"
   - **Email**: "lisa@sothebysrealty.fi"
   - **Phone**: "+358 40 123 4567"
   - **Role (Finnish)**: "Kiinteistönvälittäjä"
   - **Role (Swedish)**: "Fastighetsmäklare"
   - **Role (English)**: "Real Estate Agent"
4. Ladda upp profilbild (dra & släpp)
5. Sätt "Display Order" (1 = först, 2 = andra, etc.)
6. Klicka "Publish"

## 🖼️ Byt teambild

1. Klicka "Global Settings"
2. Scrolla till "Media"
3. Klicka "Upload" under "Team Photo"
4. Välj ny bild
5. Klicka "Publish"

## 📞 Uppdatera kontaktinformation

1. Klicka "Global Settings"
2. Scrolla till "Contact Information"
3. Redigera address, email, phone
4. Klicka "Publish"

## 🎨 Ändra färger

1. Klicka "Global Settings"
2. Scrolla till "Brand Colors"
3. Klicka på färgväljaren för Primary/Secondary/Background/Text
4. Välj ny färg
5. Klicka "Publish"

## 📱 Uppdatera sociala medier

1. Klicka "Global Settings"
2. Scrolla till "Social Media"
3. Lägg till eller uppdatera URLs för:
   - Facebook
   - Instagram
   - LinkedIn
   - Twitter
4. Klicka "Publish"

## 🔍 SEO Inställningar

### För en specifik sida:
1. Öppna sidan (t.ex. "Om Oss")
2. Scrolla till "SEO" sektionen
3. Fyll i:
   - **Meta Title**: Kort titel för Google (max 60 tecken)
   - **Meta Description**: Beskrivning för Google (max 160 tecken)
   - **Social Share Image**: Bild för Facebook/Twitter delningar
4. Klicka "Publish"

### För hela webbplatsen (default):
1. Klicka "Global Settings"
2. Scrolla till "Default SEO"
3. Fyll i samma fält som ovan
4. Klicka "Publish"

## 📊 Analytics

1. Klicka "Global Settings"
2. Scrolla till "Analytics"
3. Lägg till:
   - **Google Analytics ID**: Din GA4 measurement ID (t.ex. G-XXXXXXXXXX)
   - **Google Tag Manager ID**: Din GTM container ID (t.ex. GTM-XXXXXXX)
4. Klicka "Publish"

## ⚙️ Tekniska detaljer

### Hur snabbt syns ändringar?
- **Sanity Studio**: Ändringar sparas omedelbart när du klickar "Publish"
- **Hemsidan**: Ändringar syns inom 60 sekunder (tack vare ISR - Incremental Static Regeneration)

### Vad händer om jag gör ett misstag?
- Sanity sparar all historik
- Du kan återställa tidigare versioner via "History" knappen (klocksymbol)
- Klicka på en tidigare version och välj "Restore"

### Kan flera personer redigera samtidigt?
- Ja! Sanity stödjer realtidssamarbete
- Du ser andra användares ändringar live
- Konflikter hanteras automatiskt

## 🆘 Hjälp & Support

### Problem med inloggning?
- Kontrollera att du använder rätt Google-konto (@sothebysrealty.fi)
- Rensa webbläsarens cache och försök igen
- Kontakta IT-support

### Bilder laddas inte upp?
- Maximal filstorlek: 10 MB
- Accepterade format: JPG, PNG, GIF, WebP
- Rekommenderad storlek för profilbilder: 400x400px
- Rekommenderad storlek för hero images: 1920x1080px

### Text formateras konstigt?
- Använd "Paste without formatting" (Ctrl+Shift+V / Cmd+Shift+V)
- Eller använd Sanity's inbyggda formatering istället för att kopiera från Word

### Ändringar syns inte på hemsidan?
1. Vänta 60 sekunder efter publicering
2. Rensa webbläsarens cache (Ctrl+Shift+R / Cmd+Shift+R)
3. Kontrollera att du klickade "Publish" (inte bara "Save")
4. Om problemet kvarstår, kontakta IT-support

## 📧 Kontakt

- **IT Support**: dev@sothebysrealty.fi
- **Sanity Support**: https://sanity.io/help
- **Dokumentation**: https://www.sanity.io/docs

## 🎓 Videotutorials

*(Kommer att läggas till efter deployment)*

1. Introduktion till Sanity Studio (5 min)
2. Redigera en sida (3 min)
3. Lägg till mäklare (4 min)
4. Uppdatera kontaktinformation (2 min)
5. SEO best practices (8 min)

---

**Senast uppdaterad**: 2025-10-22
**Version**: 1.0

