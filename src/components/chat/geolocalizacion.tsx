"use client"

import { useEffect, useRef } from "react"

interface GeolocalizacionProps {
  onLocation?: (coords: { latitude: number; longitude: number; accuracy?: number }) => void
  onError?: (error: GeolocationPositionError | Error) => void
  isActive?: boolean // Controla si la geolocalización está activa
}

export default function Geolocalizacion({ 
  onLocation, 
  onError,
  isActive = true
}: GeolocalizacionProps) {
  const watchIdRef = useRef<number | null>(null)
  const currentLocationRef = useRef<{ latitude: number; longitude: number; accuracy?: number } | null>(null)

  useEffect(() => {
    if (!isActive) {
      // Detener geolocalización si no está activa
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }
      return
    }

    if (!("geolocation" in navigator)) {
      const err = new Error("Geolocation not supported")
      onError?.(err)
      return
    }

    // Configuración optimizada: balance entre precisión y velocidad
    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 0 
    }

    const handleLocationSuccess = (position: GeolocationPosition) => {
      const coords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      }

      // Mostrar cada ubicación obtenida
      console.log(`Geolocalización obtenida - Lat: ${coords.latitude.toFixed(6)}, Lng: ${coords.longitude.toFixed(6)}, Precisión: ${coords.accuracy?.toFixed(1)}m`)

      // Actualizar la ubicación actual si es más precisa o es la primera
      if (!currentLocationRef.current || 
          (position.coords.accuracy && currentLocationRef.current.accuracy && 
           position.coords.accuracy < currentLocationRef.current.accuracy)) {
        currentLocationRef.current = coords
        onLocation?.(coords)
      }
    }

    const handleLocationError = (error: GeolocationPositionError) => {
      onError?.(error)
    }

    // Iniciar monitoreo continuo con watchPosition
    watchIdRef.current = navigator.geolocation.watchPosition(
      handleLocationSuccess,
      handleLocationError,
      options
    )

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }
    }
  }, [onLocation, onError, isActive])

  return null
}
