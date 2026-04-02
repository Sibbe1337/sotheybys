import { createClient } from '@sanity/client';
import * as fs from 'fs';
import * as path from 'path';

const sanityClient = createClient({
  projectId: 'uy5hhchg',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN, // Måste sättas som env var
  useCdn: false,
});

// Staff data per Who We Are PDF 2026-04-02
const staffMembers = [
  {
    name: 'Heidi Metsänen',
    role: { fi: 'Senior Broker, Global Sales Coordinator, M.Sc., LKV', sv: 'Senior mäklare, global försäljningskoordinator, M.Sc., LKV', en: 'Senior Broker, Global Sales Coordinator, M.Sc., LKV' },
    email: 'heidi@sothebysrealty.fi', phone: '+358 (0)50 421 0905',
    imagePath: '/images/staff/heidi-metsanen.jpg', order: 1, languages: ['fi', 'se', 'gb', 'fr', 'de'],
  },
  {
    name: 'Soile Goodall',
    role: { fi: 'Senior Broker, LKV', sv: 'Senior mäklare, LKV', en: 'Senior Broker, LKV' },
    email: 'soile@sothebysrealty.fi', phone: '+358 (0)40 533 5533',
    imagePath: '/images/staff/soile-goodall.jpg', order: 2, languages: ['fi', 'gb'],
  },
  {
    name: 'Ali Ahola',
    role: { fi: 'Senior Broker, LKV', sv: 'Senior mäklare, LKV', en: 'Senior Broker, LKV' },
    email: 'ali@sothebysrealty.fi', phone: '+358 (0)40 923 2561',
    imagePath: '/images/staff/ali-ahola.jpg', order: 3, languages: ['fi'],
  },
  {
    name: 'Eeva Kyläkoski',
    role: { fi: 'Senior Advisor - Board Member, LKV', sv: 'Senior rådgivare - styrelseledamot, LKV', en: 'Senior Advisor - Board Member, LKV' },
    email: 'eeva@sothebysrealty.fi', phone: '+358 (0)46 850 5850',
    imagePath: '/images/staff/eeva-kylakoski.jpg', order: 4, languages: ['fi', 'se', 'gb'],
  },
  {
    name: 'Linn Johanson',
    role: { fi: 'Sales & Marketing Associate, M.Sc.', sv: 'Försäljnings- och marknadsföringsassistent, M.Sc.', en: 'Sales & Marketing Associate, M.Sc.' },
    email: 'linn@sothebysrealty.fi', phone: '+358 (0)44 055 2342',
    imagePath: '/images/staff/linn-johanson.jpg', order: 5, languages: ['fi', 'se', 'gb'],
  },
  {
    name: 'Robert Charpentier',
    role: { fi: 'Chairman, M.Sc., LKV', sv: 'Ordförande, M.Sc., LKV', en: 'Chairman, M.Sc., LKV' },
    email: 'robert@sothebysrealty.fi', phone: '+358 (0)400 243 011',
    imagePath: '/images/staff/robert-charpentier.jpg', order: 6, languages: ['fi', 'se', 'gb', 'fr'],
  },
  {
    name: 'Petteri Huovila',
    role: { fi: 'Senior Advisor, LKV', sv: 'Senior rådgivare, LKV', en: 'Senior Advisor, LKV' },
    email: 'petteri@sothebysrealty.fi', phone: '+358 (0)400 889 138',
    imagePath: '/images/staff/petteri-huovila.jpg', order: 7, languages: ['fi', 'se', 'gb'],
  },
  {
    name: 'Dennis Forsman',
    role: { fi: 'Sales Assistant, B.Sc.', sv: 'Försäljningsassistent, B.Sc.', en: 'Sales Assistant, B.Sc.' },
    email: 'dennis@sothebysrealty.fi', phone: '+358 (0)44 599 4407',
    imagePath: '/images/staff/dennis-forsman.jpg', order: 8, languages: ['fi', 'se', 'gb'],
  },
  {
    name: 'Sima Shaygan',
    role: { fi: 'Sales Associate, B.Sc., KiLaT', sv: 'Försäljningsassistent, B.Sc., KiLaT', en: 'Sales Associate, B.Sc., KiLaT' },
    email: 'sima@sothebysrealty.fi', phone: '+358 (0)44 239 3979',
    imagePath: '/images/staff/sima-shaygan.jpg', order: 9, languages: ['fi', 'gb', 'ir', 'tr'],
  },
  {
    name: 'Johan Schröder',
    role: { fi: 'Graphic Designer', sv: 'Grafisk formgivare', en: 'Graphic Designer' },
    email: 'johan@sothebysrealty.fi', phone: '+358 (0)50 536 9106',
    imagePath: '/images/staff/johan-schroder.jpg', order: 10, languages: ['fi', 'se', 'gb'],
  },
];

async function uploadImageToSanity(imagePath: string): Promise<any> {
  try {
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    
    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠️  Image not found: ${fullPath}`);
      return null;
    }

    const imageBuffer = fs.readFileSync(fullPath);
    const fileName = path.basename(imagePath);
    
    const asset = await sanityClient.assets.upload('image', imageBuffer, {
      filename: fileName,
    });
    
    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
      alt: `${fileName.replace(/\.(jpg|png|jpeg)$/i, '').replace(/-/g, ' ')}`,
    };
  } catch (error) {
    console.error(`❌ Failed to upload image ${imagePath}:`, error);
    return null;
  }
}

async function migrateStaff() {
  console.log('🚀 Starting staff migration to Sanity...\n');
  
  for (const member of staffMembers) {
    try {
      console.log(`📤 Uploading: ${member.name}...`);
      
      // Upload image first
      const photo = await uploadImageToSanity(member.imagePath);
      
      if (!photo) {
        console.warn(`⚠️  Skipping ${member.name} - no photo`);
        continue;
      }

      // Create staff document
      const doc = {
        _type: 'staff',
        name: member.name,
        slug: {
          _type: 'slug',
          current: member.name.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[åä]/g, 'a')
            .replace(/ö/g, 'o')
            .replace(/[^a-z0-9-]/g, ''),
        },
        role: member.role,
        email: member.email,
        phone: member.phone,
        photo,
        languages: member.languages,
        order: member.order,
        active: true,
      };

      await sanityClient.create(doc);
      console.log(`✅ Migrated: ${member.name}`);
    } catch (error: any) {
      console.error(`❌ Failed to migrate ${member.name}:`, error.message);
    }
  }
  
  console.log('\n🎉 Staff migration complete!');
}

// Run migration
if (require.main === module) {
  migrateStaff().catch(console.error);
}

