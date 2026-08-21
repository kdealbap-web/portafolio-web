import {
  EngineeringNote,
  Endpoint,
  EnterpriseRole,
  HeroMetric,
  Layer,
  StackGroup,
  SystemCase,
} from './site.model';

/**
 * Every fact here comes from one of three places: the CV that was sent out, the
 * live sites themselves (captured 21 Aug 2026), or a count taken from the
 * repositories. Figures without a source do not go on the page.
 *
 * Both languages live side by side so they cannot drift apart.
 */

export const HERO_METRICS: HeroMetric[] = [
  {
    value: '5+',
    count: 5,
    suffix: '+',
    label: { en: 'years on enterprise platforms', es: 'años en plataformas empresariales' },
    source: 'CV',
  },
  {
    value: 'v6 → v19',
    label: {
      en: 'Angular majors carried in production',
      es: 'versiones mayores de Angular en producción',
    },
    source: 'CV',
  },
  {
    value: '60+',
    count: 60,
    suffix: '+',
    label: {
      en: 'modules in the platform I work in',
      es: 'módulos en la plataforma donde trabajo',
    },
    source: 'repository count',
  },
  {
    value: '5',
    count: 5,
    label: { en: 'systems of my own, deployed', es: 'sistemas propios, desplegados' },
    source: 'checked on this page',
  },
];

/** The addresses the hero checks, in display order. */
export const ENDPOINTS: Endpoint[] = [
  { host: 'mibiss.com.co', url: 'https://mibiss.com.co' },
  { host: 'kyafinbudget.vercel.app', url: 'https://kyafinbudget.vercel.app' },
  { host: 'weddingkya.kdealbap.com', url: 'https://weddingkya.kdealbap.com' },
  { host: 'clubraideratlantico.com', url: 'https://clubraideratlantico.com' },
  /* The apex 301s to www, so the probe asks for the address a visitor actually
     lands on and reads a 200 rather than a redirect. */
  { host: 'importtoolsas.com', url: 'https://www.importtoolsas.com/' },
];

