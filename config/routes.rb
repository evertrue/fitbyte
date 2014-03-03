Fitbyte::Application.routes.draw do
  devise_for :users, controllers: { omniauth_callbacks: 'omniauth_callbacks' }

  namespace :map do
    get :locations
  end

  resources :users, only: :show

  root 'map#index'
end
