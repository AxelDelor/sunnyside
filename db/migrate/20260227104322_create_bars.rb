class CreateBars < ActiveRecord::Migration[7.1]
  def change
    create_table :bars do |t|
      t.string :name
      t.float :latitude
      t.float :longitude
      t.string :address

      t.timestamps
    end
  end
end