export const SYSTEMS: SystemCase[] = [
  {
    id: 'biss',
    name: 'BISS',
    kicker: {
      en: 'Civic platform · Soledad, Atlántico',
      es: 'Plataforma cívica · Soledad, Atlántico',
    },
    endpoint: ENDPOINTS[0],
    problem: {
      en: 'What happens in a neighbourhood lives in chat groups: nothing stays written down, and nobody can tell whether a case moved.',
      es: 'Lo que pasa en el barrio vive en grupos de chat: nada queda escrito y nadie sabe si un caso avanzó.',
    },
    solution: {
      en: 'Residents open a case on the map, add testimony, vote and follow what changes. Serverless REST back end, one-time-code email sign-in, object storage and versioned SQL migrations, in a monorepo I deploy myself.',
      es: 'Los vecinos abren un caso sobre el mapa, suman testimonio, votan y siguen qué cambia. Backend REST serverless, ingreso por código de un solo uso al correo, almacenamiento de objetos y migraciones SQL versionadas, en un monorepo que despliego yo.',
    },
    role: {
      en: 'Sole engineer — product, database, deployment and operations.',
      es: 'Único ingeniero: producto, base de datos, despliegue y operación.',
    },
    detail: {
      en: '223 neighbourhoods mapped and 8 open cases on 21 Aug 2026.',
      es: '223 barrios mapeados y 8 casos abiertos al 21 de agosto de 2026.',
    },
    stack: ['TypeScript', 'React 18 + Vite', 'Deno edge functions', 'PostgreSQL', 'Cloudflare R2', 'CI/CD'],
    layout: 'lead',
    plates: [
      {
        base: 'biss',
        width: 1440,
        height: 900,
        alt: {
          en: 'BISS home page: headline, call to action and a row of counters over the case map.',
          es: 'Portada de BISS: titular, llamado a la acción y una fila de contadores sobre el mapa de casos.',
        },
        caption: {
          en: 'Public home — the case map and the live counters.',
          es: 'Portada pública: el mapa de casos y los contadores en vivo.',
        },
        tone: '#17a8ac',
      },
      {
        base: 'biss-casos',
        width: 1440,
        height: 900,
        alt: {
          en: 'BISS case bank: search, filters and cards with photographs of reported street problems.',
          es: 'Banco de casos de BISS: búsqueda, filtros y tarjetas con fotos de problemas reportados en la calle.',
        },
        caption: {
          en: 'Public case bank — 8 cases with photographs, filters and state.',
          es: 'Banco de casos público: 8 casos con fotos, filtros y estado.',
        },
        tone: '#17a8ac',
      },
    ],
  },
  {
    id: 'raider',
    name: 'Club Raider Atlántico + Finanzas360',
    kicker: {
      en: 'Community site + internal finance',
      es: 'Sitio comunitario + finanzas internas',
    },
    endpoint: ENDPOINTS[3],
    problem: {
      en: 'A free-membership club needed a public face for its rides and a private ledger for its money — two audiences, one codebase.',
      es: 'Un club de membresía gratuita necesitaba cara pública para sus rodadas y libro privado para su dinero: dos audiencias, un solo código.',
    },
    solution: {
      en: 'Public site with the ride schedule, rules, gallery and news, plus Finanzas360 behind the pilot portal for dues, expenses and reports.',
      es: 'Sitio público con cronograma de rodadas, reglamento, galería y noticias, más Finanzas360 detrás del portal del piloto para cuotas, gastos e informes.',
    },
    role: {
      en: 'Sole engineer. Own domain and DNS, apex and www.',
      es: 'Único ingeniero. Dominio y DNS propios, apex y www.',
    },
    detail: {
      en: 'Founded 2022, membership free; the finance module is only reachable through the pilot portal.',
      es: 'Fundado en 2022, membresía gratuita; al módulo financiero solo se llega por el portal del piloto.',
    },
    stack: ['TypeScript', 'REST', 'PostgreSQL', 'CI/CD', 'Vercel'],
    layout: 'split',
    plates: [
      {
        base: 'raider',
        width: 1440,
        height: 900,
        alt: {
          en: 'Club Raider home page: large condensed headline over a photograph of a road, with club figures below.',
          es: 'Portada de Club Raider: titular condensado grande sobre una foto de carretera, con cifras del club abajo.',
        },
        caption: {
          en: 'Public home — ride schedule and club figures.',
          es: 'Portada pública: cronograma de rodadas y cifras del club.',
        },
        tone: '#e0262c',
      },
    ],
  },
  {
    id: 'kyafin',
    name: 'K&A Fin',
    kicker: { en: 'Household finance · Angular 21', es: 'Finanzas del hogar · Angular 21' },
    endpoint: ENDPOINTS[1],
    problem: {
      en: 'Income, expenses, debts and scheduled payments spread across apps and spreadsheets, with no shared view for a household.',
      es: 'Ingresos, gastos, deudas y pagos programados repartidos entre apps y hojas de cálculo, sin una vista compartida para el hogar.',
    },
    solution: {
      en: 'One place for all four, with shared portfolios for a couple, typed forms, file attachments and CSV export.',
      es: 'Un solo lugar para los cuatro, con portafolios compartidos en pareja, formularios tipados, adjuntos y exportación a CSV.',
    },
    role: {
      en: 'Sole engineer. This is where I stay current with Angular.',
      es: 'Único ingeniero. Acá es donde me mantengo al día con Angular.',
    },
    detail: {
      en: 'Angular 21 with server-side rendering and unit tests in the build — one major version ahead of the v19 I run at work.',
      es: 'Angular 21 con renderizado en servidor y pruebas unitarias en el build: una versión mayor por delante de la v19 que manejo en el trabajo.',
    },
    stack: ['Angular 21', 'TypeScript', 'SSR', 'SCSS', 'PostgreSQL', 'Vitest'],
    layout: 'panel',
    plates: [
      {
        base: 'kyafin',
        width: 1440,
        height: 900,
        alt: {
          en: 'K&A Fin sign-in screen: brand panel with the product promise beside a sign-in card.',
          es: 'Pantalla de ingreso de K&A Fin: panel de marca con la promesa del producto junto a la tarjeta de acceso.',
        },
        caption: {
          en: 'Sign-in screen — the dashboard sits behind authentication.',
          es: 'Pantalla de ingreso: el tablero está detrás de autenticación.',
        },
        tone: '#2a4ebf',
      },
    ],
  },
  {
    id: 'invitations',
    name: 'Digital invitation manager',
    kicker: {
      en: 'Multi-tenant, built for one event',
      es: 'Multi-inquilino, construido para un evento',
    },
    endpoint: ENDPOINTS[2],
    problem: {
      en: 'A wedding needs a guest list, RSVPs and printable cards. So does every other wedding, with different content.',
      es: 'Una boda necesita lista de invitados, confirmaciones y tarjetas imprimibles. Y la siguiente boda necesita lo mismo con otro contenido.',
    },
    solution: {
      en: 'Guest list, RSVPs and card generation behind an admin panel, with theme and content as configuration.',
      es: 'Lista de invitados, confirmaciones y generación de tarjetas detrás de un panel de administración, con tema y contenido como configuración.',
    },
    role: {
      en: 'Sole engineer, on my own subdomain.',
      es: 'Único ingeniero, en mi propio subdominio.',
    },
    detail: {
      en: 'A second event is a row of configuration, not a fork of the application.',
      es: 'Un segundo evento es una fila de configuración, no un fork de la aplicación.',
    },
    stack: ['TypeScript', 'REST', 'PostgreSQL', 'multi-tenant', 'Cloudflare'],
    layout: 'split',
    mirror: true,
    plates: [
      {
        base: 'boda',
        width: 1440,
        height: 900,
        alt: {
          en: 'Administration sign-in card for the wedding guest panel, dark with a gold button.',
          es: 'Tarjeta de ingreso a la administración del panel de invitados, oscura con botón dorado.',
        },
        caption: {
          en: 'Administration sign-in for the guest panel — the event is 12 Sep 2026.',
          es: 'Ingreso a la administración del panel de invitados: el evento es el 12 de septiembre de 2026.',
        },
        tone: '#c9a567',
      },
    ],
  },
  {
    id: 'importtools',
    name: 'ImportTools',
    kicker: {
      en: 'E-commerce and quoting · built for a client',
      es: 'Comercio electrónico y cotización · construido para un cliente',
    },
    endpoint: ENDPOINTS[4],
    problem: {
      en: 'An industrial tool importer sells from a catalogue that keeps changing, and every sale starts with a quote.',
      es: 'Un importador de herramienta industrial vende desde un catálogo que cambia todo el tiempo, y cada venta empieza con una cotización.',
    },
    solution: {
      en: 'Online store with custom modules, a bespoke theme and a quote generator over the catalogue.',
      es: 'Tienda en línea con módulos propios, tema a la medida y un generador de cotizaciones sobre el catálogo.',
    },
    role: {
      en: 'Sole engineer. I designed the theme, wrote the modules and deployed it; the store is the client’s, the build is mine. Database schema and deployment scripts version-controlled.',
      es: 'Único ingeniero. Diseñé el tema, escribí los módulos y lo desplegué; la tienda es del cliente, la construcción es mía. Esquema de base de datos y scripts de despliegue bajo control de versiones.',
    },
    detail: {
      en: 'Live and public. Category and brand navigation, search with suggestions, and a wholesale counter the storefront itself advertises at 3,000 references.',
      es: 'En línea y pública. Navegación por categorías y marcas, buscador con sugerencias y un mostrador mayorista que la propia tienda anuncia en 3.000 referencias.',
    },
    stack: ['PHP', 'Node.js', 'MySQL', 'custom modules'],
    layout: 'note',
    plates: [
      {
        base: 'importtools',
        width: 1440,
        height: 1250,
        alt: {
          en: 'Import Tools S.A.S home page: dark header with category navigation, a product banner and three promotional panels.',
          es: 'Portada de Import Tools S.A.S: cabecera oscura con navegación por categorías, un banner de producto y tres paneles promocionales.',
        },
        caption: {
          en: 'Home page — the navigation, the trust strip and the promotional set, all on the theme I wrote.',
          es: 'Portada — la navegación, la franja de garantías y el bloque promocional, todo sobre el tema que escribí.',
        },
        tone: '#e0221c',
      },
    ],
  },
];

