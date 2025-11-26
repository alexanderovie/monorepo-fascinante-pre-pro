/**
 * Google Business Profile Types
 *
 * Tipos TypeScript para la integración con Google Business Profile API.
 * Basado en la documentación oficial de Google Business Profile APIs.
 */

/**
 * Tipos de cuenta según documentación oficial
 */
export type AccountType = 'personal' | 'organization' | 'location_group' | 'user_group'

/**
 * Estado de verificación de una ubicación
 */
export type VerificationStatus = 'verified' | 'unverified' | 'pending'

/**
 * Información de una cuenta/organización
 */
export interface GBPAccount {
  accountId: string
  accountName: string
  accountType: AccountType
  locationCount: number
  locationGroupCount?: number
}

/**
 * Grupo de ubicaciones (Location Group)
 */
export interface LocationGroup {
  groupId: string
  groupName: string
  locationCount: number
  accountId: string
}

/**
 * Ubicación individual (Location)
 */
export interface Location {
  locationId: string
  locationName: string
  address?: string
  verificationStatus: VerificationStatus
  locationGroupId?: string
  accountId: string
  rating?: number
  reviewCount?: number
  category?: string
}

/**
 * Métricas de performance (Business Profile Performance API)
 */
export interface PerformanceMetrics {
  locationId: string
  dateRange: {
    startDate: string
    endDate: string
  }
  views: {
    total: number
    searchViews: number
    mapsViews: number
  }
  searches: {
    total: number
    discovery: number
    direct: number
    branded: number
  }
  actions: {
    total: number
    websiteClicks: number
    phoneCalls: number
    directionRequests: number
  }
}

/**
 * Métricas de reviews
 */
export interface ReviewMetrics {
  locationId: string
  totalReviews: number
  averageRating: number
  newReviewsLast7Days: number
  unansweredReviews: number
  ratingDistribution: {
    five: number
    four: number
    three: number
    two: number
    one: number
  }
}

/**
 * Métricas de engagement
 */
export interface EngagementMetrics {
  locationId: string
  pendingQAs: number
  pendingVerifications: number
  activePosts: number
  recentUpdates: number
}

/**
 * Uso de cuota de API
 */
export interface QuotaUsage {
  currentQPM: number
  maxQPM: number
  percentageUsed: number
  remainingEditsPerMinute: number
  maxEditsPerMinute: number
  lastUpdated: string
}

/**
 * Datos agregados para el dashboard
 */
export interface GBPDashboardData {
  selectedAccount: GBPAccount | null
  accounts: GBPAccount[]
  locationGroups: LocationGroup[]
  locations: Location[]
  aggregatedMetrics: {
    performance: Omit<PerformanceMetrics, 'locationId'>
    reviews: Omit<ReviewMetrics, 'locationId'>
    engagement: Omit<EngagementMetrics, 'locationId'>
  }
  quotaUsage: QuotaUsage
}

