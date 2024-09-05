export const shipping_type = {
  'fulfillment': 'FULL',
  'xd_drop_off': 'Agencia',
  'self_service': 'Flex'
}

export const formatToBRL = (number: number | undefined) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(number || 0);
}