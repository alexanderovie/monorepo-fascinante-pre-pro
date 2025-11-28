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
    primaryPhone?: string
    additionalPhones?: string[]
  }
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
 * Review (Reseña) de Google Business Profile API
 * Basado en: https://developers.google.com/my-business/reference/businessinformation/rest/v4/accounts.locations.reviews
 */
export interface GBPReview {
  reviewId: string
  reviewer: {
    displayName: string
    profilePhotoUrl?: string
    isAnonymous: boolean
  }
  starRating: 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE'
  comment?: string
  createTime: string
  updateTime: string
  reviewReply?: {
    comment: string
    updateTime: string
  }
}

/**
 * Respuesta de la API para listar reviews
 */
export interface GBPReviewsResponse {
  reviews?: GBPReview[]
  averageRating?: number
  totalReviewCount?: number
  nextPageToken?: string
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
 * Media (Foto/Video) de Google Business Profile API
 * Basado en: https://developers.google.com/my-business/reference/businessinformation/rest/v4/accounts.locations.media
 */
export interface GBPMedia {
  mediaFormat: 'PHOTO' | 'VIDEO'
  sourceUrl?: string
  thumbnailUrl?: string
  name?: string // "accounts/{accountId}/locations/{locationId}/media/{mediaKey}"
  createTime?: string
  attribution?: {
    provider?: string
    photoUri?: string
  }
  googleUrl?: string
  thumbnailGoogleUrl?: string
}

/**
 * Respuesta de la API para listar media
 */
export interface GBPMediaResponse {
  media?: GBPMedia[]
  nextPageToken?: string
}

/**
 * Place Action (Acción de Lugar) de Google Business Profile API
 * Basado en: https://developers.google.com/my-business/reference/businessinformation/rest/v1/placeActionLinks
 */
export interface GBPPlaceAction {
  name: string // "locations/{locationId}/placeActionLinks/{id}"
  placeActionType: 'APPOINTMENT' | 'ONLINE_APPOINTMENT' | 'DINING_RESERVATION' | 'FOOD_ORDERING' | 'FOOD_DELIVERY' | 'FOOD_TAKEOUT' | 'SHOP_ONLINE'
  uri?: string
  providerType?: 'MERCHANT' | 'AGGREGATOR_3P'
  isPreferred?: boolean
  updateTime?: string
}

/**
 * Respuesta de la API para listar place actions
 */
export interface GBPPlaceActionsResponse {
  placeActionLinks?: GBPPlaceAction[]
  nextPageToken?: string
}

/**
 * Metadata de tipos de place actions disponibles
 */
export interface GBPPlaceActionTypeMetadata {
  placeActionType: string
  displayName: string
}

/**
 * Attribute (Atributo) de Google Business Profile API
 * Basado en documentación oficial: https://developers.google.com/my-business/reference/businessinformation/rest/v1/Attributes
 *
 * ÉLITE PRO: Estructura exacta según documentación oficial (2024-10-16)
 */
export type AttributeValueType = 'URL' | 'REPEATED_ENUM' | 'ENUM' | 'BOOL'

export interface GBPAttribute {
  name: string // "locations/{locationId}/attributes/{attributeId}" - Required según doc oficial
  valueType: AttributeValueType // Output only según doc oficial
  // ÉLITE: Según doc oficial, los valores dependen del valueType:
  // - REPEATED_ENUM: usar repeatedEnumValue
  // - URL: usar uriValues
  // - ENUM/BOOL: usar values[]
  values?: string[] // Para ENUM y BOOL
  repeatedEnumValue?: {
    setValues: string[] // Enum values que están set (true)
    unsetValues: string[] // Enum values que están unset (false)
  }
  uriValues?: Array<{
    uri: string // Required según doc oficial
  }>
  displayName?: string // Campo adicional para UI
}

/**
 * Respuesta de la API para obtener atributos de una ubicación
 * Basado en documentación oficial: https://developers.google.com/my-business/reference/businessinformation/rest/v1/Attributes
 */
export interface GBPLocationAttributesResponse {
  name: string // "locations/{locationId}/attributes" - Required según doc oficial
  attributes: GBPAttribute[] // Required según doc oficial
}

/**
 * Respuesta de la API para obtener atributos disponibles
 */
export interface GBPAvailableAttributesResponse {
  attributes?: Array<{
    name: string
    valueType: AttributeValueType
    displayName?: string
    description?: string
  }>
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
