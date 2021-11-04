class SessionController < ApplicationController

  def login 
    if current_user
      redirect_to home_url 
    end
  end 

  def create
    user = User.find_by_username(params[:username])
    if user && user.authenticate(params[:password])
      session[:user_id] = user.id 
      redirect_to home_url, notice: 'Logged In!'
    else
      respond_to do |format|
       format.html {redirect_to login_url, alert:'Email or Password is Invalid'}
      end
    end 
  end

  def logout
    session[:user_id] = nil
    redirect_to home_url, notice: 'Logged out!'
  end

  def signup
    if current_user 
      redirect_to home_url
    end
    @user = User.new
  end

  def users
    columns = params.require(:user).permit(:username, :password, :password_confirmation)
    @user = User.new(columns)
    respond_to do |format|
      if @user.save
        format.html { redirect_to login_url, notice: "account successfully created" }
        #format.json { render :show, status: :created, location: @user }
      else
        format.html { render :signup, status: :unprocessable_entity }
        #format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end 
end
