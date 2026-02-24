class Favorite < ApplicationRecord
  belongs_to :user

  validates :name, uniqueness: { scope: :user_id, message: "%{value} se trouve déjà dans vos favoris." }
end
