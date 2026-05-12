class DemoController < ApplicationController
  def index
  end

  def nested
  end

  def nested_form
    @submitted_label = params[:label].presence || "blank"

    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.replace(
          "nested-form-frame",
          partial: "demo/nested_form",
          locals: { submitted_label: @submitted_label }
        )
      end
      format.html { redirect_to nested_path }
    end
  end
end
