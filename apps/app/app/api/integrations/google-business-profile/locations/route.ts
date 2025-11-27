/**
 * Google Business Profile - Locations API Endpoint
 *
 * ÉLITE: Endpoint para gestionar ubicaciones de Google Business Profile
 * siguiendo las mejores prácticas de la industria 2025.
 *
 * Endpoints disponibles:
 * - GET /api/integrations/google-business-profile/locations?accountId={accountId}
 *   → Lista todas las ubicaciones de una cuenta con datos formateados para tabla
 *
 * Referencia oficial:
 * https://developers.google.com/my-business/content/location-data
 */

import { NextResponse } from 'next/server'
import { getLocationsTableData } from '@/lib/gbp/get-locations-table-data'
import { GBPAPIError, GBPErrorCode } from '@/lib/integrations/gbp-errors'

/**
 * GET /api/integrations/google-business-profile/locations
 *
 * Lista todas las ubicaciones de una cuenta con datos formateados para la tabla.
 * ÉLITE: Usa el endpoint oficial de Google: GET /v1/accounts/{accountId}/locations
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const accountId = searchParams.get('accountId')
    const includeHealthScore = searchParams.get('includeHealthScore') === 'true'

    if (!accountId) {
      return NextResponse.json(
        {
          error: 'Missing accountId',
          message: 'accountId query parameter is required',
        },
        { status: 400 }
      )
    }

    // ÉLITE: Logging para debugging
    console.log('[GBP Locations API] Request:', {
      accountId,
      includeHealthScore,
    })

    // Obtener datos de la tabla
    const tableData = await getLocationsTableData({
      accountId,
      includeHealthScore,
    })

    console.log('[GBP Locations API] Success:', {
      count: tableData.length,
    })

    return NextResponse.json({
      success: true,
      data: tableData,
      count: tableData.length,
    })
  } catch (error) {
    // ÉLITE: Manejo estructurado de errores
    const gbpError = GBPAPIError.fromUnknown(error)

    console.error('[GBP Locations API] Error:', {
      code: gbpError.code,
      message: gbpError.message,
      statusCode: gbpError.statusCode,
      retryable: gbpError.retryable,
    })

    // Mapear códigos de error a respuestas HTTP apropiadas
    switch (gbpError.code) {
      case GBPErrorCode.UNAUTHORIZED:
      case GBPErrorCode.TOKEN_EXPIRED:
      case GBPErrorCode.TOKEN_INVALID:
        return NextResponse.json(
          {
            error: gbpError.code,
            message: 'Token expired or invalid. Please reconnect your Google Business Profile account.',
            code: gbpError.code,
          },
          { status: 401 }
        )

      case GBPErrorCode.INSUFFICIENT_PERMISSIONS:
        return NextResponse.json(
          {
            error: gbpError.code,
            message: 'Access denied. Please ensure the Google Business Profile API is enabled and you have the necessary permissions.',
            code: gbpError.code,
          },
          { status: 403 }
        )

      case GBPErrorCode.NOT_FOUND:
        return NextResponse.json(
          {
            error: gbpError.code,
            message: 'No locations found for this account.',
            code: gbpError.code,
            data: [],
          },
          { status: 404 }
        )

      case GBPErrorCode.RATE_LIMIT_EXCEEDED:
      case GBPErrorCode.QUOTA_EXCEEDED:
        return NextResponse.json(
          {
            error: gbpError.code,
            message: 'Rate limit exceeded. Please try again later.',
            code: gbpError.code,
            retryAfter: gbpError.retryAfter,
          },
          {
            status: 429,
            headers: gbpError.retryAfter
              ? { 'Retry-After': gbpError.retryAfter.toString() }
              : undefined,
          }
        )

      case GBPErrorCode.SERVICE_UNAVAILABLE:
      case GBPErrorCode.TIMEOUT:
        return NextResponse.json(
          {
            error: gbpError.code,
            message: 'Google Business Profile API is temporarily unavailable. Please try again later.',
            code: gbpError.code,
            retryable: true,
          },
          { status: 503 }
        )

      default:
        return NextResponse.json(
          {
            error: gbpError.code,
            message: gbpError.message || 'An unexpected error occurred',
            code: gbpError.code,
          },
          { status: gbpError.statusCode || 500 }
        )
    }
  }
}
