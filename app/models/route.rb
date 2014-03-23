class Route
  attr_reader :points, :polyline

  def initialize(points = [])
    @polyline = Polylines::Encoder.encode_points points
    @points = points.map { |point| Geokit::LatLng.new(*point) }
  end

  def locate(distance)
    total_distance = 0

    segment = points.each_cons(2).find do |pair|
      (total_distance += between(pair)) > distance
    end

    if segment
      remaining = distance - (total_distance - between(segment))

      ratio = remaining / between(segment)
      x = reduce_coordinate ratio, *segment.map(&:lat)
      y = reduce_coordinate ratio, *segment.map(&:lng)
    else
      x = points.last.lat
      y = points.last.lng
    end

    Geokit::LatLng.new x, y
  end

  def self.parse_json_file(filename)
    json = JSON.parse IO.read filename

    steps = json["routes"].first["legs"].first["steps"]
    steps.reduce [] do |points, step|
      points += Polylines::Decoder.decode_polyline step["polyline"]["points"]
    end
  end

  private

  def between(pair)
    pair.first.distance_to pair.last
  end

  def reduce_coordinate(ratio, a, b)
    ratio * (b - a) + a
  end
end
