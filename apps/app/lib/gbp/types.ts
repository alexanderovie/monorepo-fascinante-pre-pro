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
 * Ubicación individual (Location) - Formato interno simplificado
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
 * Ubicación completa de Google Business Profile API
 * Basado en: https://developers.google.com/my-business/content/location-data
 */
export interface GBPLocation {
  name: string // Formato: "locations/{locationId}"
  title?: string
  storefrontAddress?: {
    addressLines?: string[]
    locality?: string
    administrativeArea?: string
    postalCode?: string
    regionCode?: string
  }
  phoneNumbers?: {
    phoneNumber?: string
    phoneNumberType?: string
  }[]
  websiteUri?: string
  regularHours?: {
    periods?: {
      openDay?: string
      openTime?: { hours?: number; minutes?: number }
      closeDay?: string
      closeTime?: { hours?: number; minutes?: number }
    }[]
  }
  categories?: {
    primaryCategory?: {
      displayName?: string
      name?: string // "gcid:internet_marketing_service"
    }
    additionalCategories?: {
      displayName?: string
      name?: string
    }[]
  }
  openInfo?: {
    status?: 'OPEN' | 'CLOSED_PERMANENTLY' | 'CLOSED_TEMPORARILY'
    canReopen?: boolean
  }
  metadata?: {
    canDelete?: boolean
    canModifyServiceList?: boolean
    canOperateGoogleUpdate?: boolean
    canOperateLocalPost?: boolean
    canOperateLodgingData?: boolean
    duplicateLocation?: string
    hasGoogleUpdated?: boolean
    hasPendingEdits?: boolean
    mapsUri?: string
    newReviewUri?: string
  }
  updateTime?: string
  createTime?: string
}

/**
 * Respuesta de la API para listar ubicaciones
 */
export interface GBPLocationsListResponse {
  locations?: GBPLocation[]
  nextPageToken?: string
}

/**
 * Progreso de completitud de una ubicación
 */
export interface LocationProgress {
  score: number // 0-5
  percentage: number // 0-100
  completedFields: string[]
  missingFields: string[]
}

/**
 * Health Score de una ubicación
 */
export interface HealthScore {
  score: number // 0-5
  percentage: number // 0-100
  breakdown: {
    completeness: number
    attributes: number
    updates: number
    verification: number
  }
}

/**
 * Fila de la tabla de ubicaciones
 */
export interface LocationTableRow {
  locationId: string
  name: string
  category: string
  additionalCategories?: string[]
  status: 'Active' | 'Pending' | 'Needs Review' | 'Closed'
  progress: LocationProgress
  lastUpdated: string
  healthScore?: HealthScore
  location: GBPLocation
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