/**
 * The enterprise section is a map, not a timeline: these are the tiers I work
 * across, top to bottom, and every figure on them is defensible.
 */
export const LAYERS: Layer[] = [
  {
    id: 'ui',
    icon: 'layers',
    label: 'UI',
    tech: 'Angular 6 → 19 · TypeScript · RxJS',
    figure: '60+',
    note: {
      en: 'Modules in a platform shared by several regional companies. Standalone components and the new control flow across 202 files.',
      es: 'Módulos en una plataforma compartida por varias empresas regionales. Componentes standalone y el nuevo control flow en 202 archivos.',
    },
  },
  {
    id: 'api',
    icon: 'server',
    label: 'API',
    tech: 'Spring Boot 3 · REST · HikariCP',
    figure: '57',
    note: {
      en: 'Classes in the due-diligence service alone. One connection pool per company, resolved by tax ID and created on first use.',
      es: 'Clases solo en el servicio de debida diligencia. Un pool de conexiones por empresa, resuelto por NIT y creado en el primer uso.',
    },
  },
  {
    id: 'data',
    icon: 'database',
    label: 'DATA',
    tech: 'Oracle 11g–19c · PL/SQL',
    figure: '13',
    note: {
      en: 'Procedures over 13 tables and 10 views. The risk rules live here, so the screens and the reports cannot disagree.',
      es: 'Procedimientos sobre 13 tablas y 10 vistas. Las reglas de riesgo viven acá, así que las pantallas y los informes no pueden contradecirse.',
    },
  },
  {
    id: 'etl',
    icon: 'flow',
    label: 'ETL',
    tech: 'Oracle · MS SQL · flat files · XML',
    note: {
      en: 'Pipelines into the operational databases. Every migration ships with a rollback and a read-only verification script.',
      es: 'Flujos hacia las bases operativas. Cada migración va con su rollback y un script de verificación de solo lectura.',
    },
  },
  {
    id: 'infra',
    icon: 'rack',
    label: 'INFRA',
    tech: 'VMware vSphere · Veeam · Windows Server',
    note: {
      en: 'The hypervisor and backup underneath all of it, plus ICT forensic audits and information-security schemas against ISO requirements.',
      es: 'El hipervisor y los respaldos debajo de todo, más auditorías forenses TIC y esquemas de seguridad de la información contra requisitos ISO.',
    },
  },
];

