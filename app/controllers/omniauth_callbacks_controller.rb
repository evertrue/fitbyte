class OmniauthCallbacksController < ApplicationController
  def fitbit
    user = User.find_or_initialize_by fitbit_uid: fitbit_uid do |u|
      u.email = fitbit_uid
      u.name = omniauth.info.name
    end

    user.update fitbit_credentials

    sign_in_and_redirect user, event: :authentication
  end

  private

  def omniauth
    Hashie::Mash.new env['omniauth.auth']
  end

  def fitbit_uid
    omniauth.uid
  end

  def fitbit_credentials
    { fitbit_token: omniauth.credentials_.token,
      fitbit_secret: omniauth.credentials_.secret }
  end
end
