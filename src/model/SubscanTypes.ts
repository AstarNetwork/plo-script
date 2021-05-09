// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace SubscanApi {
  export type Module = 'parachain';
  export type Query = 'bids' | 'contributes';
  export type Response = {
    code: number;
    message: string;
    ttl: number;
    data: Data;
  };

  export type Data = {
    count: number;
    bids?: EventBids[];
    contributes?: EventContributes[];
    funds?: EventFunds[];
  };

  export type Event = EventBids | EventContributes | EventFunds;

  export type Pagination = {
    row: number;
    page: number;
    order?: string;
  };

  export type Payload = EventBidsPayload | EventFundsPayload | EventContributesPayload;

  export type EventBidsPayload = {
    auction_index?: number;
    bid_id?: string;
    fund_id?: string;
    para_id?: number;
    from_block?: number;
    to_block?: number;
    status?: number;
    source?: number;
    bidder?: string;
    from_history?: boolean;
  };

  export type EventBids = {
    bid_id: string;
    fund_id: string;
    auction_index: number;
    first_slot: number;
    last_slot: number;
    para_id: number;
    bidder_account: string;
    bidder_account_display: {
      address: string;
      display: string;
      judgements: Object | null;
      account_index: string;
      identity: boolean;
      parent: Object | null;
    };
    bid_count: number;
    amount: string;
    source: number;
    status: number;
    block_num: number;
    block_timestamp: number;
    extrinsic_index: string;
    event_index: string;
  };

  export type EventFundsPayload = {
    fund_id: string;
    bid_id: string;
    auction_index: string;
    para_id: number;
    from_block: number;
    to_block: number;
    status: number;
    from_history: boolean;
  };

  export type EventFunds = {
    fund_id: string;
    bid_id: string;
    para_id: number;
    first_slot: number;
    last_slot: number;
    auction_index: number;
    owner: string;
    cap: string;
    end_block: number;
    raised: string;
    balance: string;
    status: number;
    start_block: number;
    start_block_at: number;
    last_change_block: number;
    last_change_timestamp: number;
    extrinsic_index: string;
    owner_display: {
      address: string;
      display: string;
      judgements: Object | null;
      account_index: string;
      identity: boolean;
      parent: Object | null;
    };
  };

  export type EventContributesPayload = {
    fund_id?: string;
  };

  export type EventContributes = {
    ID: number;
    fund_id: string;
    para_id: number;
    who: string;
    who_display: {
      address: string;
      display: string;
      judgements: Object | null;
      account_index: string;
      identity: number;
      parent: Object | null;
    };
    contributed: string;
    block_num: number;
    block_timestamp: number;
    extrinsic_index: string;
    status: number;
    memo: string;
  };
}
