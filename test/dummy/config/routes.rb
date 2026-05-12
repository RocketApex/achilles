Rails.application.routes.draw do
  root "demo#index"
  get "nested", to: "demo#nested"
  post "nested_form", to: "demo#nested_form"

  mount Achilles::Engine => "/achilles"
end