export const ENTERPRISE: EnterpriseRole = {
  employer: 'Comercializadora de Servicios del Atlántico — Supergiros Atlántico',
  period: { en: 'Oct 2020 — present', es: 'Oct 2020 — actualidad' },
  title: {
    en: 'Development & Infrastructure Engineer',
    es: 'Ingeniero de Desarrollo e Infraestructura',
  },
  summary: {
    en: 'Most of my work goes into systems that were already running. I own features from the Oracle model to the screen, in a regulated domain where encryption, access logs and retention are part of the design rather than an afterthought.',
    es: 'La mayor parte de mi trabajo va a sistemas que ya estaban corriendo. Me hago cargo de la funcionalidad desde el modelo Oracle hasta la pantalla, en un dominio regulado donde el cifrado, los registros de acceso y la retención son parte del diseño y no un añadido.',
  },
  domains: [
    {
      name: { en: 'Counterparty due diligence — KYC/AML', es: 'Debida diligencia de contrapartes — KYC/AML' },
      body: {
        en: 'Counterparty files, beneficial owners, restrictive-list screening and a state machine for the diligence workflow, with an audit trail Compliance can read. Documents encrypted in the application layer.',
        es: 'Expedientes de contraparte, beneficiarios finales, consulta en listas restrictivas y una máquina de estados para el flujo de diligencia, con una traza auditable que Cumplimiento puede leer. Documentos cifrados en la capa de aplicación.',
      },
    },
    {
      name: { en: 'Shift scheduling and labour compliance', es: 'Programación de turnos y cumplimiento laboral' },
      body: {
        en: 'Leader and employee portals over one roster, with Colombian labour law enforced in code: a 42-hour ordinary week, and Sunday, holiday and night hours counted apart.',
        es: 'Portales de líder y de empleado sobre una misma malla, con la ley laboral colombiana aplicada en código: semana ordinaria de 42 horas, y domingos, festivos y horas nocturnas contados aparte.',
      },
    },
    {
      name: { en: 'Inventory and warehouse kardex', es: 'Inventario y kardex de bodega' },
      body: {
        en: 'Warehouses, transfers with recipient acceptance and automatic movement generation, multi-tenant by database connection, with the Excel and PDF reporting audit staff use directly.',
        es: 'Bodegas, traslados con aceptación del receptor y generación automática de movimientos, multi-inquilino por conexión de base de datos, con los informes en Excel y PDF que usa directamente el personal de auditoría.',
      },
    },
    {
      name: { en: 'Angular modernization', es: 'Modernización de Angular' },
      body: {
        en: 'Six major versions carried in production, dependencies upgraded, deprecated APIs replaced and legacy modules refactored — each migration covered by tests written beforehand.',
        es: 'Seis versiones mayores llevadas en producción, dependencias actualizadas, APIs obsoletas reemplazadas y módulos heredados refactorizados: cada migración cubierta por pruebas escritas antes.',
      },
    },
    {
      name: { en: 'ETL and data movement', es: 'ETL y movimiento de datos' },
      body: {
        en: 'Pipelines over Oracle, MS SQL, flat files and XML, with versioned migrations, tuned queries and stored procedures.',
        es: 'Flujos sobre Oracle, MS SQL, archivos planos y XML, con migraciones versionadas, consultas optimizadas y procedimientos almacenados.',
      },
    },
    {
      name: { en: 'Infrastructure and security', es: 'Infraestructura y seguridad' },
      body: {
        en: 'VMware vSphere with Veeam Backup & Replication, SonarQube and ESLint in the workflow with the existing backlog cleared, and information-security schemas against ISO and regulatory requirements.',
        es: 'VMware vSphere con Veeam Backup & Replication, SonarQube y ESLint en el flujo de trabajo con el backlog existente saneado, y esquemas de seguridad de la información contra requisitos ISO y regulatorios.',
      },
    },
  ],
};

