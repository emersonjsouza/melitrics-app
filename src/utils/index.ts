export const shipping_type = {
  'fulfillment': 'FULL',
  'xd_drop_off': 'Agencia',
  'self_service': 'Flex'
}

export const CUSTOM_LOCALE = {
  monthNames: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ],
  dayNames: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui',
    'Sex', 'Sáb'],
  today: '',
  year: '',
}

export const formatToBRL = (number: number | undefined) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(number || 0);
}

export const deviceVersionControl = () => {
  
}