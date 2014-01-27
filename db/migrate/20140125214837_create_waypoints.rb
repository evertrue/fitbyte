class CreateWaypoints < ActiveRecord::Migration
  def change
    create_table :waypoints do |t|
      t.string :lat
      t.string :lng
      t.date :reached_at
      t.references :user
      t.timestamps
    end
  end
end
