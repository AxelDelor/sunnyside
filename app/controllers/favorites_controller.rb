class FavoritesController < ApplicationController
  def index
    @favorites = current_user.favorites
    @all_bars = Bar.all
  end

  def create
    @favorite = current_user.favorites.build(favorite_params)

    if @favorite.save
      respond_to do |format|
        format.turbo_stream
        format.html { redirect_to favorites_path }
      end
    else
      respond_to do |format|
        format.turbo_stream { head :unprocessable_entity }
        format.html { redirect_to favorites_path, alert: "Erreur lors de l'ajout du favori" }
      end
    end
  end

  def destroy
    @favorite = current_user.favorites.find(params[:id])
    @favorite.destroy

    respond_to do |format|
      format.turbo_stream
      format.html { redirect_to favorites_path, notice: "Favori supprimé !" }
    end
  end

  private

  def favorite_params
    params.require(:favorite).permit(:name, :latitude, :longitude, :sunny)
  end
end
