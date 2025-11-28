/**
 * Place Actions List Component
 *
 * ÉLITE PRO: Componente para mostrar y gestionar place actions
 * según estándares de la industria.
 *
 * Características:
 * - Lista de place actions
 * - Crear nuevos place actions
 * - Editar place actions existentes
 * - Tipos de acciones disponibles
 */

'use client'

import { useState } from 'react'
import type { GBPPlaceAction } from '@/lib/gbp/types'
import {
  createPlaceActionAction,
  updatePlaceActionAction,
} from '@/app/google-business-profile/locations/[locationId]/actions'

interface PlaceActionsListProps {
  placeActions: GBPPlaceAction[]
  locationId: string
  availableTypes?: Array<{ placeActionType: string; displayName: string }>
}

export default function PlaceActionsList({
  placeActions,
  locationId,
  availableTypes = [],
}: PlaceActionsListProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    placeActionType: '',
    uri: '',
    providerType: 'MERCHANT',
    isPreferred: false,
  })
  const [loading, setLoading] = useState(false)

  // ÉLITE: Función para crear place action
  const handleCreate = async () => {
    if (!formData.placeActionType || !formData.uri) return

    setLoading(true)
    try {
      const result = await createPlaceActionAction(locationId, formData)
      if (result.success) {
        setIsCreating(false)
        setFormData({ placeActionType: '', uri: '', providerType: 'MERCHANT', isPreferred: false })
        window.location.reload()
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error creating place action:', error)
      alert('Error al crear place action')
    } finally {
      setLoading(false)
    }
  }

  // ÉLITE: Función para actualizar place action
  const handleUpdate = async (actionId: string) => {
    setLoading(true)
    try {
      const result = await updatePlaceActionAction(
        locationId,
        actionId,
        'uri,isPreferred',
        {
          uri: formData.uri,
          isPreferred: formData.isPreferred,
        }
      )
      if (result.success) {
        setEditingId(null)
        setFormData({ placeActionType: '', uri: '', providerType: 'MERCHANT', isPreferred: false })
        window.location.reload()
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error updating place action:', error)
      alert('Error al actualizar place action')
    } finally {
      setLoading(false)
    }
  }

  // ÉLITE: Obtener nombre del tipo de acción
  const getActionTypeName = (type: string) => {
    const typeMap: Record<string, string> = {
      APPOINTMENT: 'Cita',
      ONLINE_APPOINTMENT: 'Cita Online',
      DINING_RESERVATION: 'Reserva de Restaurante',
      FOOD_ORDERING: 'Pedido de Comida',
      FOOD_DELIVERY: 'Entrega de Comida',
      FOOD_TAKEOUT: 'Comida para Llevar',
      SHOP_ONLINE: 'Comprar Online',
    }
    return typeMap[type] || type
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Place Actions</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          + Agregar Place Action
        </button>
      </div>

      {/* Formulario de creación */}
      {isCreating && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm dark:bg-neutral-800 dark:border-neutral-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Crear Place Action
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                Tipo de Acción
              </label>
              <select
                value={formData.placeActionType}
                onChange={(e) => setFormData({ ...formData, placeActionType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
              >
                <option value="">Seleccionar tipo...</option>
                {availableTypes.map((type) => (
                  <option key={type.placeActionType} value={type.placeActionType}>
                    {type.displayName || getActionTypeName(type.placeActionType)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                URL
              </label>
              <input
                type="url"
                value={formData.uri}
                onChange={(e) => setFormData({ ...formData, uri: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPreferred"
                checked={formData.isPreferred}
                onChange={(e) => setFormData({ ...formData, isPreferred: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isPreferred" className="text-sm text-gray-700 dark:text-neutral-300">
                Acción preferida
              </label>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                disabled={loading || !formData.placeActionType || !formData.uri}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {loading ? 'Creando...' : 'Crear'}
              </button>
              <button
                onClick={() => {
                  setIsCreating(false)
                  setFormData({ placeActionType: '', uri: '', providerType: 'MERCHANT', isPreferred: false })
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white text-sm font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Place Actions */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm dark:bg-neutral-800 dark:border-neutral-700">
        {placeActions.length === 0 ? (
          <p className="text-gray-500 dark:text-neutral-400">No hay place actions configurados</p>
        ) : (
          <div className="space-y-4">
            {placeActions.map((action) => {
              const actionId = action.name.split('/').pop() || ''
              const isEditing = editingId === actionId

              return (
                <div
                  key={action.name}
                  className="border border-gray-200 dark:border-neutral-700 rounded-lg p-4"
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                          URL
                        </label>
                        <input
                          type="url"
                          value={formData.uri}
                          onChange={(e) => setFormData({ ...formData, uri: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.isPreferred}
                          onChange={(e) => setFormData({ ...formData, isPreferred: e.target.checked })}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label className="text-sm text-gray-700 dark:text-neutral-300">
                          Acción preferida
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(actionId)}
                          disabled={loading}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
                        >
                          {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null)
                            setFormData({ placeActionType: '', uri: '', providerType: 'MERCHANT', isPreferred: false })
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white text-sm font-medium"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {getActionTypeName(action.placeActionType)}
                        </p>
                        <a
                          href={action.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          {action.uri}
                        </a>
                        {action.isPreferred && (
                          <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded text-xs font-medium">
                            Preferida
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setEditingId(actionId)
                          setFormData({
                            placeActionType: action.placeActionType,
                            uri: action.uri || '',
                            providerType: action.providerType || 'MERCHANT',
                            isPreferred: action.isPreferred || false,
                          })
                        }}
                        className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Editar
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

