import server from "./server"

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
  logistic_type: string
  permalink: string
  thumbnail_link: string
  sold_quantity: number
  available_quantity: number
  status: string
  sub_status: string
  created_at: string
  update_at: string
}

export interface Order {
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

export interface User {
  organization_id: string
}

export const getIndicators = async (organizationID: string, start: string, end: string) => {
  const resp = await server.get<Indicator>(`/v1/indicators/${organizationID}?start_date=${start}&end_date=${end}`)
  return resp.data
}

export const getIndicatorsByShippingType = async (organizationID: string, start: string, end: string) => {
  const resp = await server.get<IndicatorShippingType[]>(`/v1/indicators-shipping-type/${organizationID}?start_date=${start}&end_date=${end}`)
  return resp.data
}

export const getIndicatorsByMonth = async (organizationID: string) => {
  const resp = await server.get<IndicatorMonth[]>(`/v1/indicators-month/${organizationID}`)
  return resp.data
}

export const listAds = async (organizationID: string, offset: number) => {
  const resp = await server.get<List<Ad>>(`/v1/items/${organizationID}?offset=${offset}`)
  return resp.data
}

export const listOrders = async (organizationID: string, start: string, end: string, offset: number) => {
  const resp = await server.get<List<Order>>(`/v1/orders/${organizationID}?start_date=${start}&end_date=${end}&offset=${offset}&limit=20`)
  return resp.data
}

export const getUser = async (userID: string) => {
  const resp = await server.get<User>(`/v1/users/${userID}`)
  return resp.data
}