export const NOTES: EngineeringNote[] = [
  {
    id: 'pool',
    label: { en: 'One pool per tenant', es: 'Un pool por inquilino' },
    body: {
      en: 'HikariCP per company, resolved by tax ID, created on first use. The pattern before it opened an Oracle connection per request and paid roughly 20 s of setup. The pool stays inside a component: publishing a DataSource bean would have switched off autoconfiguration for three other modules in the same service.',
      es: 'HikariCP por empresa, resuelto por NIT y creado en el primer uso. El patrón anterior abría una conexión Oracle por petición y pagaba unos 20 s de arranque. El pool vive dentro de un componente: publicar un bean DataSource habría apagado la autoconfiguración de los otros tres módulos del mismo servicio.',
    },
  },
  {
    id: 'rules',
    label: { en: 'Rules in the package', es: 'Las reglas, en el paquete' },
    body: {
      en: 'Risk logic lives in PL/SQL, not in the service. The screens and the reports call the same procedures, so they cannot disagree about a number.',
      es: 'La lógica de riesgo vive en PL/SQL, no en el servicio. Las pantallas y los informes llaman los mismos procedimientos, así que no pueden discrepar en una cifra.',
    },
  },
  {
    id: 'crypto',
    label: { en: 'Encryption in Java, not the database', es: 'Cifrado en Java, no en la base' },
    body: {
      en: 'AES-256-GCM, one initialization vector per file, a SHA-256 integrity hash, the key held outside the database with a version so it can be rotated. The database had neither transparent encryption nor DBMS_CRYPTO privileges.',
      es: 'AES-256-GCM, un vector de inicialización por archivo, hash de integridad SHA-256, la llave fuera de la base y con versión para poder rotarla. La base no tenía cifrado transparente ni privilegios de DBMS_CRYPTO.',
    },
  },
  {
    id: 'nls',
    label: { en: 'NLS_DATE_FORMAT is set by the JVM locale', es: 'El NLS_DATE_FORMAT lo fija el locale de la JVM' },
    body: {
      en: 'Identical code parsed dates correctly on one machine and threw on another. It had been filed as an intermittent bug.',
      es: 'El mismo código parseaba fechas bien en una máquina y fallaba en otra. Estaba reportado como error intermitente.',
    },
  },
  {
    id: 'ojdbc',
    label: { en: 'Two ojdbc drivers, no orai18n', es: 'Dos drivers ojdbc, sin orai18n' },
    body: {
      en: 'Accented characters corrupted on read. Also filed as intermittent, and also a difference between machines rather than in the code.',
      es: 'Las tildes se corrompían al leer. También reportado como intermitente, y también una diferencia entre máquinas y no en el código.',
    },
  },
  {
    id: 'standalone',
    label: { en: 'Standalone migration, tests first', es: 'Migración standalone, pruebas primero' },
    body: {
      en: '202 files moved to standalone components and the new control flow. The Jasmine and Karma tests written beforehand are what made changing shared code safe.',
      es: '202 archivos pasados a componentes standalone y al nuevo control flow. Las pruebas de Jasmine y Karma escritas antes son las que hicieron seguro tocar código compartido.',
    },
  },
  {
    id: 'rollback',
    label: { en: 'Migrations carry their own rollback', es: 'Cada migración trae su rollback' },
    body: {
      en: 'Each versioned migration ships with a rollback and a read-only verification script, run through a small JDBC launcher.',
      es: 'Cada migración versionada va con su rollback y un script de verificación de solo lectura, ejecutados con un pequeño lanzador JDBC.',
    },
  },
];

