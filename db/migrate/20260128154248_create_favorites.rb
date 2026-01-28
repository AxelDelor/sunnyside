class CreateFavorites < ActiveRecord::Migration[7.1]
  def change
    create_table :favorites do |t|
      t.string :name
      t.float :latitude
      t.float :longitude
      t.boolean :sunny
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
