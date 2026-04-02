export interface MenuItem {
  id: string;
  label: string;
  path: string;
  url: string;
  target?: string;
  childItems?: {
    nodes: MenuItem[];
  };
}

export function getMenuItemsForLanguage(lang: string): MenuItem[] {
  return [
    { id: '1', label: lang === 'sv' ? 'Hem' : lang === 'en' ? 'Home' : 'Koti', path: '/', url: '/' },
    {
      id: '2',
      label: lang === 'sv' ? 'Objekt' : lang === 'en' ? 'Properties' : 'Kohteet',
      path: '/kohteet', url: '/kohteet',
      childItems: {
        nodes: [
          { id: '2-1', label: lang === 'sv' ? 'Objekt till salu' : lang === 'en' ? 'Properties for sale' : 'Myyntikohteet', path: '/kohteet', url: '/kohteet' },
          { id: '2-2', label: lang === 'sv' ? 'Hyresobjekt' : lang === 'en' ? 'Rental listings' : 'Vuokrakohteet', path: '/kohteet/vuokrakohteet', url: '/kohteet/vuokrakohteet' },
          { id: '2-3', label: lang === 'sv' ? 'Köpuppdrag' : lang === 'en' ? 'Purchase Mandate' : 'Ostotoimeksiannot', path: '/kohteet/ostotoimeksiannot', url: '/kohteet/ostotoimeksiannot' },
        ]
      }
    },
    { id: '3', label: lang === 'sv' ? 'Sälj med oss' : lang === 'en' ? 'Sell with us' : 'Myymässä', path: '/myymassa', url: '/myymassa' },
    { id: '4', label: lang === 'sv' ? 'Internationellt' : lang === 'en' ? 'International' : 'Kansainvälisesti', path: '/kansainvalisesti', url: '/kansainvalisesti' },
    { id: '5', label: lang === 'sv' ? 'Personal' : lang === 'en' ? 'Personnel' : 'Henkilöstö', path: '/henkilosto', url: '/henkilosto' },
    {
      id: '6',
      label: lang === 'sv' ? 'Kontakta oss' : lang === 'en' ? 'Contact us' : 'Ota yhteyttä',
      path: '/yhteystiedot', url: '/yhteystiedot',
      childItems: {
        nodes: [
          { id: '6-1', label: lang === 'sv' ? 'Om oss' : lang === 'en' ? 'About' : 'Yritys', path: '/yritys', url: '/yritys' },
          { id: '6-2', label: lang === 'sv' ? 'Jobba hos oss' : lang === 'en' ? 'Join us' : 'Meille töihin', path: '/en/meille-toihin', url: '/en/meille-toihin' },
        ]
      }
    },
  ];
}
