import settings from "../settings";
import server from "./server"
import {
  Ad,
  ChannelRegister,
  Goal,
  GoalRegister,
  Indicator,
  IndicatorMonth,
  IndicatorShippingType,
  List,
  MeliToken,
  Order,
  SubscriptionRegister,
  SubscriptionRegisterRespoinse,
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


export const listTax = async (organizationID: string, externalItemID: string, taxID: string, offset: number) => {
  console.log(`fetching taxes`)

  const resp = await server.get<List<Tax>>(`/v1/taxes/${organizationID}?taxID=${taxID}&external_item_id=${externalItemID}&offset=${offset}&limit=10`)
  return resp.data
}

export const listAds = async (organizationID: string, offset: number, status: string, subStatus: string, logisticType: string, search: string) => {
  console.log('fetching ads')
  const resp = await server.get<List<Ad>>(`/v1/items/${organizationID}?offset=${offset}&status=${status}&sub_status=${subStatus}&logistic_type=${logisticType}&search=${search}&limit=10`)
  return resp.data
}

export const listOrders = async (organizationID: string, status: string, shippingType: string, start: string, end: string, search: string, offset: number) => {
  console.log(`fetching orders offset: ${offset} limit: 20 search ${search}`)
  let request = `/v1/orders/${organizationID}?start_date=${start}&end_date=${end}&offset=${offset}&limit=20&status=${status}&shipping_type=${shippingType}&search=${search}`
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
  console.log('payload', payload)
  const resp = await server.post<any>(`/v1/taxes`, payload)
  return resp.data
}

export const createSubscription = async (payload: SubscriptionRegister) => {
  const resp = await server.post<SubscriptionRegisterRespoinse>(`/v1/subscriptions`, payload)
  return resp.data
}

export const createGoal = async (payload: GoalRegister) => {
  const resp = await server.post<any>(`/v1/goals`, payload)
  return resp.data
}

export const getUser = async (userID: string) => {
  console.log('fetching get user')
  const resp = await server.get<User>(`/v1/users/${userID}`)
  return resp.data
}

export const deleteUser = async (userID: string) => {
  console.log('delete user')
  const resp = await server.patch<User>(`/v1/users/${userID}`)
  return resp.data
}

export const getTax = async (organizationID: string, taxID: string) => {
  console.log('fetching get tax', taxID)
  const resp = await server.get<Tax>(`/v1/taxes/${organizationID}/${taxID}`)
  return resp.data
}


export const getGoal = async (organizationID: string) => {
  console.log('fetching get goal')
  const resp = await server.get<Goal>(`/v1/goals/${organizationID}`)
  return resp.data
}

export const getAd = async (organizationID: string, itemID: string) => {
  console.log('fetching get item')
  const resp = await server.get<Ad>(`/v1/items/${organizationID}/${itemID}`)
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