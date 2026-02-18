# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
Favorite.destroy_all

# puts "Création de favoris"
# Favorite.create!(name:"Au bon godet", latitude: 50.64183549834662, longitude: 3.0844309160813608, sunny: false, user_id: 1)
# puts "#{Favorite.count} favoris créé"
