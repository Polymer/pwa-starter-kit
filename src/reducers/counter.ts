/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { Reducer } from 'redux';
import { INCREMENT, DECREMENT } from '../actions/counter.js';
import { RootAction } from '../store.js';

export interface CounterState {
  clicks: number;
  value: number;
}

const INITIAL_STATE: CounterState = {
  clicks: 0,
  value: 0
};

const counter: Reducer<CounterState, RootAction> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case INCREMENT:
      return {
        clicks: state.clicks + 1,
        value: state.value + 1
      };
    case DECREMENT:
      return {
        clicks: state.clicks + 1,
        value: state.value - 1
      };
    default:
      return state;
  }
};

export default counter;
