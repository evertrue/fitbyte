class AddFitBitColumnsToUsers < ActiveRecord::Migration
  def change
    add_column :users, :fitbit_uid, :string
    add_column :users, :fitbit_token, :string
    add_column :users, :fitbit_secret, :string

    add_index :users, :fitbit_uid
  end
end
