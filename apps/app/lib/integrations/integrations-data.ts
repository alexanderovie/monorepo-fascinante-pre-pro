/**
 * Integrations Data
 *
 * Datos centralizados de todas las integraciones disponibles.
 * Fácil de mantener y extender.
 */

import type { Integration, IntegrationCategory } from './types'

/**
 * Lista de todas las integraciones disponibles
 *
 * Basado en la plantilla Preline Pro account-integrations.html
 */
export const availableIntegrations: Integration[] = [
  {
    id: 'slack',
    name: 'Slack',
    description: 'Connect a slack workspace in order to setup automated notifications.',
    category: 'communication',
    icon: '/assets/integrations/slack.svg',
    status: 'disconnected',
    authType: 'oauth',
    documentationUrl: 'https://api.slack.com/docs',
    features: ['Automated notifications', 'Team collaboration', 'Real-time updates'],
    isPopular: true,
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Connect your Notion account to work seamlessly across Notion & Preline.',
    category: 'productivity',
    icon: '/assets/integrations/notion.svg',
    status: 'disconnected',
    authType: 'oauth',
    documentationUrl: 'https://developers.notion.com',
    features: ['Document sync', 'Task management', 'Knowledge base'],
    isPopular: true,
  },
  {
    id: 'figma',
    name: 'Figma',
    description: "Connect your team's Figma workspace to help everyone stay up-to-date.",
    category: 'productivity',
    icon: '/assets/integrations/figma.svg',
    status: 'disconnected',
    authType: 'oauth',
    documentationUrl: 'https://www.figma.com/developers/api',
    features: ['Design sync', 'Team collaboration', 'Asset management'],
  },
  {
    id: 'github',
    name: 'Github',
    description: 'Link git pull requests, branches, and commits to Preline.',
    category: 'development',
    icon: '/assets/integrations/github.svg',
    status: 'disconnected',
    authType: 'oauth',
    documentationUrl: 'https://docs.github.com/en/rest',
    features: ['PR tracking', 'Commit linking', 'Branch management'],
    isPopular: true,
  },
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'Create and share Preline right from your inbox.',
    category: 'communication',
    icon: '/assets/integrations/gmail.svg',
    status: 'disconnected',
    authType: 'oauth',
    documentationUrl: 'https://developers.google.com/gmail/api',
    features: ['Email integration', 'Share from inbox', 'Email tracking'],
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    description: 'Reinventing teamwork just got a little easier with Dropbox & Preline.',
    category: 'storage',
    icon: '/assets/integrations/dropbox.svg',
    status: 'disconnected',
    authType: 'oauth',
    documentationUrl: 'https://www.dropbox.com/developers',
    features: ['File storage', 'File sharing', 'Team collaboration'],
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    description: 'Send email newsletters and manage subscribers in Mailchimp.',
    category: 'marketing',
    icon: '/assets/integrations/mailchimp.svg',
    status: 'disconnected',
    authType: 'oauth',
    documentationUrl: 'https://mailchimp.com/developer',
    features: ['Email campaigns', 'Subscriber management', 'Analytics'],
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'A 2-way sync between your scheduled Preline tasks and your Google Calendar.',
    category: 'calendar',
    icon: '/assets/integrations/google-calendar.svg',
    status: 'disconnected',
    authType: 'oauth',
    documentationUrl: 'https://developers.google.com/calendar',
    features: ['2-way sync', 'Event management', 'Calendar integration'],
    isPopular: true,
  },
  {
    id: 'gitlab',
    name: 'Gitlab',
    description: 'Link git merge requests, branches, and commits to Preline.',
    category: 'development',
    icon: '/assets/integrations/gitlab.svg',
    status: 'disconnected',
    authType: 'oauth',
    documentationUrl: 'https://docs.gitlab.com/ee/api',
    features: ['MR tracking', 'Commit linking', 'CI/CD integration'],
  },
  {
    id: 'sentry',
    name: 'Sentry',
    description: 'Connect Sentry to Preline to keep track of issues in one place.',
    category: 'monitoring',
    icon: '/assets/integrations/sentry.svg',
    status: 'disconnected',
    authType: 'api_key',
    documentationUrl: 'https://docs.sentry.io/api',
    features: ['Error tracking', 'Issue management', 'Performance monitoring'],
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Connect Zapier to set up custom workflows on Preline.',
    category: 'automation',
    icon: '/assets/integrations/zapier.svg',
    status: 'disconnected',
    authType: 'webhook',
    documentationUrl: 'https://zapier.com/developer',
    features: ['Custom workflows', 'Automation', 'App integration'],
    isPopular: true,
  },
  // Integración de Google Business Profile (nuestra integración principal)
  {
    id: 'google-business-profile',
    name: 'Google Business Profile',
    description: 'Manage your business locations, reviews, and performance metrics.',
    category: 'marketing',
    icon: '/assets/integrations/google-business-profile.svg',
    status: 'disconnected',
    authType: 'oauth',
    documentationUrl: 'https://developers.google.com/my-business/content/overview',
    features: ['Location management', 'Review tracking', 'Performance analytics', 'Q&A management'],
    isPopular: true,
    isNew: true,
  },
]

/**
 * Obtener integraciones por categoría
 */
export function getIntegrationsByCategory(category: IntegrationCategory): Integration[] {
  return availableIntegrations.filter((integration) => integration.category === category)
}

/**
 * Obtener integraciones populares
 */
export function getPopularIntegrations(): Integration[] {
  return availableIntegrations.filter((integration) => integration.isPopular)
}

/**
 * Obtener nuevas integraciones
 */
export function getNewIntegrations(): Integration[] {
  return availableIntegrations.filter((integration) => integration.isNew)
}

/**
 * Buscar integraciones por nombre o descripción
 */
export function searchIntegrations(query: string): Integration[] {
  const lowerQuery = query.toLowerCase()
  return availableIntegrations.filter(
    (integration) =>
      integration.name.toLowerCase().includes(lowerQuery) ||
      integration.description.toLowerCase().includes(lowerQuery) ||
      integration.features.some((feature) => feature.toLowerCase().includes(lowerQuery))
  )
}

