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