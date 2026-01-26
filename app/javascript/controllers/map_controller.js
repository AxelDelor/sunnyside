import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="map"
export default class extends Controller {
  connect() {
    console.log("coucou")
    this.map = L.map('map').setView([50.6292, 3.0573], 13)

    // Layers
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

     // Charger les bars depuis OpenStreetMap
    this.loadBarsFromOSM()
  }

   async loadBarsFromOSM() {
    try {
      // Rectangle qui définit la zone de recherche
      const bounds = this.map.getBounds()
      const south = bounds.getSouth()
      const west = bounds.getWest()
      const north = bounds.getNorth()
      const east = bounds.getEast()

      // Requête Overpass pour récupérer les bars
      const query = `
        [out:json][timeout:25];
        (
          node["amenity"="bar"](${south},${west},${north},${east});
          node["amenity"="pub"](${south},${west},${north},${east});
        );
        out body;
      `

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query
      })

      const data = await response.json()

      console.log("Bars trouvés:", data.elements)

      // Ajouter les markers pour chaque bar
      data.elements.forEach(bar => {
        this.addBarMarker(bar)
      })

    } catch (error) {
      console.error("Erreur lors du chargement des bars:", error)
    }
  }

  addBarMarker(bar) {
    const name = bar.tags.name || "Bar sans nom"
    const lat = bar.lat
    const lng = bar.lon

    const marker = L.marker([lat, lng])
      .addTo(this.map)
      .bindPopup(`
        <div>
          <b>${name}</b>
        </div>
      `)
  }

  // addFavorite() {

  // }
}
