export type AdditionalMaterialType = 'video' | 'virtualTour' | 'link';

export interface AdditionalMaterialLink {
  label: string;
  href: string;
  type: AdditionalMaterialType;
}

export interface DocumentLink {
  label: string;
  href: string;
}
