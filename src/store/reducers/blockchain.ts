import { FETCH_BLOCK_CHAIN_INFO_SUCCESS } from '../constants';
import { Action } from '../../types';

export type State = {
  lastBlockId: string | null;
  lastBlockNum: number | null;
  irreversibleBlockNum: number | null;
  transactionsCount: number | null;
  accountsCount: number | null;
  blockchainHost: string | null;
};

const initialState: State = {
  lastBlockId: null,
  lastBlockNum: null,
  irreversibleBlockNum: null,
  accountsCount: 0,
  transactionsCount: 0,
  blockchainHost: null,
};

export default function(state = initialState, { type, payload }: Action): State {
  switch (type) {
    case FETCH_BLOCK_CHAIN_INFO_SUCCESS:
      return {
        lastBlockId: payload.lastBlockId,
        lastBlockNum: payload.lastBlockNum,
        irreversibleBlockNum: payload.irreversibleBlockNum,
        accountsCount: payload.accountsCount,
        transactionsCount: payload.transactionsCount,
        blockchainHost: payload.blockchainHost,
      };
    default:
      return state;
  }
}
