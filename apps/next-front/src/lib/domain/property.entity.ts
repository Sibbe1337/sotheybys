import { Property } from './property.types';

export class PropertyEntity {
  constructor(private readonly data: Property) {}

  get id(): string {
    return this.data.id;
  }

  get slug(): string {
    return this.data.slug;
  }

  hasDebt(): boolean {
    return this.data.pricing.debt > 0;
  }

  hasPlot(): boolean {
    return !!this.data.dimensions.plot && this.data.dimensions.plot > 0;
  }

  hasEnergyClass(): boolean {
    return !!this.data.meta.energyClass;
  }

  hasElevator(): boolean {
    return this.data.meta.elevator === true;
  }

  hasCompanyLoans(): boolean {
    return !!this.data.meta.housingCompany.loans && this.data.meta.housingCompany.loans > 0;
  }

  getData(): Property {
    return this.data;
  }
}

