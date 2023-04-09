class Recording < ApplicationRecord

  has_one_attached :file

  before_validation(on: :create) do
    self.key = SecureRandom.urlsafe_base64(4)
  end

end
