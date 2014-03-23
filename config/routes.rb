Fitbyte::Application.routes.draw do
  devise_for :users, controllers: { omniauth_callbacks: 'omniauth_callbacks' }

  namespace :map do
    get :locations
    get :route
  end

  resources :users, only: :show

  root 'map#index'
end
