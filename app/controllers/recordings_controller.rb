class RecordingsController < ApplicationController
  skip_before_action :verify_authenticity_token
  def new
    @recording = Recording.new
  end

  def show
    @recording = Recording.find_by(key: params[:key])
  end

  def create
    @recording = Recording.new(recording_params)
      if @recording.save
        render json: @recording
      else
        render json: @recording.errors.full_messages
      end
  end

  private

  def recording_params
    params.require(:recording).permit(:file)
  end

end
