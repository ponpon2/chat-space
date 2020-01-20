Rails.application.routes.draw do
  devise_for :users
  root "messages#index"
  root "home#index"
  resources :users, only: [:edit, :update]
end
