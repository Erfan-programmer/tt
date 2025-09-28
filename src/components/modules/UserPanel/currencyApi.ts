import { apiRequest } from '@/libs/api';

export interface CurrencyPair {
  flag_1: string;
  flag_2: string;
  value: number;
}

export interface CurrencyResponse {
  status: string;
  message: string;
  data: {
    ok: boolean;
    body: {
      [key: string]: CurrencyPair;
    };
  };
}

export const currencyApi = {
  getCurrencies: async (): Promise<CurrencyResponse> => {
    const res = await apiRequest<CurrencyResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/currencies`,
      'GET',
      undefined,
    );

    if (!res.success) {
      throw new Error(res.error?.message || 'Failed to fetch currencies');
    }

    return res.data;
  },
};
