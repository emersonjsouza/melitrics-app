import server from "./server"
import {
  Ad,
  Indicator,
  IndicatorMonth,
  IndicatorShippingType,
  List,
  Order,
  User,
  UserRegister
} from "./types"

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

export const signUp = async (payload: UserRegister) => {
  const resp = await server.post<any>(`/signup`, payload)
  return resp.data
}

export const getUser = async (userID: string) => {
  const resp = await server.get<User>(`/v1/users/${userID}`)
  return resp.data
}