export const STACK_GROUPS: StackGroup[] = [
  {
    icon: 'server',
    label: { en: 'Backend', es: 'Backend' },
    items: ['Java 17', 'Spring Boot 3', 'Hibernate', 'MyBatis', 'HikariCP', 'REST APIs'],
  },
  {
    icon: 'layers',
    label: { en: 'Frontend', es: 'Frontend' },
    items: ['Angular 6–19', 'TypeScript', 'RxJS', 'SCSS', 'Angular SSR', 'Material'],
  },
  {
    icon: 'database',
    label: { en: 'Data', es: 'Datos' },
    items: ['Oracle 11g–19c', 'PL/SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'ETL'],
  },
  {
    icon: 'rack',
    label: { en: 'Platform', es: 'Plataforma' },
    items: ['VMware vSphere', 'Veeam', 'Docker', 'Cloudflare', 'Vercel', 'GitLab CI'],
  },
];

export const CONTACT = {
  name: 'Kevin De Alba',
  email: 'kdjdealba@gmail.com',
  github: { label: 'kdealbap-web', url: 'https://github.com/kdealbap-web' },
  linkedin: { label: 'kevindealbap', url: 'https://www.linkedin.com/in/kevindealbap' },
  english: { en: 'B2 — professional working', es: 'B2 — profesional' },
  city: { en: 'Barranquilla, Colombia', es: 'Barranquilla, Colombia' },
  degree: {
    en: 'B.Sc. Systems Engineering, Universidad de la Costa',
    es: 'Ingeniero de Sistemas, Universidad de la Costa',
  },
  cv: '/kevin-de-alba-cv.pdf',
};
