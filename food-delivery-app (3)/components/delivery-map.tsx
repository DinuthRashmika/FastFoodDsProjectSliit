"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-routing-machine"

// Fix Leaflet icon issues
const fixLeafletIcon = () => {
    delete (L.Icon.Default.prototype as any)._getIconUrl

    L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    })
}

interface Location {
    lat: number
    lng: number
    address: string
}

interface DeliveryMapProps {
    restaurantLocation: Location
    customerLocation: Location
}

export default function DeliveryMap({ restaurantLocation, customerLocation }: DeliveryMapProps) {
    const mapRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<L.Map | null>(null)

    useEffect(() => {
        // Fix Leaflet icon issues
        fixLeafletIcon()

        if (!mapRef.current) return

        // Initialize map if it doesn't exist
        if (!mapInstanceRef.current) {
            // Create map centered between restaurant and customer
            const centerLat = (restaurantLocation.lat + customerLocation.lat) / 2
            const centerLng = (restaurantLocation.lng + customerLocation.lng) / 2

            mapInstanceRef.current = L.map(mapRef.current).setView([centerLat, centerLng], 13)

            // Add OpenStreetMap tile layer
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(mapInstanceRef.current)
        }

        const map = mapInstanceRef.current

        // Clear existing markers and routes
        map.eachLayer((layer) => {
            if (layer instanceof L.Marker || layer instanceof L.Routing.Control) {
                map.removeLayer(layer)
            }
        })

        // Add restaurant marker
        const restaurantMarker = L.marker([restaurantLocation.lat, restaurantLocation.lng])
            .addTo(map)
            .bindPopup(`<b>Restaurant:</b><br>${restaurantLocation.address}`)

        // Add customer marker
        const customerMarker = L.marker([customerLocation.lat, customerLocation.lng])
            .addTo(map)
            .bindPopup(`<b>Customer:</b><br>${customerLocation.address}`)

        // Add routing between points
        try {
            L.Routing.control({
                waypoints: [
                    L.latLng(restaurantLocation.lat, restaurantLocation.lng),
                    L.latLng(customerLocation.lat, customerLocation.lng),
                ],
                routeWhileDragging: false,
                showAlternatives: false,
                fitSelectedRoutes: true,
                lineOptions: {
                    styles: [{ color: "#6366F1", weight: 4 }],
                },
                createMarker: () => null, // Don't create default markers
            }).addTo(map)
        } catch (error) {
            console.error("Error adding routing:", error)
        }

        // Fit bounds to show both markers
        const bounds = L.latLngBounds(
            [restaurantLocation.lat, restaurantLocation.lng],
            [customerLocation.lat, customerLocation.lng],
        )
        map.fitBounds(bounds, { padding: [50, 50] })

        // Clean up on unmount
        return () => {
            // We don't destroy the map here to prevent re-creation on every render
            // It will be cleaned up when the component unmounts completely
        }
    }, [restaurantLocation, customerLocation])

    return <div ref={mapRef} className="h-full w-full rounded-md overflow-hidden" />
}
