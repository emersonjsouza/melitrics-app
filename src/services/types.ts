
export interface Organization {
  organization_id: string
  type: string
  has_channel: boolean
  name: string
}

export interface User {
  organizations: Organization[]
}

export interface Indicator {
  revenue: Number
  cost: Number
  tax: Number
  shipping_cost: Number
  sales_fee: Number
  ticket_ratio: Number
  net_income: Number
  amount_unit_sold: Number
  amount_sold: Number
  revenue_canceled: Number
  amount_canceled: Number
}

export interface IndicatorShippingType {
  shipping_type: "fulfillment" | "xd_drop_off" | "self_service"
  revenue: Number
  amount_unit_sold: Number
  amount_sold: Number
}

export interface IndicatorMonth {
  month: Number
  revenue: Number
}

export interface List<T> {
  total: number
  items: T[]
}

export interface Ad {
  id: string
  external_id: string
  sku: string
  title: string
  price: number
  base_price: number
  health: number
  logistic_type: "fulfillment" | "xd_drop_off" | "self_service"
  permalink: string
  thumbnail_link: string
  sold_quantity: number
  available_quantity: number
  status: 'active' | 'paused'
  sub_status: 'out_of_stock' | 'deleted'
  created_at: string
  update_at: string
}

export interface Order {
  external_id: string
  title: string
  unit_price: number
  revenue: number
  amount_unit: number
  cost: number
  tax: number
  sales_fee: number
  shipping_cost: number
  net_income: number
  sku: string
  status: "paid" | "cancelled"
  shipping_type: "fulfillment" | "xd_drop_off" | "self_service"
  created_at: string
}

export interface UserRegister {
  given_name: string
  family_name: string
  email: string
  password: string
  company_name: string
}

export interface ChannelRegister {
  organization_id: string
  marketplace_code: string
  external_id: string
  access_token: string
  refresh_token: string
}

export interface APIError extends Error {
  response?: {
    data?: {
      error: string
    }
  }
}

export interface MeliToken {
  access_token: string
  refresh_token: string
  user_id: number
  expires_in: number
}