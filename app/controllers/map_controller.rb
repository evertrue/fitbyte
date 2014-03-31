class MapController < ApplicationController
  before_action :set_filter_dates, only: :locations

  def index
  end

  def locations
    @users = User.all
  end

  def route
    render json: { polyline: User.route.polyline }
  end

  private

  def set_filter_dates
    @start_at = Date.parse(params[:start_at]) rescue Date.today
    @end_at = Date.parse(params[:end_at]) rescue Date.today

    @start_at, @end_at = @end_at, @start_at if @start_at > @end_at
  end
end
