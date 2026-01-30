class FavoritesController < ApplicationController

  def index
    @favorites = Favorite.all
    @favorite = Favorite.new
  end

  def create
    @favorite = Favorite.new(favorite_params)
    @favorite.user = current_user
    @favorite.save
    redirect_to favorites_path
  end

  private

  def favorite_params
    params.require(:favorite).permit(:user_id, :name, :latitude, :longitude, :sunny)
  end
end
