/**
 * Marketing Content Store
 * Stores rich marketing descriptions for properties
 */

export interface PropertyMarketingContent {
  propertyId: string; // Linear API identifier
  language: 'fi' | 'sv' | 'en';
  title: string;
  subtitle?: string;
  description: string;
  highlights?: string[];
  sellingPoints?: string[];
  locationDescription?: string;
  agentNotes?: string;
  lastUpdated: string;
}

// In a production environment, this would be stored in a database or CMS
// For now, we'll use an in-memory store that can be easily migrated
export const marketingContent: Record<string, PropertyMarketingContent> = {
  // Linnankoskenkatu 8 - Finnish content
  '80427149_fi': {
    propertyId: '80427149',
    language: 'fi',
    title: 'Villa Anna – jugendtyylinen kartano Porvoon sydämessä',
    subtitle: 'Historiallinen helmi vuodelta 1904',
    description: `Villa Anna, upea jugendtyylinen kaupunkihuvila, on valmistunut vuonna 1904 ja huokuu historiaa, tarinoita – ja mahdollisuuksia tulevaisuudelle. Porvoon empirekorttelissa sijaitseva vaikuttava rakennus yhdistää ainutlaatuisella tavalla historiallisen arvokkuuden ja modernin asumismukavuuden.

Villa Anna on säilyttänyt aikansa hienoimmat yksityiskohdat: Iiris-kakluunit, koristeelliset kattomaalaukset, korkeat huoneet ja harmoninen pohjaratkaisu luovat kokonaisuuden, joka on sekä vaikuttava että viihtyisä. Rakennuksen ulkoasu ja monet yksityiskohdat kunnioittavat 1900-luvun alun alkuperäistä tyyliä - tätä taloa ei ole modernisoitu pilalle, vaan restauroitu rakkaudella ja arvostuksella.

Pihan mansardikattoinen talousrakennus, jonka tyyli heijastaa alkuperäistä, on rakennettu 1990-luvulla.

Tontti on kooltaan runsaat 1836 m² – vihreä, rauhallinen keidas vanhan hedelmätarhan ympäröimänä keskellä kaupunkia. Tontilla on merkittävä määrä lisärakennusoikeutta, joka voidaan hyödyntää nykyisen piharakennuksen paikalle. Päärakennus on suojeltu, mikä korostaa sen arvoa ja ainutlaatuisuutta – mutta antaa myös selkeät reunaehdot mahdollisille muutoksille.

Villa Anna sijaitsee Linnankoskenkadulla, kaiken keskellä mutta omassa rauhassaan. Vain kivenheiton päässä Porvoon torilta, kahviloista ja vanhasta kaupungista – ja silti puutarhan puiden suojaamana. Tämä on koti tai edustuspaikka, joka tekee vaikutuksen jokaiseen vieraaseen.`,
    highlights: [
      'Historiallinen jugendtyylinen huvila vuodelta 1904',
      'Säilyneet alkuperäiset yksityiskohdat: Iiris-kakluunit ja kattomaalaukset',
      'Runsas 1836 m² tontti keskellä kaupunkia',
      'Merkittävä lisärakennusoikeus',
      'Suojeltu päärakennus',
      'Rauhallinen sijainti lähellä palveluita'
    ],
    sellingPoints: [
      'Ainutlaatuinen historiallinen kohde',
      'Huolellisesti restauroitu',
      'Erinomainen sijainti Porvoon empirekorttelissa',
      'Kehityspotentiaalia lisärakennusoikeuden myötä'
    ],
    locationDescription: 'Villa Anna sijaitsee Linnankoskenkadulla, kaiken keskellä mutta omassa rauhassaan. Vain kivenheiton päässä Porvoon torilta, kahviloista ja vanhasta kaupungista – ja silti puutarhan puiden suojaamana.',
    agentNotes: 'Etsitkö jotain ainutlaatuista – rakennusta, jossa on sielu, historia ja tulevaisuus? Villa Anna ei ole vain talo. Se on elämäntapa.',
    lastUpdated: new Date().toISOString()
  },
  
  // Linnankoskenkatu 8 - Swedish content
  '80427149_sv': {
    propertyId: '80427149',
    language: 'sv',
    title: 'Villa Anna – herrgård i jugendstil i hjärtat av Borgå',
    subtitle: 'Historisk pärla från 1904',
    description: `Villa Anna, en magnifik stadsvilla i jugendstil, färdigställd år 1904 och utstrålar historia, berättelser – och möjligheter för framtiden. Belägen i Borgås empirekvarter kombinerar den imponerande byggnaden på ett unikt sätt historisk värdighet med modern boendekomfort.

Villa Anna har bevarat de finaste detaljerna från sin tid: Iiris kakelugnar, dekorativa takmålningar, höga rum och en harmonisk planlösning skapar en helhet som är både imponerande och mysig. Byggnadens exteriör och många detaljer respekterar den ursprungliga stilen från början av 1900-talet - detta hus har inte moderniserats till ruin, utan restaurerats med kärlek och uppskattning.

Den mansardtakade uthusbyggnaden på gården, vars stil återspeglar originalet, byggdes på 1990-talet.

Tomten är på generösa 1836 m² – en grön, fridfull oas omgiven av en gammal fruktträdgård mitt i staden. Tomten har en betydande mängd ytterligare byggrätter, som kan utnyttjas på platsen för den nuvarande gårdsbyggnaden. Huvudbyggnaden är skyddad, vilket betonar dess värde och unikhet – men ger också tydliga ramvillkor för eventuella förändringar.

Villa Anna ligger på Linnankoskenkatu, mitt i allt, men i sin egen lugn och ro. Bara ett stenkast från Borgås torg, kaféer och gamla stan – och ändå skyddad av trädgårdsträden. Detta är ett hem eller en representativ plats som kommer att imponera på varje besökare.`,
    highlights: [
      'Historisk jugendstilvilla från 1904',
      'Bevarade originaldetaljer: Iiris kakelugnar och takmålningar',
      'Generös tomt på 1836 m² mitt i staden',
      'Betydande ytterligare byggrätter',
      'Skyddad huvudbyggnad',
      'Lugnt läge nära service'
    ],
    sellingPoints: [
      'Unikt historiskt objekt',
      'Omsorgsfullt restaurerat',
      'Utmärkt läge i Borgås empirekvarter',
      'Utvecklingspotential med ytterligare byggrätter'
    ],
    locationDescription: 'Villa Anna ligger på Linnankoskenkatu, mitt i allt, men i sin egen lugn och ro. Bara ett stenkast från Borgås torg, kaféer och gamla stan – och ändå skyddad av trädgårdsträden.',
    agentNotes: 'Letar du efter något unikt – en byggnad med själ, historia och framtid? Villa Anna är inte bara ett hus. Det är ett sätt att leva.',
    lastUpdated: new Date().toISOString()
  }
};

