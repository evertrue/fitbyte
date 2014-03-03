class AddFieldsToWaypoint < ActiveRecord::Migration
  def change
    add_column :waypoints, :steps, :integer
    add_column :waypoints, :floors, :integer
    add_column :waypoints, :elevation, :integer
  end
end
