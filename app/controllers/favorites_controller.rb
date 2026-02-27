class FavoritesController < ApplicationController
  def index
    @favorites = current_user.favorites
    @all_bars = Bar.all
  end

  def create
    @favorite = current_user.favorites.build(favorite_params)

    if @favorite.save
      render json: { success: true, favorite: @favorite }, status: :created
    else
      message = @favorite.errors.full_messages
        .join(", ")
        .gsub(/^Name /, "")

      render json: { success: false, message: message }, status: :unprocessable_entity
    end
  end

  def destroy
    @favorite = current_user.favorites.find(params[:id])
    @favorite.destroy
    redirect_to favorites_path, notice: "Favori supprimé !"
  end

  private

  def favorite_params
    params.require(:favorite).permit(:name, :latitude, :longitude, :sunny)
  end
end
