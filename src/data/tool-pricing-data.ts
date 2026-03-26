/* ───────────────────────────────────────────────
   Pylon — Rich Pricing Data for Hosted Services
   Structured pricing tiers for services that have
   paid plans beyond their free tier.
   ─────────────────────────────────────────────── */

import type { ToolPricing } from './tools-catalog';

/**
 * Rich pricing data for hosted/managed services.
 * Tools not listed here use their legacy `pricing` string.
 * Key = tool.id from the catalog.
 */
export const TOOL_PRICING_MAP: Record<string, ToolPricing> = {
  // ── Database ──────────────────────────────────
  supabase: {
    model: 'freemium',
    hasFreeTier: true,
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
    tiers: [
      { name: 'Spark (Free)', price: 0, period: 'month', limits: '1 GB storage, 50K reads/day' },
      {
        name: 'Blaze (Pay-as-you-go)',
        price: 0,
        period: 'month',
        limits: 'Usage-based after free quota',
      },
    ],
  },
  planetscale: {
    model: 'freemium',
    hasFreeTier: true,
    tiers: [
      { name: 'Hobby', price: 0, period: 'month', limits: '5 GB storage, 1B row reads/mo' },
      { name: 'Scaler', price: 29, period: 'month', limits: '10 GB storage, unlimited reads' },
      { name: 'Scaler Pro', price: 39, period: 'month', limits: '10 GB storage, read replicas' },
      { name: 'Enterprise', price: null, period: null },
    ],
  },
  neon: {
    model: 'freemium',
    hasFreeTier: true,
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '0.5 GiB storage, 1 project' },
      { name: 'Launch', price: 19, period: 'month', limits: '10 GiB storage, 100 projects' },
      { name: 'Scale', price: 69, period: 'month', limits: '50 GiB storage, autoscaling' },
      { name: 'Enterprise', price: null, period: null },
    ],
  },
  'mongodb-atlas': {
    model: 'freemium',
    hasFreeTier: true,
    tiers: [
      { name: 'Free (M0)', price: 0, period: 'month', limits: '512 MB storage, shared cluster' },
      { name: 'Serverless', price: 0, period: 'month', limits: 'Pay-per-operation' },
      { name: 'Dedicated (M10)', price: 57, period: 'month', limits: '10 GB, dedicated cluster' },
    ],
  },
  upstash: {
    model: 'freemium',
    hasFreeTier: true,
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '10K commands/day, 256 MB' },
      { name: 'Pay-as-you-go', price: 0, period: 'month', limits: '$0.2/100K commands' },
      { name: 'Pro 2K', price: 280, period: 'month', limits: 'Dedicated, multi-zone' },
    ],
  },

  // ── Auth ───────────────────────────────────────
  clerk: {
    model: 'freemium',
    hasFreeTier: true,
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '10K MAU, basic features' },
      { name: 'Pro', price: 25, period: 'month', limits: 'Unlimited MAU, custom domains' },
      { name: 'Enterprise', price: null, period: null },
    ],
  },
  auth0: {
    model: 'freemium',
    hasFreeTier: true,
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '25K MAU, social login' },
      { name: 'Essential', price: 35, period: 'month', limits: 'Custom domains, MFA' },
      { name: 'Professional', price: 240, period: 'month', limits: 'Advanced MFA, organizations' },
      { name: 'Enterprise', price: null, period: null },
    ],
  },

  // ── Hosting ────────────────────────────────────
  vercel: {
    model: 'freemium',
    hasFreeTier: true,
    tiers: [
      { name: 'Hobby', price: 0, period: 'month', limits: 'Personal projects, 100 GB bandwidth' },
      { name: 'Pro', price: 20, period: 'month', limits: 'Team features, 1 TB bandwidth' },
      { name: 'Enterprise', price: null, period: null, limits: 'SLA, advanced security' },
    ],
  },
  netlify: {
    model: 'freemium',
    hasFreeTier: true,
    tiers: [
      { name: 'Starter', price: 0, period: 'month', limits: '100 GB bandwidth, 1 member' },
      { name: 'Pro', price: 19, period: 'month', limits: '1 TB bandwidth, analytics' },
      { name: 'Enterprise', price: null, period: null },
    ],
  },
  railway: {
    model: 'freemium',
    hasFreeTier: true,
    tiers: [
      { name: 'Trial', price: 0, period: 'month', limits: '$5 free credit, 500 hrs' },
      { name: 'Hobby', price: 5, period: 'month', limits: '$5/mo + usage' },
      { name: 'Pro', price: 20, period: 'month', limits: 'Team features, priority support' },
    ],
  },
  render: {
    model: 'freemium',
    hasFreeTier: true,
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
    tiers: [
      { name: 'Basic Droplet', price: 4, period: 'month', limits: '512 MB / 1 vCPU / 10 GB SSD' },
      { name: 'Regular Droplet', price: 12, period: 'month', limits: '2 GB / 1 vCPU / 50 GB SSD' },
      { name: 'App Platform', price: 5, period: 'month', limits: 'Managed PaaS per container' },
    ],
  },
  cloudflare: {
    model: 'freemium',
    hasFreeTier: true,
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
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '3 shared VMs, 3 GB persistent' },
      { name: 'Launch', price: 0, period: 'month', limits: 'Pay-as-you-go from $1.94/mo' },
      { name: 'Scale', price: 0, period: 'month', limits: 'Reserved pricing, priority support' },
    ],
  },

  // ── Monitoring ─────────────────────────────────
  sentry: {
    model: 'freemium',
    hasFreeTier: true,
    tiers: [
      { name: 'Developer', price: 0, period: 'month', limits: '5K errors, 1 user' },
      { name: 'Team', price: 26, period: 'month', limits: '50K errors, unlimited users' },
      { name: 'Business', price: 80, period: 'month', limits: '100K errors, data forwarding' },
    ],
  },
  datadog: {
    model: 'freemium',
    hasFreeTier: true,
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '5 hosts, 1 day retention' },
      { name: 'Pro', price: 15, period: 'month', limits: 'Per host, 15 month retention' },
      { name: 'Enterprise', price: 23, period: 'month', limits: 'Per host, custom retention' },
    ],
  },

  // ── Payments ───────────────────────────────────
  stripe: {
    model: 'paid',
    hasFreeTier: false,
    tiers: [
      { name: 'Standard', price: 0, period: null, limits: '2.9% + $0.30 per transaction' },
      { name: 'Custom', price: null, period: null, limits: 'Volume discounts, dedicated support' },
    ],
  },

  // ── Email ──────────────────────────────────────
  resend: {
    model: 'freemium',
    hasFreeTier: true,
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '3,000 emails/mo, 100/day' },
      { name: 'Pro', price: 20, period: 'month', limits: '50K emails/mo, custom domains' },
      { name: 'Enterprise', price: null, period: null },
    ],
  },
  sendgrid: {
    model: 'freemium',
    hasFreeTier: true,
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '100 emails/day' },
      { name: 'Essentials', price: 20, period: 'month', limits: '50K emails/mo' },
      { name: 'Pro', price: 90, period: 'month', limits: '100K emails/mo, dedicated IP' },
    ],
  },
  postmark: {
    model: 'paid',
    hasFreeTier: false,
    tiers: [
      { name: '10K', price: 15, period: 'month', limits: '10K emails/mo' },
      { name: '50K', price: 50, period: 'month', limits: '50K emails/mo' },
      { name: '125K', price: 100, period: 'month', limits: '125K emails/mo' },
    ],
  },
  mailgun: {
    model: 'freemium',
    hasFreeTier: true,
    tiers: [
      { name: 'Trial', price: 0, period: 'month', limits: '100 emails/day for 1 month' },
      { name: 'Foundation', price: 35, period: 'month', limits: '50K emails/mo' },
      { name: 'Scale', price: 90, period: 'month', limits: '100K emails/mo, dedicated IP' },
    ],
  },

  // ── CMS ────────────────────────────────────────
  contentful: {
    model: 'freemium',
    hasFreeTier: true,
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '1M API calls, 25K records' },
      { name: 'Basic', price: 300, period: 'month', limits: '10M API calls, roles' },
      { name: 'Enterprise', price: null, period: null },
    ],
  },
  sanity: {
    model: 'freemium',
    hasFreeTier: true,
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '200K API requests, 10 GB bandwidth' },
      { name: 'Growth', price: 15, period: 'month', limits: '1M API requests, 100 GB' },
      { name: 'Enterprise', price: null, period: null },
    ],
  },
  prismic: {
    model: 'freemium',
    hasFreeTier: true,
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '1 user, unlimited documents' },
      { name: 'Starter', price: 7, period: 'month', limits: '3 users, custom types' },
      { name: 'Small', price: 100, period: 'month', limits: 'Unlimited users, A/B testing' },
    ],
  },

  // ── Search ─────────────────────────────────────
  algolia: {
    model: 'freemium',
    hasFreeTier: true,
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '10K searches/mo, 10K records' },
      { name: 'Grow', price: 0, period: 'month', limits: '$0.50 per 1K requests' },
      { name: 'Premium', price: null, period: null, limits: 'SLA, advanced analytics' },
    ],
  },

  // ── CI/CD ──────────────────────────────────────
  'github-actions': {
    model: 'freemium',
    hasFreeTier: true,
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '2,000 min/mo (public repos free)' },
      { name: 'Team', price: 4, period: 'month', limits: '3,000 min/mo per user' },
      { name: 'Enterprise', price: 21, period: 'month', limits: '50,000 min/mo per user' },
    ],
  },
  circleci: {
    model: 'freemium',
    hasFreeTier: true,
    tiers: [
      { name: 'Free', price: 0, period: 'month', limits: '6,000 min/mo, 5 users' },
      { name: 'Performance', price: 15, period: 'month', limits: 'Per user, 80K credits' },
      { name: 'Scale', price: 0, period: 'month', limits: 'Custom pricing, self-hosted runners' },
    ],
  },
};
