class FavoritesController < ApplicationController
  def index
    @favorites = current_user.favorites
  end

  def create
    # @favorite = Favorite.new(favorite_params)
    # @favorite.user = current_user
    @favorite = current_user.favorites.build(favorite_params)

    if @favorite.save
      render json: { success: true, favorite: @favorite }, status: :created
    else
      render json: { success: false, message: @favorite.errors.full_messages.join(", ") }, status: :unprocessable_entity
    end
  end

  private

  def favorite_params
    params.require(:favorite).permit(:name, :latitude, :longitude, :sunny)
  end
end
