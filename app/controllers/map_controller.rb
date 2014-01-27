class MapController < ApplicationController
  before_action :set_filter_dates, only: :locations

  def index
  end

  def locations
    render json: current_user.waypoints.where(reached_at: @start_at.beginning_of_day..@end_at.end_of_day).order(:reached_at)
  end

  private

  def set_filter_dates
    @start_at = Date.parse(params[:start_at]) rescue Date.today
    @end_at = Date.parse(params[:end_at]) rescue Date.today

    @start_at, @end_at = @end_at, @start_at if @start_at > @end_at
  end
end
