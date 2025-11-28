/**
 * Attributes List Component
 *
 * ÉLITE PRO: Componente para mostrar y gestionar atributos de una ubicación
 * según estándares de la industria.
 *
 * Características:
 * - Lista de atributos configurados
 * - Mostrar atributos disponibles
 * - Editar atributos
 * - Soporte para diferentes tipos de valores
 */

'use client'

import { useState } from 'react'
import type { GBPAttribute } from '@/lib/gbp/types'
import { updateLocationAttributesAction } from '@/app/google-business-profile/locations/[locationId]/actions'

interface AttributesListProps {
  attributes: GBPAttribute[]
  availableAttributes?: Array<{
    name: string
    valueType: string
    displayName?: string
    description?: string
  }>
  locationId: string
}

export default function AttributesList({
  attributes,
  availableAttributes = [],
  locationId,
}: AttributesListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<{
    stringValues?: string[]
    uriValues?: string[]
    boolValue?: boolean
  }>({})
  const [loading, setLoading] = useState(false)

  // ÉLITE PRO: Función para actualizar atributo según documentación oficial
  // Referencia: https://developers.google.com/my-business/reference/businessinformation/rest/v1/Attributes
  const handleUpdate = async (attributeId: string, valueType: string) => {
    setLoading(true)
    try {
      // ÉLITE: Construir estructura según valueType según doc oficial
      const attributeName = `locations/${locationId}/attributes/${attributeId}`
      const attributeData: {
        name: string
        repeatedEnumValue?: { setValues: string[]; unsetValues: string[] }
        uriValues?: Array<{ uri: string }>
        values?: string[]
      } = {
        name: attributeName,
      }

      if (valueType === 'REPEATED_ENUM') {
        // ÉLITE: Según doc oficial, REPEATED_ENUM usa repeatedEnumValue
        if (formData.stringValues && formData.stringValues.length > 0) {
          attributeData.repeatedEnumValue = {
            setValues: formData.stringValues,
            unsetValues: [],
          }
        }
      } else if (valueType === 'URL') {
        // ÉLITE: Según doc oficial, URL usa uriValues con objetos { uri: string }
        if (formData.uriValues && formData.uriValues.length > 0) {
          attributeData.uriValues = formData.uriValues.map((uri) => ({ uri }))
        }
      } else if (valueType === 'ENUM' || valueType === 'BOOL') {
        // ÉLITE: ENUM y BOOL usan values[] según doc oficial
        if (formData.stringValues && formData.stringValues.length > 0) {
          attributeData.values = formData.stringValues
        }
      }

      const result = await updateLocationAttributesAction(locationId, 'attributes', {
        name: `locations/${locationId}/attributes`,
        attributes: [attributeData],
      })

      if (result.success) {
        setEditingId(null)
        setFormData({})
        window.location.reload()
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error updating attribute:', error)
      alert('Error al actualizar atributo')
    } finally {
      setLoading(false)
    }
  }

  // ÉLITE PRO: Obtener valor formateado según estructura oficial de la API
  // Referencia: https://developers.google.com/my-business/reference/businessinformation/rest/v1/Attributes
  const getAttributeValue = (attribute: GBPAttribute) => {
    // ÉLITE: Según doc oficial, los valores dependen del valueType
    if (attribute.repeatedEnumValue) {
      // REPEATED_ENUM: mostrar setValues
      return attribute.repeatedEnumValue.setValues.join(', ') || 'No configurado'
    }
    if (attribute.uriValues && attribute.uriValues.length > 0) {
      // URL: mostrar URIs
      return attribute.uriValues.map((uv) => uv.uri).join(', ')
    }
    if (attribute.values && attribute.values.length > 0) {
      // ENUM/BOOL: mostrar values
      return attribute.values.join(', ')
    }
    return 'No configurado'
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Atributos</h2>

      {/* Atributos Configurados */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm dark:bg-neutral-800 dark:border-neutral-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Atributos Configurados
        </h3>
        {attributes.length === 0 ? (
          <p className="text-gray-500 dark:text-neutral-400">No hay atributos configurados</p>
        ) : (
          <div className="space-y-4">
            {attributes.map((attribute) => {
              const attributeId = attribute.name.split('/').pop() || ''
              const isEditing = editingId === attributeId
              const currentValue = getAttributeValue(attribute)

              return (
                <div
                  key={attribute.name}
                  className="border border-gray-200 dark:border-neutral-700 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {attribute.displayName || attributeId}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">
                        Tipo: {attribute.valueType}
                      </p>
                    </div>
                    {!isEditing && (
                      <button
                        onClick={() => {
                          setEditingId(attributeId)
                          // ÉLITE PRO: Inicializar formData según estructura oficial de la API
                          if (attribute.repeatedEnumValue) {
                            setFormData({
                              stringValues: attribute.repeatedEnumValue.setValues,
                              uriValues: [],
                            })
                          } else if (attribute.uriValues) {
                            setFormData({
                              stringValues: [],
                              uriValues: attribute.uriValues.map((uv) => uv.uri),
                            })
                          } else {
                            setFormData({
                              stringValues: attribute.values || [],
                              uriValues: [],
                            })
                          }
                        }}
                        className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Editar
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-3">
                      {attribute.valueType === 'REPEATED_ENUM' ? (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                            Valores Set (uno por línea)
                          </label>
                          <textarea
                            value={formData.stringValues?.join('\n') || ''}
                            onChange={(e) => {
                              const values = e.target.value.split('\n').filter((v) => v.trim())
                              setFormData({ ...formData, stringValues: values })
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                            rows={3}
                          />
                        </div>
                      ) : attribute.valueType === 'URL' ? (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                            Valores (uno por línea)
                          </label>
                          <textarea
                            value={
                              attribute.valueType === 'URL'
                                ? formData.uriValues?.join('\n') || ''
                                : formData.stringValues?.join('\n') || ''
                            }
                            onChange={(e) => {
                              const values = e.target.value.split('\n').filter((v) => v.trim())
                              if (attribute.valueType === 'URL') {
                                setFormData({ ...formData, uriValues: values })
                              } else {
                                setFormData({ ...formData, stringValues: values })
                              }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                            rows={3}
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                            Valor
                          </label>
                          <input
                            type="text"
                            value={formData.stringValues?.[0] || ''}
                            onChange={(e) =>
                              setFormData({ ...formData, stringValues: [e.target.value] })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                          />
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(attributeId, attribute.valueType)}
                          disabled={loading}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
                        >
                          {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null)
                            setFormData({})
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white text-sm font-medium"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-700 dark:text-neutral-300">{currentValue}</p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Atributos Disponibles */}
      {availableAttributes.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm dark:bg-neutral-800 dark:border-neutral-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Atributos Disponibles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableAttributes.map((attr) => (
              <div
                key={attr.name}
                className="border border-gray-200 dark:border-neutral-700 rounded-lg p-3"
              >
                <p className="font-medium text-gray-900 dark:text-white">
                  {attr.displayName || attr.name}
                </p>
                {attr.description && (
                  <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
                    {attr.description}
                  </p>
                )}
                <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1">
                  Tipo: {attr.valueType}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
