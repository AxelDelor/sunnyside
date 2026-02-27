import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="map"
export default class extends Controller {
  static values = { bars: Array }

  connect() {
    console.log(`${this.barsValue.length} bars chargés depuis le HTML !`)

    this.map = L.map('map').setView([50.6292, 3.0573], 13)
    this.markers = []
    this.allBars = this.barsValue

    // Layers
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    this.allBars.forEach(bar => {
      const marker = this.addBarMarker(bar)
      this.markers.push(marker)
    })

  }


  addBarMarker(bar) {
    const name = bar.name || "Bar sans nom"

    const marker = L.marker([bar.latitude, bar.longitude])
      .addTo(this.map)
      .bindPopup(`
        <div class="popup">
          <b>${name}</b></br>
          <button class="btn btn-primary"
          data-action="click->map#addFavorite"
          data-bar-name="${name}"
          data-bar-lat="${bar.latitude}"
          data-bar-lon="${bar.longitude}">
          Ajouter
          </button>
        </div>
      `)
    return marker
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

      const data = await response.json()

      // Conditions de bon fonctionnement
      if (data.success) {
        button.textContent = "Ajouté !"
        button.classList.remove("btn-primary")
        button.classList.add("btn-success")

        this.addFavoriteToList(data.favorite)

      } else {
        console.log("Erreur:", data.message)
        button.textContent = "Déjà ajouté"
        button.classList.remove("btn-primary")
        button.classList.add("btn-warning")
      }

    } catch (error) {
      console.error("Erreur réseau:", error)
      button.textContent = "Erreur"
    }
  }
  // remplacement des favoris en temps réel
  addFavoriteToList(favorite) {
    const ul = document.querySelector('#favorites-list ul.list-group')
    const noFavoritesMessage = document.getElementById('no-favorites-message')

    if (noFavoritesMessage) {
      noFavoritesMessage.remove()
    }

    const favoriteHTML = `
    <li class="list-group-item d-flex justify-content-between align-items-center">
      <div class="d-flex align-items-center justify-content-center gap-2">
        <span>${favorite.name}</span>
        <span class="badge ${favorite.sunny ? 'bg-success' : 'bg-secondary'}">${favorite.sunny ? "Soleil" : "Ombre"}
        </span>
      </div>
      <a href="/favorites/${favorite.id}"
        data-turbo-method="delete"
        data-turbo-confirm="Voulez-vous vraiment supprimer ce favoris ?"
        class="btn btn-warning text-white rounded-4 fw-bold">
        X
      </a>
    </li>`
    ul.insertAdjacentHTML('beforeend', favoriteHTML)




  }

  disconnect() {
    if (this.map) {
      this.map.remove()
    }
  }
}
