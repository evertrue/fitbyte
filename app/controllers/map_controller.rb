class MapController < ApplicationController
  before_action :set_filter_dates, only: :locations

  def index
  end

  def locations
    render json: User.all, include: { waypoints: { only: [ :lat, :lng, :reached_at ] } }, only: [ :id, :name], methods: [:marker_path]
  end

  private

  def set_filter_dates
    @start_at = Date.parse(params[:start_at]) rescue Date.today
    @end_at = Date.parse(params[:end_at]) rescue Date.today

    @start_at, @end_at = @end_at, @start_at if @start_at > @end_at
  end
end
