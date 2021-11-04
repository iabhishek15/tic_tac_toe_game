Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'home#index', as:'home'
  get 'session/login' , to:'session#login', as:'login'
  post 'session/create' , to:'session#create', as:'login_create'
  get 'session/logout', as:'logout'
  get 'session/signup', as:'signup'
  post 'session/users', as:'users'
  post 'gamelogic', to:'gamelogic#index', as:'gamelogic'
end
