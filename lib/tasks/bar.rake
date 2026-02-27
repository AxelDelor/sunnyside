namespace :bar do
  desc "Importer tous les bars grâce à l'API Overpass"
  task import: :environment do
    puts "Importation des bars"

    # Zone de Lille métropole
    south = 50.55
    west = 2.95
    north = 50.70
    east = 3.15

    # Requête Overpass pour récupérer les bars
    query = <<~QUERY
      [out:json][timeout:60];
      (
        node["amenity"="bar"](${south},${west},${north},${east});
        node["amenity"="pub"](${south},${west},${north},${east});
        node["amenity"="cafe"](${south},${west},${north},${east});
        node["amenity"="restaurant"](${south},${west},${north},${east});
      );
      out body;
    QUERY

    uri = URI("https://overpass-api.de/api/interpreter")
    response = Net::HTTP.post(uri, query)
    data = JSON.parse(response.body)

    bars_count = 0
    duplicates_count = 0

    data["elements"].each do |elements|
      bar_name = element.dig("tags", "name") || "Nom inconnu"
      bar_lat = element.dig("lat")
      bar_lon = element.dig("lon")

      # Construire l'adresse
      address_parts = []
      address_parts << element.dig("tags", "contact:housenumber")
      address_parts << element.dig("tags", "contact:street")
      address = address_parts.compact.join(" ")

      bar = Bar.find_or_initialize_by(latitude: bar_lat, longitude: bar_lon)

      if bar.new_record?
        bar.name = bar_name
        bar.address = address.presence

        if bar.save
          bars_count += 1
          puts "#{bar_name} crée"
        else
          puts "Erreur: #{bar.errors.full_messages.join(", ")}"
        end
      else
        duplicates_count += 1
      end
    end

    puts "Importation terminée !"
    puts "  - #{bars_count} bars ajoutés"
    puts "  - #{duplicates_count} doublons ignorés"
    puts "  - Total en DB: #{Bar.count} bars"
  end

  desc "Supprime tous les bars de la DB"
  task clear: :environment do
    count = Bar.count
    Bar.destroy_all
    puts "#{count} bars supprimés"
  end
end
