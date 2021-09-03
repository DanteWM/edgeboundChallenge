export interface IOrder {
    id?: string,
    orderid: string,
    status: string,
    description: string,
    trackingUrls?: Array<string>,
    trackingCodes?: Array<string>,
    timestamp: Date
}
