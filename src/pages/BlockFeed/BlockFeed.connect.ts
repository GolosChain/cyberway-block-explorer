import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { last } from 'ramda';
// @ts-ignore
import ToastsManager from 'toasts-manager';

import {
  FETCH_BLOCKS,
  FETCH_BLOCKS_SUCCESS,
  FETCH_BLOCKS_ERROR,
  FETCH_NEW_BLOCKS_SUCCESS,
  CLEAR_FEED_BLOCKS,
  FETCH_NEW_BLOCKS,
} from '../../store/constants';
import { State } from '../../store';
import Connection from '../../utils/Connection';

import BlockFeed from './BlockFeed';
import { FiltersType } from '../../types';

export default connect(
  (state: State) => {
    const { items, isLoading, isEnd } = state.blocksFeed;

    const lastBlock = last(items);

    return {
      lastBlockNum: lastBlock ? lastBlock.blockNum : 0,
      isLoading,
      isEnd,
      blocks: items,
      filters: state.filters,
    };
  },
  {
    loadBlocks: ({
      fromBlockNum = undefined,
      code,
      action,
      nonEmpty,
    }: {
      fromBlockNum?: number;
      code?: string;
      action?: string;
      nonEmpty?: boolean;
    } = {}) => async (dispatch: Function) => {
      const params = {
        fromBlockNum,
        code,
        action,
        limit: 20,
        nonEmpty,
      };

      const meta = { ...params };

      dispatch({
        type: FETCH_BLOCKS,
        meta,
      });

      let results;

      try {
        results = await Connection.get().callApi('blocks.getBlockList', params);
      } catch (err) {
        console.error(err);
        ToastsManager.error(`Request failed: ${err.message}`);

        dispatch({
          type: FETCH_BLOCKS_ERROR,
          meta,
        });
        return;
      }

      dispatch({
        type: FETCH_BLOCKS_SUCCESS,
        payload: {
          blocks: results.blocks,
        },
        meta,
      });
    },
    loadNewBlocks: ({ code, action, nonEmpty }: FiltersType) => async (dispatch: Dispatch) => {
      const params = {
        code,
        action,
        limit: 5,
        nonEmpty,
      };

      const meta = { ...params };

      dispatch({
        type: FETCH_NEW_BLOCKS,
        meta,
      });

      const { blocks } = await Connection.get().callApi('blocks.getBlockList', params);

      dispatch({
        type: FETCH_NEW_BLOCKS_SUCCESS,
        payload: {
          blocks,
        },
        meta,
      });
    },
    clearData: () => ({
      type: CLEAR_FEED_BLOCKS,
    }),
  }
)(BlockFeed);
