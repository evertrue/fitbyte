class User < ActiveRecord::Base
  COMP_START = Date.parse '2014-03-12'
  COMP_END = COMP_START + 100.days
  COMP_TOTAL_STEPS = 1000000
  STEPS_PER_DAY = COMP_TOTAL_STEPS / (COMP_END - COMP_START).to_i

  AVATAR_URL = 'http://challenge.evertrue.com.s3.amazonaws.com/images/avatars/'

  devise :trackable, :omniauthable

  has_many :waypoints

  def competitors
    index = rank - 1
    return User.rankings[1] if index == 0
    return User.rankings[-2] if index == (User.rankings.size - 1)

    [User.rankings[index - 1], User.rankings[index + 1]]
  end

  def rank
    User.rankings.find_index(self).to_i + 1
  end

  def steps_needed
    COMP_TOTAL_STEPS - steps
  end

  def steps_needed_per_day
    steps_needed / (COMP_END - Date.today).to_i
  end

  def steps_surplus
    steps - (Date.today - COMP_START).to_i * STEPS_PER_DAY
  end

  def steps(metric = :sum)
    waypoints.calculate metric, :steps
  end

  def floors(metric = :sum)
    waypoints.calculate metric, :floors
  end

  def avatar_path
    [AVATAR_URL, "#{ slug || 'mysterio' }.png"].join
  end

  def marker_path
    [AVATAR_URL, "#{ slug || 'mysterio' }_marker.png"].join
  end

  def sync_waypoints
    log = fitbit.data_by_time_range '/activities/log/distance', base_date: COMP_START, end_date: COMP_START + 1.year
    days = log['activities-log-distance']

    total_dist = 0
    high_distance = 0
    low_distance = 0

    waypoint = Waypoint.find_or_initialize_by user: self, reached_at: COMP_START - 1.day
    location = User.route.locate total_dist
    waypoint.update lat: location.lat, lng: location.lng

    days.delete_if { |day| day['value'].to_i == 0 }

    days.each do |day|
      distance = day['value'].to_f 
      total_dist += distance
      low_distance = distance if distance < low_distance
      high_distance = distance if distance > high_distance

      location = User.route.locate total_dist

      waypoint = Waypoint.find_or_initialize_by user: self, reached_at: Date.parse(day['dateTime']) do |wp|
        summary = fitbit.activities_on_date(day['dateTime'])['summary'] || []

        wp.steps = summary['steps']
        wp.floors = summary['floors']
        wp.elevation = summary['elevation']
      end

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

  def self.longest_path
    top_user = User.rankings.first
    Route.path_to top_user.waypoints.first, top_user.waypoints.last
  end

  def self.rankings
    User.all.sort { |u1, u2| u2.steps <=> u1.steps }
  end

  def self.route
    Route.new Route.parse_json_file('route.json')
  end
end
