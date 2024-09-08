import settings from "../settings";
import server from "./server"
import {
  Ad,
  ChannelRegister,
  Indicator,
  IndicatorMonth,
  IndicatorShippingType,
  List,
  MeliToken,
  Order,
  Tax,
  TaxRegister,
  User,
  UserRegister
} from "./types"
import axios from 'axios';

export const getIndicators = async (organizationID: string, start: string, end: string) => {
  console.log('fetching indicators')
  const resp = await server.get<Indicator>(`/v1/indicators/${organizationID}?start_date=${start}&end_date=${end}`)
  return resp.data
}

export const getIndicatorsByShippingType = async (organizationID: string, start: string, end: string) => {
  console.log('fetching indicator by shipping type')
  const resp = await server.get<IndicatorShippingType[]>(`/v1/indicators-shipping-type/${organizationID}?start_date=${start}&end_date=${end}`)
  return resp.data
}

export const getIndicatorsByMonth = async (organizationID: string) => {
  console.log('fetching indicator by month')
  const resp = await server.get<IndicatorMonth[]>(`/v1/indicators-month/${organizationID}`)
  return resp.data
}

export const listAds = async (organizationID: string, offset: number) => {
  console.log('fetching ads')
  const resp = await server.get<List<Ad>>(`/v1/items/${organizationID}?offset=${offset}`)
  return resp.data
}

export const listOrders = async (organizationID: string, status: string, shippingType: string, start: string, end: string, offset: number) => {
  console.log('fetching orders')
  let request = `/v1/orders/${organizationID}?start_date=${start}&end_date=${end}&offset=${offset}&limit=20&status=${status}&shipping_type=${shippingType}`
  const resp = await server.get<List<Order>>(request)
  return resp.data
}

export const signUp = async (payload: UserRegister) => {
  const resp = await server.post<any>(`/signup`, payload)
  return resp.data
}

export const createChannel = async (payload: ChannelRegister) => {
  const resp = await server.post<any>(`/v1/channel`, payload)
  return resp.data
}

export const createTax = async (payload: TaxRegister) => {
  const resp = await server.post<any>(`/v1/tax`, payload)
  return resp.data
}

export const getUser = async (userID: string) => {
  console.log('fetching get user')
  const resp = await server.get<User>(`/v1/users/${userID}`)
  return resp.data
}

export const getTax = async (organizationID: string, taxID: string) => {
  console.log('fetching get tax')
  const resp = await server.get<Tax>(`/v1/taxes/${organizationID}/${taxID}`)
  return resp.data
}

export const getMeliToken = async (code: string, callbackUrl: string) => {
  const api = axios.create({
    timeout: 10000,
    baseURL: `https://api.mercadolibre.com`,
  });

  const request: any = {
    grant_type: "authorization_code",
    code: code,
    scope: "offline_access read write",
    redirect_uri: callbackUrl,
    client_id: settings.MELI_AUTH_CLIENT_ID,
    client_secret: settings.MELI_AUTH_SECRET_KEY,
  }

  const formBody = Object.keys(request).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(request[key])).join('&');

  const { data } = await api.post<MeliToken>('/oauth/token', formBody, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });

  return data;
}