/**
 * Get marketing content for a property
 */
export function getMarketingContent(propertyId: string, language: 'fi' | 'sv' | 'en' = 'fi'): PropertyMarketingContent | null {
  const key = `${propertyId}_${language}`;
  return marketingContent[key] || null;
}

/**
 * Add or update marketing content for a property
 */
export function setMarketingContent(content: PropertyMarketingContent): void {
  const key = `${content.propertyId}_${content.language}`;
  marketingContent[key] = {
    ...content,
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Get all available languages for a property
 */
export function getAvailableLanguages(propertyId: string): ('fi' | 'sv' | 'en')[] {
  const languages: ('fi' | 'sv' | 'en')[] = [];
  
  if (marketingContent[`${propertyId}_fi`]) languages.push('fi');
  if (marketingContent[`${propertyId}_sv`]) languages.push('sv');
  if (marketingContent[`${propertyId}_en`]) languages.push('en');
  
  return languages;
}

/**
 * Check if marketing content exists for a property
 */
export function hasMarketingContent(propertyId: string, language?: 'fi' | 'sv' | 'en'): boolean {
  if (language) {
    return !!marketingContent[`${propertyId}_${language}`];
  }
  
  // Check if content exists in any language
  return getAvailableLanguages(propertyId).length > 0;
}
