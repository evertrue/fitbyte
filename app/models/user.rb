class User < ActiveRecord::Base
  devise :trackable, :omniauthable

  has_many :waypoints

  def sync_waypoints
    log = fitbit.data_by_time_range '/activities/log/distance', base_date: '2013-01-01', end_date: '2014-03-01'
    days = log['activities-log-distance']

    total_dist = 0

    days.delete_if { |day| day['value'].to_i == 0 }

    days.each do |day|
      total_dist += day['value'].to_f
      location = User.route.locate total_dist

      waypoint = Waypoint.find_or_initialize_by user: self, reached_at: Date.parse(day['dateTime'])
      waypoint.update lat: location.lat, lng: location.lng
    end
  end

  def fitbit
    @fitbit ||= Fitgem::Client.new consumer_key: ENV['FITBIT_KEY'], 
                                   consumer_secret: ENV['FITBIT_SECRET'],
                                   token: fitbit_token, 
                                   secret: fitbit_secret, 
                                   user_id: fitbit_uid
  end

  def self.route
    @route ||= Route.new Route.parse_json_file('route.json')
  end
end
