import { call, put, all, takeLatest } from 'redux-saga/effects';
import api from '../../../services/api';

import { addToCartSuccess } from './actions';

// * é um generator, uma função do Javascript equivalente ao async
function* addToCart({ id }) {
    // yield equivalente ao await
    const response = yield call(api.get, `/products/${id}`);

    yield put(addToCartSuccess(response.data));
}

// takeLatest executa o ultimo clique do usuario
export default all([takeLatest('@cart/ADD_REQUEST', addToCart)]);
