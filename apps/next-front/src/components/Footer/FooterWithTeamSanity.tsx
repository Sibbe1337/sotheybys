import { getGlobalSettings } from '@/lib/sanity-queries';
import { urlFor } from '@/lib/sanity';
import FooterWithTeam from './FooterWithTeam';

export default async function FooterWithTeamSanity() {
  const settings = await getGlobalSettings();
  
  // Pass Sanity data as props to client component
  return (
    <FooterWithTeam 
      contact={settings?.contact}
      social={settings?.social}
      logo={settings?.logo ? urlFor(settings.logo).width(300).url() : undefined}
    />
  );
}

