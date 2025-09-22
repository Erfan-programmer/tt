export type datas = {

    title:string,
    mobileTitle?:string,
    mobileSubTitle?:string,
    subTitle?:string
}
export type DatasPage ={
    register:datas
}



export type PaymentData = {
  wallet_address: string;
  currency_amount: number;
  usd_amount: number;
  billing_currency: string;
  invoice_number: number;
  qr: string;
};
