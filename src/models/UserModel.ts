export enum BvnVerifiedOptions {
  'verified',
  'unverified'
}

export enum IdVerifiedOptions {
  'verified',
  'pending',
  'declined',
  'unverified',
}

export enum AddressVerifiedOptions {
  'verified',
  'pending',
  'declined',
  'unverified',
}

export enum ZohoVerifiedOptions {
  'verified',
  'pending',
  'declined',
  'unverified',
}

export enum GenderOptions {
  'male',
  'female',
}

export enum YesNoOptions {
  'yes',
  'no',
}

export type UserModel = {
  id: string,
  site_id: number,
  name: string,
  email: string,
  email_verified_at: Date,
  password: string,
  remember_token: string,
  mobile_number: number,
  mobile_number_verified_at: Date,
  country: string,
  date_of_birth: string,
  gender: GenderOptions,
  withdraw_otp_verification_required: YesNoOptions,
  is_suspended: YesNoOptions,
  bvn_verify_status: BvnVerifiedOptions,
  bvn_number: string,
  bvn_otp: string,
  bvn_response: string,
  id_proof_verify_status: IdVerifiedOptions,
  id_proof: string,
  id_proof_with_selfie: string,
  address_proof_verify_status: AddressVerifiedOptions,
  address_proof: string,
  zoho_verify_status: ZohoVerifiedOptions,
  mac_number: string,
  mac_ref: string,
  bac_number: string,
  bac_email: string,
  bac_btc_addresses: string,
  bac_api_key: string,
  bac_private_key: string,
  created_at: Date,
  updated_at: string,
};
