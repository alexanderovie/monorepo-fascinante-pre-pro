/**
 * Mock Data para Google Business Profile
 *
 * Datos de ejemplo para desarrollo y testing.
 * En producción, estos datos vendrán de la API real.
 */

import type {
  GBPAccount,
  LocationGroup,
  Location,
  PerformanceMetrics,
  ReviewMetrics,
  EngagementMetrics,
  QuotaUsage,
  GBPDashboardData,
} from './types'

/**
 * Cuentas de ejemplo
 */
export const mockAccounts: GBPAccount[] = [
  {
    accountId: '123456789',
    accountName: 'Fascinante Digital',
    accountType: 'organization',
    locationCount: 15,
    locationGroupCount: 3,
  },
  {
    accountId: 'accounts/987654321',
    accountName: 'Mi Negocio Personal',
    accountType: 'personal',
    locationCount: 3,
  },
]

/**
 * Grupos de ubicaciones de ejemplo
 */
export const mockLocationGroups: LocationGroup[] = [
  {
    groupId: 'locationGroups/group-1',
    groupName: 'Restaurantes',
    locationCount: 5,
    accountId: '123456789',
  },
  {
    groupId: 'locationGroups/group-2',
    groupName: 'Tiendas',
    locationCount: 10,
    accountId: '123456789',
  },
  {
    groupId: 'locationGroups/group-3',
    groupName: 'Servicios',
    locationCount: 3,
    accountId: '123456789',
  },
]

/**
 * Ubicaciones de ejemplo
 */
export const mockLocations: Location[] = [
  {
    locationId: 'locations/loc-1',
    locationName: 'Restaurante Centro',
    address: 'Av. Principal 123, Ciudad',
    verificationStatus: 'verified',
    locationGroupId: 'locationGroups/group-1',
    accountId: '123456789',
    rating: 4.5,
    reviewCount: 127,
    category: 'Restaurante',
  },
  {
    locationId: 'locations/loc-2',
    locationName: 'Tienda Norte',
    address: 'Calle Norte 456, Ciudad',
    verificationStatus: 'verified',
    locationGroupId: 'locationGroups/group-2',
    accountId: '123456789',
    rating: 4.8,
    reviewCount: 89,
    category: 'Tienda',
  },
  {
    locationId: 'locations/loc-3',
    locationName: 'Servicio Técnico',
    address: 'Av. Sur 789, Ciudad',
    verificationStatus: 'unverified',
    locationGroupId: 'locationGroups/group-3',
    accountId: '123456789',
    rating: 4.2,
    reviewCount: 45,
    category: 'Servicio',
  },
]

/**
 * Métricas de performance de ejemplo
 */
export const mockPerformanceMetrics: PerformanceMetrics = {
  locationId: 'aggregated',
  dateRange: {
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  },
  views: {
    total: 15420,
    searchViews: 8920,
    mapsViews: 6500,
  },
  searches: {
    total: 12340,
    discovery: 7800,
    direct: 3200,
    branded: 1340,
  },
  actions: {
    total: 3450,
    websiteClicks: 1200,
    phoneCalls: 1800,
    directionRequests: 450,
  },
}

/**
 * Métricas de reviews de ejemplo
 */
export const mockReviewMetrics: ReviewMetrics = {
  locationId: 'aggregated',
  totalReviews: 261,
  averageRating: 4.5,
  newReviewsLast7Days: 12,
  unansweredReviews: 5,
  ratingDistribution: {
    five: 180,
    four: 50,
    three: 20,
    two: 8,
    one: 3,
  },
}

/**
 * Métricas de engagement de ejemplo
 */
export const mockEngagementMetrics: EngagementMetrics = {
  locationId: 'aggregated',
  pendingQAs: 1,
  pendingVerifications: 2,
  activePosts: 8,
  recentUpdates: 3,
}

/**
 * Uso de cuota de ejemplo
 */
export const mockQuotaUsage: QuotaUsage = {
  currentQPM: 245,
  maxQPM: 300,
  percentageUsed: 81.67,
  remainingEditsPerMinute: 8,
  maxEditsPerMinute: 10,
  lastUpdated: new Date().toISOString(),
}

/**
 * Datos completos del dashboard (mock)
 */
export const mockGBPDashboardData: GBPDashboardData = {
  selectedAccount: mockAccounts[0],
  accounts: mockAccounts,
  locationGroups: mockLocationGroups,
  locations: mockLocations,
  aggregatedMetrics: {
    performance: {
      dateRange: mockPerformanceMetrics.dateRange,
      views: mockPerformanceMetrics.views,
      searches: mockPerformanceMetrics.searches,
      actions: mockPerformanceMetrics.actions,
    },
    reviews: {
      totalReviews: mockReviewMetrics.totalReviews,
      averageRating: mockReviewMetrics.averageRating,
      newReviewsLast7Days: mockReviewMetrics.newReviewsLast7Days,
      unansweredReviews: mockReviewMetrics.unansweredReviews,
      ratingDistribution: mockReviewMetrics.ratingDistribution,
    },
    engagement: {
      pendingQAs: mockEngagementMetrics.pendingQAs,
      pendingVerifications: mockEngagementMetrics.pendingVerifications,
      activePosts: mockEngagementMetrics.activePosts,
      recentUpdates: mockEngagementMetrics.recentUpdates,
    },
  },
  quotaUsage: mockQuotaUsage,
}

