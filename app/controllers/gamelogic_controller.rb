class GamelogicController < ApplicationController
	def index 
		if params[:offline]
			offline_mode
		end 
	end

	private 
		def offline_mode  
			puts "now we are running in offline mode"
		end 
end

