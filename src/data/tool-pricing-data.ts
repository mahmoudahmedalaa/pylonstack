/* ───────────────────────────────────────────────
   Pylon — Comprehensive Pricing Data
   All 235 tools with verified pricing tiers.
   Billing standard: MONTHLY (not annual)
   Last full audit: 2026-04-01
   ─────────────────────────────────────────────── */

import type { ToolPricing } from './tools-catalog';

/** Helper for free/open-source tools */
const FREE_OSS = (url?: string): ToolPricing => ({
  model: 'open_source',
  hasFreeTier: true,
  isOpenSource: true,
  tiers: [{ name: 'Free', price: 0, period: null, limits: 'Open source — free forever' }],
  lastVerified: '2026-03-31',
  ...(url && { pricingUrl: url }),
});

const FREE_TOOL = (url?: string): ToolPricing => ({
  model: 'free',
  hasFreeTier: true,
  tiers: [{ name: 'Free', price: 0, period: null, limits: 'Free to use' }],
  lastVerified: '2026-03-31',
  ...(url && { pricingUrl: url }),
});

export const TOOL_PRICING_MAP: Record<string, ToolPricing> = {
  // ═══════════════════════════════════════════════
  // FRONTEND — All Free / Open Source
  // ═══════════════════════════════════════════════
  react: FREE_OSS('https://react.dev'),
  nextjs: FREE_OSS('https://nextjs.org'),
  vue: FREE_OSS('https://vuejs.org'),
  nuxt: FREE_OSS('https://nuxt.com'),
  svelte: FREE_OSS('https://svelte.dev'),
  sveltekit: FREE_OSS('https://kit.svelte.dev'),
  angular: FREE_OSS('https://angular.dev'),
  solid: FREE_OSS('https://www.solidjs.com'),
  qwik: FREE_OSS('https://qwik.dev'),
  astro: FREE_OSS('https://astro.build'),
  remix: FREE_OSS('https://remix.run'),
  gatsby: FREE_OSS('https://www.gatsbyjs.com'),
  preact: FREE_OSS('https://preactjs.com'),
  htmx: FREE_OSS('https://htmx.org'),
  alpine: FREE_OSS('https://alpinejs.dev'),
  lit: FREE_OSS('https://lit.dev'),
  tailwindcss: FREE_OSS('https://tailwindcss.com'),
  'chakra-ui': FREE_OSS('https://chakra-ui.com'),
  shadcn: FREE_OSS('https://ui.shadcn.com'),
  'material-ui': FREE_OSS('https://mui.com'),
  'ant-design': FREE_OSS('https://ant.design'),
  radix: FREE_OSS('https://www.radix-ui.com'),
  mantine: FREE_OSS('https://mantine.dev'),
  bootstrap: FREE_OSS('https://getbootstrap.com'),
  bulma: FREE_OSS('https://bulma.io'),
  sass: FREE_OSS('https://sass-lang.com'),
  emotion: FREE_OSS('https://emotion.sh'),
  'styled-components': FREE_OSS('https://styled-components.com'),
  'framer-motion': FREE_OSS('https://www.framer.com/motion/'),
  'three-js': FREE_OSS('https://threejs.org'),
  d3: FREE_OSS('https://d3js.org'),
  recharts: FREE_OSS('https://recharts.org'),
  storybook: FREE_OSS('https://storybook.js.org'),
  redux: FREE_OSS('https://redux.js.org'),
  zustand: FREE_OSS('https://zustand-demo.pmnd.rs'),
  jotai: FREE_OSS('https://jotai.org'),
  'tanstack-query': FREE_OSS('https://tanstack.com/query'),
  pinia: FREE_OSS('https://pinia.vuejs.org'),
  vuetify: FREE_OSS('https://vuetifyjs.com'),

  // ═══════════════════════════════════════════════
  // BACKEND — All Free / Open Source
  // ═══════════════════════════════════════════════
  nodejs: FREE_OSS('https://nodejs.org'),
  deno: FREE_OSS('https://deno.com'),
  bun: FREE_OSS('https://bun.sh'),
  express: FREE_OSS('https://expressjs.com'),
  fastify: FREE_OSS('https://fastify.dev'),
  nestjs: FREE_OSS('https://nestjs.com'),
  hono: FREE_OSS('https://hono.dev'),
  koa: FREE_OSS('https://koajs.com'),
  django: FREE_OSS('https://www.djangoproject.com'),
  flask: FREE_OSS('https://flask.palletsprojects.com'),
  fastapi: FREE_OSS('https://fastapi.tiangolo.com'),
  laravel: FREE_OSS('https://laravel.com'),
  rails: FREE_OSS('https://rubyonrails.org'),
  'spring-boot': FREE_OSS('https://spring.io/projects/spring-boot'),
  go: FREE_OSS('https://go.dev'),
  gin: FREE_OSS('https://gin-gonic.com'),
  rust: FREE_OSS('https://www.rust-lang.org'),
  actix: FREE_OSS('https://actix.rs'),
  'elixir-phoenix': FREE_OSS('https://www.phoenixframework.org'),
  dotnet: FREE_OSS('https://dotnet.microsoft.com'),
  graphql: FREE_OSS('https://graphql.org'),
  grpc: FREE_OSS('https://grpc.io'),
  trpc: FREE_OSS('https://trpc.io'),

  // ═══════════════════════════════════════════════
  // TESTING — All Free / Open Source
  // ═══════════════════════════════════════════════
  jest: FREE_OSS('https://jestjs.io'),
  vitest: FREE_OSS('https://vitest.dev'),
  playwright: FREE_OSS('https://playwright.dev'),
  cypress: FREE_OSS('https://www.cypress.io'),
  'testing-library': FREE_OSS('https://testing-library.com'),
  mocha: FREE_OSS('https://mochajs.org'),
  selenium: FREE_OSS('https://www.selenium.dev'),
  pytest: FREE_OSS('https://docs.pytest.org'),
  k6: FREE_OSS('https://k6.io'),
  'storybook-test': FREE_OSS('https://storybook.js.org'),

  // ═══════════════════════════════════════════════
  // ORM / DATA LAYER — All Free / Open Source
  // ═══════════════════════════════════════════════
  prisma: FREE_OSS('https://www.prisma.io'),
  drizzle: FREE_OSS('https://orm.drizzle.team'),
  typeorm: FREE_OSS('https://typeorm.io'),
  sequelize: FREE_OSS('https://sequelize.org'),
  mongoose: FREE_OSS('https://mongoosejs.com'),
  knex: FREE_OSS('https://knexjs.org'),
  kysely: FREE_OSS('https://kysely.dev'),
  objection: FREE_OSS('https://vincit.github.io/objection.js/'),
  sqlalchemy: FREE_OSS('https://www.sqlalchemy.org'),

  // ═══════════════════════════════════════════════
  // DEVTOOLS — Mixed
  // ═══════════════════════════════════════════════
  typescript: FREE_OSS('https://www.typescriptlang.org'),
  vite: FREE_OSS('https://vitejs.dev'),
  webpack: FREE_OSS('https://webpack.js.org'),
  esbuild: FREE_OSS('https://esbuild.github.io'),
  swc: FREE_OSS('https://swc.rs'),
  eslint: FREE_OSS('https://eslint.org'),
  prettier: FREE_OSS('https://prettier.io'),
  biome: FREE_OSS('https://biomejs.dev'),
  docker: FREE_OSS('https://www.docker.com'),
  kubernetes: FREE_OSS('https://kubernetes.io'),
  terraform: FREE_OSS('https://www.terraform.io'),
  pulumi: FREE_OSS('https://www.pulumi.com'),
  git: FREE_OSS('https://git-scm.com'),
  turborepo: FREE_OSS('https://turbo.build'),
  nx: FREE_OSS('https://nx.dev'),
  zod: FREE_OSS('https://zod.dev'),
  postman: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://www.postman.com/pricing/',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: 'Single user only, basic API client' },
      { name: 'Solo', price: 9, period: 'month', limits: '400 AI credits, data-driven testing' },
      {
        name: 'Team',
        price: 19,
        period: 'month',
        pricingModel: 'Per-Seat',
        limits: 'Collaboration, shared workspaces',
      },
      {
        name: 'Enterprise',
        price: 49,
        period: 'month',
        pricingModel: 'Per-Seat',
        limits: 'API Catalog, advanced security',
      },
    ],
  },
  insomnia: FREE_OSS('https://insomnia.rest'),
  vscode: FREE_TOOL('https://code.visualstudio.com'),
  figma: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-04-01',
    pricingUrl: 'https://www.figma.com/pricing/',
    tiers: [
      {
        name: 'Starter',
        price: 0,
        period: 'month',
        limits: '3 design files, 30-day version history',
      },
      {
        name: 'Professional',
        price: 20,
        period: 'month',
        pricingModel: 'Per-Seat',
        limits: 'Unlimited files, team libraries, 3K AI credits',
      },
      {
        name: 'Organization',
        price: 55,
        period: 'month',
        pricingModel: 'Per-Seat',
        limits: 'Design systems, centralized admin (annual only)',
      },
      {
        name: 'Enterprise',
        price: 90,
        period: 'month',
        pricingModel: 'Per-Seat',
        limits: 'SSO, SCIM, dedicated support (annual only)',
      },
    ],
  },
  doppler: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://www.doppler.com/pricing',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '5 team members, unlimited projects' },
      {
        name: 'Team',
        price: 7,
        period: 'month',
        pricingModel: 'Per-Seat',
        limits: 'Unlimited members, audit logs',
      },
      { name: 'Enterprise', price: null, period: null },
    ],
  },

  // ═══════════════════════════════════════════════
  // DATABASE — Mixed pricing
  // ═══════════════════════════════════════════════
  supabase: {
    model: 'freemium',
    hasFreeTier: true,
    isOpenSource: true,
    estimatedImplementationTimeDays: 3,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://supabase.com/pricing',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '500 MB DB, 1 GB storage, 50K MAU' },
      { name: 'Pro', price: 25, period: 'month', limits: '8 GB DB, 100 GB storage, 100K MAU' },
      { name: 'Team', price: 599, period: 'month', limits: 'SOC2, priority support' },
      { name: 'Enterprise', price: null, period: null, limits: 'Custom SLA, dedicated support' },
    ],
  },
  'firebase-db': {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://firebase.google.com/pricing',
    tiers: [
      { name: 'Spark (Free)', price: 0, period: 'month', limits: '1 GB storage, 50K reads/day' },
      {
        name: 'Blaze (Pay-as-you-go)',
        price: 0,
        period: 'month',
        pricingModel: 'Usage-Based',
        limits: 'Usage-based after free quota',
      },
    ],
  },
  planetscale: {
    model: 'paid',
    hasFreeTier: false,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://planetscale.com/pricing',
    tiers: [
      { name: 'PS-10', price: 39, period: 'month', limits: '10 GB storage, 1 production branch' },
      { name: 'PS-20', price: 79, period: 'month', limits: '25 GB storage, horizontal sharding' },
      { name: 'PS-40', price: 159, period: 'month', limits: '50 GB storage, multi-region' },
      { name: 'Enterprise', price: null, period: null, limits: 'Custom SLA, dedicated support' },
    ],
  },
  neon: {
    model: 'freemium',
    hasFreeTier: true,
    isOpenSource: true,
    lastVerified: '2026-04-01',
    pricingUrl: 'https://neon.tech/pricing',
    tiers: [
      {
        name: 'Free',
        price: 0,
        period: 'month',
        limits: '0.5 GiB storage, 100 projects, 100 CU-hrs/mo',
      },
      {
        name: 'Launch',
        price: 0,
        period: 'month',
        pricingModel: 'Usage-Based',
        limits: '$0.106/CU-hr, $0.35/GB-mo, no minimum — typical ~$15/mo',
      },
      {
        name: 'Scale',
        price: 0,
        period: 'month',
        pricingModel: 'Usage-Based',
        limits: '$0.222/CU-hr, $0.35/GB-mo, no minimum — typical ~$70/mo',
      },
      { name: 'Enterprise', price: null, period: null },
    ],
  },
  'mongodb-atlas': {
    model: 'freemium',
    hasFreeTier: true,
    isOpenSource: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://www.mongodb.com/pricing',
    tiers: [
      { name: 'Free (M0)', price: 0, period: 'month', limits: '512 MB storage, shared cluster' },
      {
        name: 'Serverless',
        price: 0,
        period: 'month',
        pricingModel: 'Usage-Based',
        limits: 'Pay-per-operation',
      },
      { name: 'Dedicated (M10)', price: 57, period: 'month', limits: '10 GB, dedicated cluster' },
    ],
  },
  upstash: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://upstash.com/pricing',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '10K commands/day, 256 MB' },
      {
        name: 'Pay-as-you-go',
        price: 0,
        period: 'month',
        pricingModel: 'Usage-Based',
        limits: '$0.2/100K commands',
      },
      { name: 'Pro 2K', price: 280, period: 'month', limits: 'Dedicated, multi-zone' },
    ],
  },
  postgresql: FREE_OSS('https://www.postgresql.org'),
  mysql: FREE_OSS('https://www.mysql.com'),
  mariadb: FREE_OSS('https://mariadb.org'),
  sqlite: FREE_OSS('https://www.sqlite.org'),
  mongodb: FREE_OSS('https://www.mongodb.com'),
  redis: FREE_OSS('https://redis.io'),
  cassandra: FREE_OSS('https://cassandra.apache.org'),
  neo4j: {
    model: 'freemium',
    hasFreeTier: true,
    isOpenSource: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://neo4j.com/pricing/',
    tiers: [
      { name: 'Community', price: 0, period: null, limits: 'Self-hosted, single database' },
      { name: 'AuraDB Free', price: 0, period: 'month', limits: '200K nodes, 400K rels' },
      { name: 'AuraDB Pro', price: 65, period: 'month', limits: 'Managed, autoscaling' },
      { name: 'Enterprise', price: null, period: null },
    ],
  },
  cockroachdb: {
    model: 'freemium',
    hasFreeTier: true,
    isOpenSource: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://www.cockroachlabs.com/pricing/',
    tiers: [
      { name: 'Basic', price: 0, period: 'month', limits: '10 GiB storage, 50M RUs free' },
      {
        name: 'Standard',
        price: 0,
        period: 'month',
        pricingModel: 'Usage-Based',
        limits: 'Pay-per-usage after free tier',
      },
      { name: 'Enterprise', price: null, period: null },
    ],
  },
  clickhouse: {
    model: 'freemium',
    hasFreeTier: true,
    isOpenSource: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://clickhouse.com/pricing',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '10 GB storage, shared infra' },
      {
        name: 'Scale',
        price: 0,
        period: 'month',
        pricingModel: 'Usage-Based',
        limits: 'Pay-per-compute + storage',
      },
      { name: 'Enterprise', price: null, period: null },
    ],
  },
  influxdb: {
    model: 'freemium',
    hasFreeTier: true,
    isOpenSource: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://www.influxdata.com/influxdb-pricing/',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '30-day retention, 5 dashboards' },
      {
        name: 'Usage-Based',
        price: 0,
        period: 'month',
        pricingModel: 'Usage-Based',
        limits: 'Pay-per-write/query/storage',
      },
      { name: 'Dedicated', price: null, period: null },
    ],
  },
  dynamodb: {
    model: 'paid',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://aws.amazon.com/dynamodb/pricing/',
    tiers: [
      { name: 'Free Tier', price: 0, period: 'month', limits: '25 GB, 25 WCU, 25 RCU' },
      {
        name: 'On-Demand',
        price: 0,
        period: 'month',
        pricingModel: 'Usage-Based',
        limits: '$1.25/M write, $0.25/M read',
      },
    ],
  },
  dragonfly: FREE_OSS('https://www.dragonflydb.io'),
  turso: {
    model: 'freemium',
    hasFreeTier: true,
    isOpenSource: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://turso.tech/pricing',
    tiers: [
      { name: 'Starter', price: 0, period: 'month', limits: '9 GB storage, 500 DBs, 25 locations' },
      { name: 'Scaler', price: 29, period: 'month', limits: '24 GB, unlimited DBs' },
      { name: 'Enterprise', price: null, period: null },
    ],
  },

  // ═══════════════════════════════════════════════
  // AUTH
  // ═══════════════════════════════════════════════
  clerk: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://clerk.com/pricing',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '50K MRU (monthly retained users)' },
      { name: 'Pro', price: 25, period: 'month', limits: 'Unlimited MAU, custom domains, SSO' },
      { name: 'Enterprise', price: null, period: null, limits: 'Custom SLA, compliance, support' },
    ],
  },
  auth0: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://auth0.com/pricing',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '25K MAU, social login' },
      { name: 'Essential', price: 35, period: 'month', limits: 'Custom domains, MFA' },
      { name: 'Professional', price: 240, period: 'month', limits: 'Advanced MFA, organizations' },
      { name: 'Enterprise', price: null, period: null },
    ],
  },
  'firebase-auth': {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://firebase.google.com/pricing',
    tiers: [
      {
        name: 'Spark (Free)',
        price: 0,
        period: 'month',
        limits: '50K MAU (email/social), 3K phone/mo',
      },
      {
        name: 'Blaze',
        price: 0,
        period: 'month',
        pricingModel: 'Usage-Based',
        limits: '$0.0055/MAU over 50K; $0.01/phone verify',
      },
    ],
  },
  'supabase-auth': {
    model: 'freemium',
    hasFreeTier: true,
    isOpenSource: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://supabase.com/pricing',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '50K MAU, social login, email' },
      { name: 'Pro', price: 25, period: 'month', limits: '100K MAU, SSO (SAML 2.0)' },
      { name: 'Enterprise', price: null, period: null },
    ],
  },
  nextauth: FREE_OSS('https://next-auth.js.org'),
  keycloak: FREE_OSS('https://www.keycloak.org'),
  lucia: FREE_OSS('https://lucia-auth.com'),
  descope: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://www.descope.com/pricing',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '7.5K MAU, passwordless' },
      {
        name: 'Essentials',
        price: 0.05,
        period: 'month',
        pricingModel: 'Usage-Based',
        limits: '$0.05/MAU over free tier',
      },
      { name: 'Enterprise', price: null, period: null },
    ],
  },
  stytch: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://stytch.com/pricing',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '25K MAU, email magic links' },
      { name: 'Pro', price: 249, period: 'month', limits: '10K MAU, custom branding' },
      { name: 'Enterprise', price: null, period: null },
    ],
  },
  okta: {
    model: 'paid',
    hasFreeTier: false,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://www.okta.com/pricing/',
    tiers: [
      {
        name: 'Workforce Identity',
        price: 2,
        period: 'month',
        pricingModel: 'Per-Seat',
        limits: 'SSO per user',
      },
      { name: 'Customer Identity', price: null, period: null, limits: 'Contact sales' },
    ],
  },
  workos: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://workos.com/pricing',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '1M MAU, AuthKit' },
      { name: 'Pro', price: 49, period: 'month', limits: 'Admin portal, SCIM, roles' },
      { name: 'Enterprise', price: null, period: null },
    ],
  },

  // ═══════════════════════════════════════════════
  // HOSTING
  // ═══════════════════════════════════════════════
  vercel: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://vercel.com/pricing',
    tiers: [
      { name: 'Hobby', price: 0, period: 'month', limits: 'Personal projects, 100 GB bandwidth' },
      { name: 'Pro', price: 20, period: 'month', limits: 'Team features, 1 TB bandwidth' },
      { name: 'Enterprise', price: null, period: null, limits: 'SLA, advanced security' },
    ],
  },
  netlify: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://www.netlify.com/pricing/',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '300 credits/mo, 100 GB bandwidth' },
      {
        name: 'Personal',
        price: 9,
        period: 'month',
        limits: '1,000 credits/mo, priority email support',
      },
      {
        name: 'Pro',
        price: 20,
        period: 'month',
        pricingModel: 'Per-Seat',
        limits: '3,000 credits/mo, 3+ concurrent builds',
      },
      {
        name: 'Enterprise',
        price: null,
        period: null,
        limits: 'Custom SLA, SSO, dedicated support',
      },
    ],
  },
  railway: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://railway.app/pricing',
    tiers: [
      { name: 'Trial', price: 0, period: 'month', limits: '$5 free credit, 500 hrs' },
      { name: 'Hobby', price: 5, period: 'month', limits: '$5/mo + usage' },
      { name: 'Pro', price: 20, period: 'month', limits: 'Team features, priority support' },
    ],
  },
  render: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://render.com/pricing',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: 'Static sites, limited hours' },
      { name: 'Individual', price: 7, period: 'month', limits: 'Web services, background workers' },
      { name: 'Team', price: 19, period: 'month', limits: 'Preview environments, team roles' },
      { name: 'Enterprise', price: null, period: null },
    ],
  },
  heroku: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://www.heroku.com/pricing',
    tiers: [
      { name: 'Eco', price: 5, period: 'month', limits: '1000 dyno/hrs, sleep after 30m' },
      { name: 'Basic', price: 7, period: 'month', limits: 'Never sleeps, 512 MB RAM' },
      { name: 'Standard', price: 25, period: 'month', limits: 'Horizontal scaling, metrics' },
      { name: 'Performance', price: 250, period: 'month', limits: '14 GB RAM, autoscaling' },
    ],
  },
  digitalocean: {
    model: 'paid',
    hasFreeTier: false,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://www.digitalocean.com/pricing',
    tiers: [
      { name: 'Basic Droplet', price: 4, period: 'month', limits: '512 MB / 1 vCPU / 10 GB SSD' },
      { name: 'Regular Droplet', price: 12, period: 'month', limits: '2 GB / 1 vCPU / 50 GB SSD' },
      { name: 'App Platform', price: 5, period: 'month', limits: 'Managed PaaS per container' },
    ],
  },
  cloudflare: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://www.cloudflare.com/plans/',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: 'CDN, DDoS, SSL, Workers (100K/day)' },
      { name: 'Pro', price: 20, period: 'month', limits: 'WAF, image optimization' },
      { name: 'Business', price: 200, period: 'month', limits: 'Custom WAF, SLA' },
      { name: 'Enterprise', price: null, period: null },
    ],
  },
  'fly-io': {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://fly.io/pricing/',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '3 shared VMs, 3 GB persistent' },
      {
        name: 'Launch',
        price: 0,
        period: 'month',
        pricingModel: 'Usage-Based',
        limits: 'Pay-as-you-go from $1.94/mo',
      },
      {
        name: 'Scale',
        price: 0,
        period: 'month',
        pricingModel: 'Usage-Based',
        limits: 'Reserved pricing, priority support',
      },
    ],
  },
  coolify: FREE_OSS('https://coolify.io'),
  hetzner: {
    model: 'paid',
    hasFreeTier: false,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://www.hetzner.com/cloud/',
    tiers: [
      { name: 'CX22', price: 4.35, period: 'month', limits: '2 vCPU, 4 GB RAM, 40 GB SSD' },
      { name: 'CX32', price: 7.59, period: 'month', limits: '4 vCPU, 8 GB RAM, 80 GB SSD' },
      { name: 'CX42', price: 14.49, period: 'month', limits: '8 vCPU, 16 GB RAM, 160 GB SSD' },
    ],
  },
  'cloudflare-workers': {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://developers.cloudflare.com/workers/platform/pricing/',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '100K requests/day, 10ms CPU' },
      {
        name: 'Paid',
        price: 5,
        period: 'month',
        pricingModel: 'Usage-Based',
        limits: '10M requests incl, $0.30/M after',
      },
    ],
  },
  'aws-lambda': {
    model: 'paid',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://aws.amazon.com/lambda/pricing/',
    tiers: [
      { name: 'Free Tier', price: 0, period: 'month', limits: '1M requests, 400K GB-sec/mo' },
      {
        name: 'Pay-per-use',
        price: 0,
        period: 'month',
        pricingModel: 'Usage-Based',
        limits: '$0.20/1M requests + $0.0000166667/GB-sec',
      },
    ],
  },
  aws: {
    model: 'paid',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://aws.amazon.com/pricing/',
    tiers: [
      {
        name: 'Free Tier',
        price: 0,
        period: 'month',
        limits: '12 months free tier, 750 hrs EC2 t2.micro',
      },
      {
        name: 'Pay-as-you-go',
        price: 0,
        period: 'month',
        pricingModel: 'Usage-Based',
        limits: 'Varies by service',
      },
    ],
  },
  gcp: {
    model: 'paid',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://cloud.google.com/pricing',
    tiers: [
      {
        name: 'Free Tier',
        price: 0,
        period: 'month',
        limits: '$300 credit for 90 days, always-free products',
      },
      {
        name: 'Pay-as-you-go',
        price: 0,
        period: 'month',
        pricingModel: 'Usage-Based',
        limits: 'Varies by service',
      },
    ],
  },
  azure: {
    model: 'paid',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://azure.microsoft.com/en-us/pricing/',
    tiers: [
      {
        name: 'Free Account',
        price: 0,
        period: 'month',
        limits: '$200 credit for 30 days, 55+ always-free services',
      },
      {
        name: 'Pay-as-you-go',
        price: 0,
        period: 'month',
        pricingModel: 'Usage-Based',
        limits: 'Varies by service',
      },
    ],
  },

  // ═══════════════════════════════════════════════
  // MONITORING
  // ═══════════════════════════════════════════════
  sentry: {
    model: 'freemium',
    hasFreeTier: true,
    isOpenSource: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://sentry.io/pricing/',
    tiers: [
      { name: 'Developer', price: 0, period: 'month', limits: '5K errors, 10K perf units, 1 user' },
      {
        name: 'Team',
        price: 26,
        period: 'month',
        limits: '50K errors, unlimited users, 90-day retention',
      },
      {
        name: 'Business',
        price: null,
        period: null,
        limits: 'Custom pricing, SSO, advanced analytics',
      },
    ],
  },
  datadog: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://www.datadoghq.com/pricing/',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '5 hosts, 1 day retention' },
      {
        name: 'Pro',
        price: 15,
        period: 'month',
        pricingModel: 'Per-Seat',
        limits: 'Per host, 15 month retention',
      },
      {
        name: 'Enterprise',
        price: 23,
        period: 'month',
        pricingModel: 'Per-Seat',
        limits: 'Per host, custom retention',
      },
    ],
  },
  'new-relic': {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://newrelic.com/pricing',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '100 GB/mo ingest, 1 full user' },
      {
        name: 'Standard',
        price: 0,
        period: 'month',
        pricingModel: 'Usage-Based',
        limits: '$0.30/GB ingest + $49/full user',
      },
      {
        name: 'Pro',
        price: 0,
        period: 'month',
        pricingModel: 'Usage-Based',
        limits: '$0.30/GB + $349/full user',
      },
    ],
  },
  grafana: FREE_OSS('https://grafana.com'),
  prometheus: FREE_OSS('https://prometheus.io'),
  opentelemetry: FREE_OSS('https://opentelemetry.io'),
  highlight: {
    model: 'freemium',
    hasFreeTier: true,
    isOpenSource: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://www.highlight.io/pricing',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '500 sessions, 1M logs' },
      {
        name: 'Pay-as-you-go',
        price: 0,
        period: 'month',
        pricingModel: 'Usage-Based',
        limits: '$20/1K sessions, $1.50/M logs',
      },
      { name: 'Enterprise', price: null, period: null },
    ],
  },
  betterstack: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://betterstack.com/pricing',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '10 monitors, 3 min checks' },
      { name: 'Team', price: 29, period: 'month', limits: '50 monitors, 30-sec checks' },
      { name: 'Business', price: 85, period: 'month', limits: '150 monitors, status pages' },
    ],
  },
  logflare: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://logflare.app/pricing',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '5M events/mo, 3 day retention' },
      {
        name: 'Metered',
        price: 0,
        period: 'month',
        pricingModel: 'Usage-Based',
        limits: '$0.09/M events',
      },
    ],
  },
  pagerduty: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://www.pagerduty.com/pricing/',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: 'Up to 5 users' },
      {
        name: 'Professional',
        price: 21,
        period: 'month',
        pricingModel: 'Per-Seat',
        limits: 'Unlimited integrations',
      },
      { name: 'Business', price: 41, period: 'month', pricingModel: 'Per-Seat' },
    ],
  },

  // ═══════════════════════════════════════════════
  // PAYMENTS
  // ═══════════════════════════════════════════════
  stripe: {
    model: 'paid',
    hasFreeTier: false,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://stripe.com/pricing',
    tiers: [
      {
        name: 'Standard',
        price: 0,
        period: null,
        pricingModel: 'Percentage',
        limits: '2.9% + $0.30 per transaction',
      },
      { name: 'Custom', price: null, period: null, limits: 'Volume discounts, dedicated support' },
    ],
  },
  paypal: {
    model: 'paid',
    hasFreeTier: false,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://www.paypal.com/us/webapps/mpp/merchant-fees',
    tiers: [
      {
        name: 'Standard',
        price: 0,
        period: null,
        pricingModel: 'Percentage',
        limits: '2.99% + $0.49 per transaction',
      },
      {
        name: 'Advanced',
        price: 5,
        period: 'month',
        pricingModel: 'Percentage',
        limits: '2.59% + $0.49, card fields',
      },
    ],
  },
  paddle: {
    model: 'paid',
    hasFreeTier: false,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://www.paddle.com/pricing',
    tiers: [
      {
        name: 'Standard',
        price: 0,
        period: null,
        pricingModel: 'Percentage',
        limits: '5% + $0.50 per transaction',
      },
      { name: 'Enterprise', price: null, period: null, limits: 'Custom rates' },
    ],
  },
  'lemon-squeezy': {
    model: 'paid',
    hasFreeTier: false,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://www.lemonsqueezy.com/pricing',
    tiers: [
      {
        name: 'Standard',
        price: 0,
        period: null,
        pricingModel: 'Percentage',
        limits: '5% + $0.50 per transaction',
      },
    ],
  },
  braintree: {
    model: 'paid',
    hasFreeTier: false,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://www.braintreepayments.com/pricing',
    tiers: [
      {
        name: 'Standard',
        price: 0,
        period: null,
        pricingModel: 'Percentage',
        limits: '2.59% + $0.49 per transaction',
      },
    ],
  },
  square: {
    model: 'paid',
    hasFreeTier: false,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://squareup.com/us/en/pricing',
    tiers: [
      {
        name: 'Online',
        price: 0,
        period: null,
        pricingModel: 'Percentage',
        limits: '2.9% + $0.30 per transaction',
      },
      {
        name: 'Plus',
        price: 29,
        period: 'month',
        pricingModel: 'Percentage',
        limits: '2.6% + $0.10, POS features',
      },
    ],
  },
  adyen: {
    model: 'paid',
    hasFreeTier: false,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://www.adyen.com/pricing',
    tiers: [
      {
        name: 'Standard',
        price: 0,
        period: null,
        pricingModel: 'Percentage',
        limits: '€0.11 processing + scheme fee per txn',
      },
    ],
  },
  revenuecat: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://www.revenuecat.com/pricing/',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '$2.5K MTR included' },
      {
        name: 'Starter',
        price: 0,
        period: 'month',
        pricingModel: 'Percentage',
        limits: '1% of MTR over $2.5K',
      },
      {
        name: 'Pro',
        price: 0,
        period: 'month',
        pricingModel: 'Percentage',
        limits: '1.2% MTR, targeting, A/B tests',
      },
    ],
  },

  // ═══════════════════════════════════════════════
  // EMAIL
  // ═══════════════════════════════════════════════
  resend: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://resend.com/pricing',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '3,000 emails/mo, 100/day' },
      { name: 'Pro', price: 20, period: 'month', limits: '50K emails/mo, custom domains' },
      {
        name: 'Scale',
        price: 90,
        period: 'month',
        limits: '100K emails/mo, 1K domains, 7-day retention',
      },
      { name: 'Enterprise', price: null, period: null },
    ],
  },
  sendgrid: {
    model: 'paid',
    hasFreeTier: false,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://sendgrid.com/en-us/pricing',
    tiers: [
      {
        name: '60-Day Trial',
        price: 0,
        period: 'month',
        limits: '100 emails/day trial (no permanent free tier)',
      },
      { name: 'Essentials', price: 20, period: 'month', limits: '50K emails/mo' },
      { name: 'Pro', price: 90, period: 'month', limits: '100K emails/mo, dedicated IP' },
    ],
  },
  postmark: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://postmarkapp.com/pricing',
    tiers: [
      {
        name: 'Developer',
        price: 0,
        period: 'month',
        limits: '100 emails/mo, no credit card required',
      },
      { name: '10K', price: 15, period: 'month', limits: '10K emails/mo' },
      { name: '50K', price: 50, period: 'month', limits: '50K emails/mo' },
      { name: '125K', price: 100, period: 'month', limits: '125K emails/mo' },
    ],
  },
  mailgun: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://www.mailgun.com/pricing/',
    tiers: [
      { name: 'Trial', price: 0, period: 'month', limits: '100 emails/day for 1 month' },
      { name: 'Foundation', price: 35, period: 'month', limits: '50K emails/mo' },
      { name: 'Scale', price: 90, period: 'month', limits: '100K emails/mo, dedicated IP' },
    ],
  },
  'aws-ses': {
    model: 'paid',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://aws.amazon.com/ses/pricing/',
    tiers: [
      { name: 'Free (from EC2)', price: 0, period: 'month', limits: '62K emails/mo from EC2' },
      {
        name: 'Pay-as-you-go',
        price: 0,
        period: 'month',
        pricingModel: 'Usage-Based',
        limits: '$0.10/1K emails',
      },
    ],
  },
  mailchimp: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://mailchimp.com/pricing/',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '500 contacts, 1K sends/mo' },
      { name: 'Essentials', price: 13, period: 'month', limits: '500 contacts, 5K sends/mo' },
      { name: 'Standard', price: 20, period: 'month', limits: '500 contacts, 6K sends/mo, A/B' },
      { name: 'Premium', price: 350, period: 'month', limits: '10K contacts, 150K sends/mo' },
    ],
  },
  'react-email': FREE_OSS('https://react.email'),
  knock: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://knock.app/pricing',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '10K notifications/mo' },
      { name: 'Growth', price: 250, period: 'month', limits: '100K notifications/mo' },
      { name: 'Enterprise', price: null, period: null },
    ],
  },
  novu: FREE_OSS('https://novu.co'),
  onesignal: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://onesignal.com/pricing',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: 'Unlimited mobile push' },
      { name: 'Growth', price: 9, period: 'month', limits: 'Email, SMS, advanced segments' },
      { name: 'Professional', price: 99, period: 'month', limits: 'A/B testing, API priority' },
    ],
  },

  // ═══════════════════════════════════════════════
  // CMS
  // ═══════════════════════════════════════════════
  contentful: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://www.contentful.com/pricing/',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '1M API calls, 25K records' },
      { name: 'Basic', price: 300, period: 'month', limits: '10M API calls, roles' },
      { name: 'Enterprise', price: null, period: null },
    ],
  },
  sanity: {
    model: 'freemium',
    hasFreeTier: true,
    isOpenSource: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://www.sanity.io/pricing',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '200K API requests, 10 GB bandwidth' },
      { name: 'Growth', price: 15, period: 'month', limits: '1M API requests, 100 GB' },
      { name: 'Enterprise', price: null, period: null },
    ],
  },
  prismic: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://prismic.io/pricing',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '1 user, unlimited documents' },
      { name: 'Starter', price: 7, period: 'month', limits: '3 users, custom types' },
      { name: 'Small', price: 100, period: 'month', limits: 'Unlimited users, A/B testing' },
    ],
  },
  strapi: FREE_OSS('https://strapi.io'),
  payload: FREE_OSS('https://payloadcms.com'),
  ghost: {
    model: 'freemium',
    hasFreeTier: true,
    isOpenSource: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://ghost.org/pricing/',
    tiers: [
      { name: 'Self-Hosted', price: 0, period: null, limits: 'Free, open-source' },
      { name: 'Starter', price: 9, period: 'month', limits: '500 members, 1 staff user' },
      { name: 'Creator', price: 25, period: 'month', limits: '1K members, unlimited staff' },
      { name: 'Team', price: 50, period: 'month', limits: '1K members, editorial workflow' },
    ],
  },
  directus: FREE_OSS('https://directus.io'),
  wordpress: FREE_OSS('https://wordpress.org'),
  keystatic: FREE_OSS('https://keystatic.com'),
  'builder-io': {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://www.builder.io/pricing',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '1 user, 1 space' },
      { name: 'Growth', price: 49, period: 'month', limits: '3 users, custom code' },
      { name: 'Enterprise', price: null, period: null },
    ],
  },
  notion: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://www.notion.so/pricing',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: 'Unlimited pages, 7-day page history' },
      {
        name: 'Plus',
        price: 10,
        period: 'month',
        pricingModel: 'Per-Seat',
        limits: '30-day page history',
      },
      {
        name: 'Business',
        price: 18,
        period: 'month',
        pricingModel: 'Per-Seat',
        limits: '90-day history, SAML SSO',
      },
    ],
  },

  // ═══════════════════════════════════════════════
  // SEARCH
  // ═══════════════════════════════════════════════
  algolia: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://www.algolia.com/pricing/',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '10K searches/mo, 10K records' },
      {
        name: 'Grow',
        price: 0,
        period: 'month',
        pricingModel: 'Usage-Based',
        limits: '$0.50 per 1K requests',
      },
      { name: 'Premium', price: null, period: null, limits: 'SLA, advanced analytics' },
    ],
  },
  meilisearch: FREE_OSS('https://www.meilisearch.com'),
  typesense: FREE_OSS('https://typesense.org'),
  elasticsearch: FREE_OSS('https://www.elastic.co'),
  opensearch: FREE_OSS('https://opensearch.org'),
  lunr: FREE_OSS('https://lunrjs.com'),
  pinecone: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://www.pinecone.io/pricing/',
    tiers: [
      { name: 'Starter', price: 0, period: 'month', limits: '2 GB storage, 100K vectors' },
      {
        name: 'Standard',
        price: 0,
        period: 'month',
        pricingModel: 'Usage-Based',
        limits: '$0.08/1M read units',
      },
      { name: 'Enterprise', price: null, period: null },
    ],
  },

  // ═══════════════════════════════════════════════
  // ANALYTICS
  // ═══════════════════════════════════════════════
  posthog: {
    model: 'freemium',
    hasFreeTier: true,
    isOpenSource: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://posthog.com/pricing',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '1M events/mo, unlimited seats' },
      {
        name: 'Pay-as-you-go',
        price: 0,
        period: 'month',
        pricingModel: 'Usage-Based',
        limits: '$0.00005/event after 1M',
      },
    ],
  },
  mixpanel: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://mixpanel.com/pricing/',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '1M events/mo, core analytics' },
      {
        name: 'Growth',
        price: 28,
        period: 'month',
        limits: '100M events, group analytics, data pipelines',
      },
      {
        name: 'Enterprise',
        price: null,
        period: null,
        limits: 'Unlimited events, SSO, dedicated support',
      },
    ],
  },
  'google-analytics': FREE_TOOL('https://marketingplatform.google.com/about/analytics/'),
  amplitude: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://amplitude.com/pricing',
    tiers: [
      { name: 'Starter', price: 0, period: 'month', limits: '10K MTU, 10M events, core analytics' },
      { name: 'Plus', price: 49, period: 'month', limits: '300K MTU, 25M events, cohorts' },
      { name: 'Growth', price: null, period: null, limits: 'Custom volume, advanced features' },
      { name: 'Enterprise', price: null, period: null, limits: 'Custom SLA, real-time streaming' },
    ],
  },
  plausible: {
    model: 'paid',
    hasFreeTier: false,
    isOpenSource: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://plausible.io/pricing',
    tiers: [
      { name: 'Self-Hosted', price: 0, period: null, limits: 'Free, open-source' },
      { name: 'Growth', price: 9, period: 'month', limits: '10K monthly pageviews' },
      { name: 'Business', price: 19, period: 'month', limits: '100K monthly pageviews' },
    ],
  },
  umami: FREE_OSS('https://umami.is'),
  heap: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://www.heap.io/pricing',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '10K sessions/mo' },
      { name: 'Growth', price: null, period: null, limits: 'Contact sales' },
      { name: 'Premier', price: null, period: null },
    ],
  },
  hotjar: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://www.hotjar.com/pricing/',
    tiers: [
      { name: 'Basic', price: 0, period: 'month', limits: '35 daily sessions' },
      { name: 'Plus', price: 32, period: 'month', limits: '100 daily sessions, filters' },
      { name: 'Business', price: 80, period: 'month', limits: '500 daily sessions, API' },
    ],
  },
  segment: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://segment.com/pricing/',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '1K visitors/mo, 2 sources' },
      { name: 'Team', price: 120, period: 'month', limits: '10K visitors/mo, unlimited sources' },
      { name: 'Business', price: null, period: null },
    ],
  },
  splitbee: FREE_TOOL('https://splitbee.io'),

  // ═══════════════════════════════════════════════
  // STORAGE
  // ═══════════════════════════════════════════════
  'aws-s3': {
    model: 'paid',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://aws.amazon.com/s3/pricing/',
    tiers: [
      {
        name: 'Free Tier',
        price: 0,
        period: 'month',
        limits: '5 GB, 20K GET, 2K PUT/mo (12 months)',
      },
      {
        name: 'Standard',
        price: 0,
        period: 'month',
        pricingModel: 'Usage-Based',
        limits: '$0.023/GB storage, $0.09/GB transfer',
      },
    ],
  },
  cloudinary: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://cloudinary.com/pricing',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '25 credits, 25K transformations' },
      { name: 'Plus', price: 89, period: 'month', limits: '225 credits, advanced transforms' },
      { name: 'Advanced', price: 224, period: 'month', limits: '600 credits, custom CDN' },
    ],
  },
  uploadthing: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://uploadthing.com/pricing',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '2 GB storage, 2 GB bandwidth' },
      { name: 'Pro', price: 10, period: 'month', limits: '100 GB storage, 100 GB bandwidth' },
      { name: 'Enterprise', price: null, period: null },
    ],
  },
  'supabase-storage': {
    model: 'freemium',
    hasFreeTier: true,
    isOpenSource: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://supabase.com/pricing',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '1 GB storage, 2 GB bandwidth' },
      { name: 'Pro', price: 25, period: 'month', limits: '100 GB storage, 200 GB bandwidth' },
    ],
  },
  'firebase-storage': {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://firebase.google.com/pricing',
    tiers: [
      {
        name: 'Spark (Free)',
        price: 0,
        period: 'month',
        limits: '5 GB storage, 1 GB/day download',
      },
      {
        name: 'Blaze',
        price: 0,
        period: 'month',
        pricingModel: 'Usage-Based',
        limits: '$0.026/GB storage, $0.12/GB download',
      },
    ],
  },
  'cloudflare-r2': {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://developers.cloudflare.com/r2/pricing/',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '10 GB storage, 1M Class A ops' },
      {
        name: 'Pay-as-you-go',
        price: 0,
        period: 'month',
        pricingModel: 'Usage-Based',
        limits: '$0.015/GB storage, zero egress',
      },
    ],
  },
  minio: FREE_OSS('https://min.io'),
  imagekit: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://imagekit.io/pricing/',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '20 GB bandwidth, unlimited storage' },
      { name: 'Essential', price: 49, period: 'month', limits: '225 GB bandwidth, CDN' },
      { name: 'Premium', price: 199, period: 'month', limits: '1.5 TB bandwidth' },
    ],
  },
  'backblaze-b2': {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://www.backblaze.com/cloud-storage/pricing',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '10 GB storage free' },
      {
        name: 'Pay-as-you-go',
        price: 0,
        period: 'month',
        pricingModel: 'Usage-Based',
        limits: '$0.006/GB storage, $0.01/GB download',
      },
    ],
  },

  // ═══════════════════════════════════════════════
  // CI/CD
  // ═══════════════════════════════════════════════
  'github-actions': {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://github.com/pricing',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '2,000 min/mo (public repos free)' },
      {
        name: 'Team',
        price: 4,
        period: 'month',
        pricingModel: 'Per-Seat',
        limits: '3,000 min/mo per user',
      },
      {
        name: 'Enterprise',
        price: 21,
        period: 'month',
        pricingModel: 'Per-Seat',
        limits: '50,000 min/mo per user',
      },
    ],
  },
  circleci: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://circleci.com/pricing/',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '6,000 min/mo, 5 users' },
      {
        name: 'Performance',
        price: 15,
        period: 'month',
        pricingModel: 'Per-Seat',
        limits: 'Per user, 80K credits',
      },
      { name: 'Scale', price: null, period: null, limits: 'Custom pricing' },
    ],
  },
  'gitlab-ci': {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://about.gitlab.com/pricing/',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '400 compute min/mo, 5 users' },
      {
        name: 'Premium',
        price: 29,
        period: 'month',
        pricingModel: 'Per-Seat',
        limits: '10K compute min/mo',
      },
      {
        name: 'Ultimate',
        price: 99,
        period: 'month',
        pricingModel: 'Per-Seat',
        limits: '50K compute min/mo',
      },
    ],
  },
  jenkins: FREE_OSS('https://www.jenkins.io'),
  'argo-cd': FREE_OSS('https://argoproj.github.io/cd/'),
  'bitbucket-pipelines': {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://www.atlassian.com/software/bitbucket/pricing',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '50 build min/mo, 5 users' },
      {
        name: 'Standard',
        price: 3,
        period: 'month',
        pricingModel: 'Per-Seat',
        limits: '2,500 build min/mo',
      },
      {
        name: 'Premium',
        price: 6,
        period: 'month',
        pricingModel: 'Per-Seat',
        limits: '3,500 build min/mo',
      },
    ],
  },
  github: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://github.com/pricing',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: 'Unlimited public/private repos' },
      {
        name: 'Team',
        price: 4,
        period: 'month',
        pricingModel: 'Per-Seat',
        limits: 'Protected branches, pages',
      },
      { name: 'Enterprise', price: 21, period: 'month', pricingModel: 'Per-Seat' },
    ],
  },
  gitlab: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://about.gitlab.com/pricing/',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '5 users, 5 GB storage' },
      { name: 'Premium', price: 29, period: 'month', pricingModel: 'Per-Seat' },
      { name: 'Ultimate', price: 99, period: 'month', pricingModel: 'Per-Seat' },
    ],
  },
  linear: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://linear.app/pricing',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '250 issues, unlimited members' },
      {
        name: 'Standard',
        price: 8,
        period: 'month',
        pricingModel: 'Per-Seat',
        limits: 'Unlimited issues, cycles',
      },
      {
        name: 'Plus',
        price: 14,
        period: 'month',
        pricingModel: 'Per-Seat',
        limits: 'Triage, SLAs',
      },
    ],
  },

  // ═══════════════════════════════════════════════
  // AI / ML
  // ═══════════════════════════════════════════════
  openai: {
    model: 'paid',
    hasFreeTier: false,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://openai.com/api/pricing/',
    tiers: [
      {
        name: 'GPT-4o',
        price: 0,
        period: null,
        pricingModel: 'Usage-Based',
        limits: '$2.50/1M input, $10/1M output tokens',
      },
      {
        name: 'GPT-4o mini',
        price: 0,
        period: null,
        pricingModel: 'Usage-Based',
        limits: '$0.15/1M input, $0.60/1M output tokens',
      },
    ],
  },
  anthropic: {
    model: 'paid',
    hasFreeTier: false,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://www.anthropic.com/pricing',
    tiers: [
      {
        name: 'Claude Opus 4.6',
        price: 0,
        period: null,
        pricingModel: 'Usage-Based',
        limits: '$5/1M input, $25/1M output tokens',
      },
      {
        name: 'Claude Sonnet 4.6',
        price: 0,
        period: null,
        pricingModel: 'Usage-Based',
        limits: '$3/1M input, $15/1M output tokens',
      },
      {
        name: 'Claude Haiku 4.5',
        price: 0,
        period: null,
        pricingModel: 'Usage-Based',
        limits: '$1/1M input, $5/1M output tokens',
      },
    ],
  },
  'google-ai': {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://ai.google.dev/pricing',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '15 RPM, Gemini Flash free' },
      {
        name: 'Pay-as-you-go',
        price: 0,
        period: 'month',
        pricingModel: 'Usage-Based',
        limits: '$0.075/1M input tokens (Flash)',
      },
    ],
  },
  'vercel-ai': FREE_OSS('https://sdk.vercel.ai'),
  langchain: FREE_OSS('https://www.langchain.com'),
  huggingface: {
    model: 'freemium',
    hasFreeTier: true,
    isOpenSource: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://huggingface.co/pricing',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: 'Unlimited public models, community' },
      { name: 'Pro', price: 9, period: 'month', limits: 'Inference API, private models' },
      {
        name: 'Enterprise',
        price: 20,
        period: 'month',
        pricingModel: 'Per-Seat',
        limits: 'SSO, audit logs',
      },
    ],
  },
  replicate: {
    model: 'paid',
    hasFreeTier: false,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://replicate.com/pricing',
    tiers: [
      {
        name: 'Pay-per-second',
        price: 0,
        period: null,
        pricingModel: 'Usage-Based',
        limits: 'Starts at $0.00025/sec (CPU)',
      },
    ],
  },
  'together-ai': {
    model: 'paid',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://www.together.ai/pricing',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '$1 free credit' },
      {
        name: 'Pay-as-you-go',
        price: 0,
        period: 'month',
        pricingModel: 'Usage-Based',
        limits: 'From $0.10/1M tokens (small models)',
      },
    ],
  },
  ollama: FREE_OSS('https://ollama.com'),
  cohere: {
    model: 'freemium',
    hasFreeTier: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://cohere.com/pricing',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '1K API calls/mo, rate limited' },
      {
        name: 'Production',
        price: 0,
        period: 'month',
        pricingModel: 'Usage-Based',
        limits: '$1/1M input tokens (Command)',
      },
    ],
  },
  tensorflow: FREE_OSS('https://www.tensorflow.org'),
  pytorch: FREE_OSS('https://pytorch.org'),
  weaviate: {
    model: 'freemium',
    hasFreeTier: true,
    isOpenSource: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://weaviate.io/pricing',
    tiers: [
      { name: 'Sandbox', price: 0, period: 'month', limits: 'Free cluster, 14-day expiry' },
      {
        name: 'Serverless',
        price: 25,
        period: 'month',
        pricingModel: 'Usage-Based',
        limits: 'Pay-per-stored-object',
      },
      { name: 'Enterprise', price: null, period: null },
    ],
  },
  qdrant: {
    model: 'freemium',
    hasFreeTier: true,
    isOpenSource: true,
    lastVerified: '2026-03-31',
    pricingUrl: 'https://qdrant.tech/pricing/',
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '1 GB, 1 cluster' },
      {
        name: 'Pay-as-you-go',
        price: 0,
        period: 'month',
        pricingModel: 'Usage-Based',
        limits: 'From $0.015/hr per node',
      },
      { name: 'Enterprise', price: null, period: null },
    ],
  },
};
