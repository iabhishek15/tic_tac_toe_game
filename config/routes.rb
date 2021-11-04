Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'home#index', as:'home'
  get 'session/login' , as:'login'
  get 'session/logout', as:'logout'
  get 'session/signup', as:'signup'
  post 'session/users', as: 'users'
end
