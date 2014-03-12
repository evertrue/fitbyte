namespace :users do
  desc 'Sync all user waypoints'
  task sync_waypoints: :environment do
    User.all.map &:sync_waypoints
  end
end
