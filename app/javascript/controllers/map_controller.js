import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="map"
export default class extends Controller {
  connect() {
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
    const lon = bar.lon

    const marker = L.marker([lat, lon])
      .addTo(this.map)
      .bindPopup(`
        <div>
          <b>${name}</b></br>
          <button class="btn btn-primary"
          data-action="click->map#addFavorite"
          data-bar-name="${name}"
          data-bar-lat="${lat}"
          data-bar-lon="${lon}">
          Ajouter
          </button>
        </div>
      `)
  }

  async addFavorite(event) {
    // Élément visé
    const button = event.currentTarget

    //Création de l'objet favoris
    const favoriteData = {
      name: button.dataset.barName,
      latitude: parseFloat(button.dataset.barLat),
      longitude: parseFloat(button.dataset.barLon)
    }
    console.log(favoriteData)
    button.disabled = true

    try {

      // HTTP Request à l'url de la page, headers pour signifier envoi en JSON
      // et sécurité CSRF pour les requêtes non GET
      const response = await fetch("/favorites", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "X-CSRF-Token": document.querySelector('[name="csrf-token"]').content
        },
        body: JSON.stringify({ favorite: favoriteData })
      })

      // Conditions de bon fonctionnement
      if (response.ok) {
        const data = await response.json()
        console.log("Youpi", data)
        this.addFavoriteToList(data.favorite)


      } else {
        const error = await response.json()
        console.log("Erreur")
      }

    } catch (error) {
      console.log("Catch")
      console.error("Erreur réseau:", error)
    }
  }

  addFavoriteToList(favorite) {
    const ul = document.querySelector('#favorites-list ul.list-group')
    const noFavoritesMessage = document.getElementById('no-favorites-message')

    if (noFavoritesMessage) {
      noFavoritesMessage.remove()
    }

    const favoriteHTML = `<li class="list-group-item">${favorite.name}</li>`
    ul.insertAdjacentHTML('beforeend', favoriteHTML)

  }
}
