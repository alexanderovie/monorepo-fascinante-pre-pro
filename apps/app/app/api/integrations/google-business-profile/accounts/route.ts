/**
 * Google Business Profile - Accounts API Endpoint
 *
 * ÉLITE: Endpoint para gestionar cuentas de Google Business Profile
 * siguiendo las mejores prácticas de la industria 2025.
 *
 * Endpoints disponibles:
 * - GET /api/integrations/google-business-profile/accounts
 *   → Lista todas las cuentas del usuario autenticado
 *
 * Referencia oficial:
 * https://developers.google.com/my-business/content/account-management
 */

import { NextResponse } from 'next/server'
import { createGBPClient } from '@/lib/integrations/gbp-client'
import { GBPAPIError, GBPErrorCode } from '@/lib/integrations/gbp-errors'

/**
 * GET /api/integrations/google-business-profile/accounts
 *
 * Lista todas las cuentas de Google Business Profile del usuario autenticado.
 * ÉLITE: Usa el endpoint oficial de Google: GET /v1/accounts
 */
export async function GET() {
  try {
    const client = await createGBPClient()

    // Llamar al endpoint oficial de Google Business Profile API
    const response = await client.listAccounts()

    // Transformar la respuesta de Google al formato interno
    const accounts = (response.accounts || []).map((account) => {
      // Extraer accountId del formato "accounts/{accountId}"
      const accountId = account.name.replace('accounts/', '')

      return {
        accountId,
        accountName: account.accountName || accountId,
        accountType: (account.type?.toLowerCase() as 'personal' | 'organization') || 'personal',
        locationCount: 0, // Se actualizará cuando obtengamos las ubicaciones
        verificationState: account.verificationState,
        vettedState: account.vettedState,
        organizationInfo: account.organizationInfo,
      }
    })

    return NextResponse.json({
      success: true,
      accounts,
      nextPageToken: response.nextPageToken,
    })
  } catch (error) {
    // ÉLITE: Manejo estructurado de errores
    const gbpError = GBPAPIError.fromUnknown(error)

    console.error('[GBP Accounts API] Error:', {
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
      case GBPErrorCode.ACCOUNT_NOT_FOUND:
        return NextResponse.json(
          {
            error: gbpError.code,
            message: 'No Google Business Profile accounts found.',
            code: gbpError.code,
            accounts: [],
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

      case GBPErrorCode.INVALID_REQUEST:
      case GBPErrorCode.VALIDATION_ERROR:
        return NextResponse.json(
          {
            error: gbpError.code,
            message: gbpError.message,
            code: gbpError.code,
          },
          { status: 400 }
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
