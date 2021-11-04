class User < ApplicationRecord
	has_secure_password	

	validates :username, presence: true, uniqueness: true

	puts "is this running"
end
