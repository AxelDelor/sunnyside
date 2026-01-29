class FavoritesController < ApplicationController

  def index
    @favorites = Favorite.all
    @favorite = Favorite.new
  end

  def create
    @user = current_user
    @favorite = Favorite.new(favorite_params)
    @favorite.save
  end

  private

  def favorite_params
    params.require(:favorite).permit(:user_id, :name, :latitude, :longitude, :boolean)
  end
end
