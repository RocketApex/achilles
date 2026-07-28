Rails.application.routes.draw do
  root "demo#index"
  get "nested", to: "demo#nested"
  get "frame_lifecycle", to: "demo#frame_lifecycle"
  get "frame_lifecycle_replacement", to: "demo#frame_lifecycle_replacement"
  post "nested_form", to: "demo#nested_form"

  mount Achilles::Engine => "/achilles"
end
