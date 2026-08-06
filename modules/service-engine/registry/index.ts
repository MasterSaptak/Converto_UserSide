import { ServiceConfig, ServiceCategory, ServiceStatus } from '../types';

export class ServiceRegistryCore {
  private services: Map<string, ServiceConfig> = new Map();

  register(service: ServiceConfig) {
    this.services.set(service.id, service);
  }

  get(id: string): ServiceConfig | undefined {
    return this.services.get(id);
  }

  getBySlug(slug: string): ServiceConfig | undefined {
    return Array.from(this.services.values()).find(s => s.slug === slug);
  }

  getByCategory(category: ServiceCategory): ServiceConfig[] {
    return Array.from(this.services.values())
      .filter(s => s.category === category)
      .sort((a, b) => a.order - b.order);
  }

  getActive(): ServiceConfig[] {
    return Array.from(this.services.values())
      .filter(s => s.status === ServiceStatus.ACTIVE)
      .sort((a, b) => a.order - b.order);
  }

  getAll(): ServiceConfig[] {
    return Array.from(this.services.values()).sort((a, b) => a.order - b.order);
  }

  search(query: string): ServiceConfig[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.services.values()).filter(s => {
      const matchTitle = s.title.toLowerCase().includes(lowerQuery);
      const matchDesc = s.shortDescription.toLowerCase().includes(lowerQuery);
      const matchKeywords = s.searchKeywords.some(k => k.toLowerCase().includes(lowerQuery));
      return matchTitle || matchDesc || matchKeywords;
    });
  }

  related(id: string): ServiceConfig[] {
    const service = this.get(id);
    if (!service) return [];
    return this.getByCategory(service.category).filter(s => s.id !== id);
  }
}

export const ServiceRegistry = new ServiceRegistryCore();
