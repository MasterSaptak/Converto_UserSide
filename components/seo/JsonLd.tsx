/**
 * Reusable JSON-LD Structured Data component.
 * Renders a <script type="application/ld+json"> tag for rich search results.
 */

interface OrganizationSchema {
  type: 'Organization';
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
}

interface WebSiteSchema {
  type: 'WebSite';
  name: string;
  url: string;
  description?: string;
}

interface ServiceSchema {
  type: 'Service';
  name: string;
  description: string;
  provider: { name: string; url: string };
  areaServed?: string;
  serviceType?: string;
}

interface FAQSchema {
  type: 'FAQPage';
  questions: { question: string; answer: string }[];
}

interface BreadcrumbSchema {
  type: 'BreadcrumbList';
  items: { name: string; url: string }[];
}

interface WebPageSchema {
  type: 'WebPage';
  name: string;
  description: string;
  url: string;
}

type SchemaData =
  | OrganizationSchema
  | WebSiteSchema
  | ServiceSchema
  | FAQSchema
  | BreadcrumbSchema
  | WebPageSchema;

function buildSchema(data: SchemaData): Record<string, unknown> {
  switch (data.type) {
    case 'Organization':
      return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: data.name,
        url: data.url,
        ...(data.logo && { logo: data.logo }),
        ...(data.description && { description: data.description }),
        ...(data.sameAs && { sameAs: data.sameAs }),
      };

    case 'WebSite':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: data.name,
        url: data.url,
        ...(data.description && { description: data.description }),
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${data.url}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      };

    case 'Service':
      return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: data.name,
        description: data.description,
        provider: {
          '@type': 'Organization',
          name: data.provider.name,
          url: data.provider.url,
        },
        ...(data.areaServed && { areaServed: data.areaServed }),
        ...(data.serviceType && { serviceType: data.serviceType }),
      };

    case 'FAQPage':
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: data.questions.map((q) => ({
          '@type': 'Question',
          name: q.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: q.answer,
          },
        })),
      };

    case 'BreadcrumbList':
      return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: data.items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      };

    case 'WebPage':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: data.name,
        description: data.description,
        url: data.url,
      };
  }
}

interface JsonLdProps {
  data: SchemaData | SchemaData[];
}

export function JsonLd({ data }: JsonLdProps) {
  const schemas = Array.isArray(data) ? data : [data];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSchema(schema)) }}
        />
      ))}
    </>
  );
}
