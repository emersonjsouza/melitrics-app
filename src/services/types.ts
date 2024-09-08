
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
  revenue: number
  cost: number
  tax: number
  shipping_cost: number
  sales_fee: number
  ticket_ratio: number
  net_income: number
  amount_unit_sold: number
  amount_sold: number
  revenue_canceled: number
  amount_canceled: number
}

export interface IndicatorShippingType {
  shipping_type: "fulfillment" | "xd_drop_off" | "self_service"
  revenue: number
  amount_unit_sold: number
  amount_sold: number
}

export interface IndicatorMonth {
  month: number
  revenue: number
}

export interface List<T> {
  total: number
  items: T[]
}

export interface Ad {
  id: string
  tax_id: string
  external_id: string
  sku: string
  title: string
  price: number
  net_income: number
  base_price: number
  cost: number
  sales_fee: number
  shipping_cost: number
  tax_rate: number
  health: number
  logistic_type: "fulfillment" | "xd_drop_off" | "self_service"
  permalink: string
  thumbnail_link: string
  sold_quantity: number
  available_quantity: number
  catalog_enabled: boolean
  flex_enabled: boolean
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

export interface TaxRegister {
  organization_id: string
  sku: string
  cost: number | null
  tax_rate: number | null
  item_id?: string
}

export interface Tax {
  id: string
  sku: string
  cost: number | null
  tax_rate: number | null
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