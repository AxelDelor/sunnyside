import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="map"
export default class extends Controller {
  static values = { bars: Array }
  static targets = ["submitButton"]

  connect() {
    console.log(`${this.barsValue.length} bars chargés depuis le HTML !`)

    this.map = L.map('map').setView([50.6292, 3.0573], 13)
    this.markers = []

    // Layers
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    this.barsValue.forEach(bar => {
      const marker = this.addBarMarker(bar)
      this.markers.push(marker)
    })

  }


  addBarMarker(bar) {
    const name = bar.name || "Bar sans nom"
    const csrfToken = document.querySelector('[name="csrf-token"]').content

      const svgIcon = L.divIcon({
    className: 'custom-svg-marker',
    html: `
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path fill="#ffc107"
              stroke="#fff"
              stroke-width="2"
              d="M12.5 0C5.6 0 0 5.6 0 12.5c0 8.4 12.5 28.5 12.5 28.5S25 20.9 25 12.5C25 5.6 19.4 0 12.5 0z"/>
        <circle cx="12.5" cy="12.5" r="6" fill="#fff"/>
      </svg>
    `,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41]
  })

    const marker = L.marker([bar.latitude, bar.longitude], { icon: svgIcon})
      .addTo(this.map)
      .bindPopup(`
        <div class="popup">
          <b>${name}</b></br>
          <form action="/favorites"
          method="post"
          data-turbo="true"
          data-action="
          turbo:submit-start->map#disableButton
          turbo:submit-end->map#handleSubmit
          ">
            <input type="hidden" name="authenticity_token" value="${csrfToken}">
            <input type="hidden" name="favorite[name]" value="${name}">
            <input type="hidden" name="favorite[latitude]" value="${bar.latitude}">
            <input type="hidden" name="favorite[longitude]" value="${bar.longitude}">
            <input type="hidden" name="favorite[sunny]" value="false">
            <button type="submit" class="btn btn-primary">
              Ajouter
            </button>
          </form>
        </div>
      `)

    return marker
  }

    disableButton(event) {
    const button = event.target.querySelector('button[type="submit"]')
    button.disabled = true
    button.textContent = "Ajout..."
  }

  handleSubmit(event) {
  const button = event.target.querySelector('button[type="submit"]')

  if (event.detail.success) {
    button.textContent = "Ajouté !"
    button.classList.remove("btn-primary")
    button.classList.add("btn-success")

  } else {
    button.textContent = "Déjà ajouté"
    button.classList.remove("btn-primary")
    button.classList.add("btn-warning")
    button.disabled = false
  }
}

  disconnect() {
    if (this.map) {
      this.map.remove()
    }
  }
}
