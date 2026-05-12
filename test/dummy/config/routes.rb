Rails.application.routes.draw do
  root "demo#index"

  mount Achilles::Engine => "/achilles"
end
