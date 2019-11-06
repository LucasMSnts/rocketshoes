import { call, select, put, all, takeLatest } from 'redux-saga/effects';
import api from '../../../services/api';
import { formatPrice } from '../../../util/format';

import { addToCartSuccess, updateAmount } from './actions';

// * é um generator, uma função do Javascript equivalente ao async
function* addToCart({ id }) {
    const productExits = yield select(state =>
        state.cart.find(p => p.id === id)
    );

    if (productExits) {
        const amount = productExits.amount + 1;

        yield put(updateAmount(id, amount));
    } else {
        // yield equivalente ao await
        const response = yield call(api.get, `/products/${id}`);

        const data = {
            ...response.data,
            amount: 1,
            priceFormatted: formatPrice(response.data.price),
        };

        yield put(addToCartSuccess(data));
    }
}

// takeLatest executa o ultimo clique do usuario
export default all([takeLatest('@cart/ADD_REQUEST', addToCart)]);
