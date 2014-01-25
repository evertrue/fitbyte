class User < ActiveRecord::Base
  devise :trackable
end
