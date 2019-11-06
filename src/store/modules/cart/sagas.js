import { call, select, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import api from '../../../services/api';
import { formatPrice } from '../../../util/format';

import { addToCartSuccess, updateAmountSuccess } from './actions';

// * é um generator, uma função do Javascript equivalente ao async
function* addToCart({ id }) {
    const productExits = yield select(state =>
        state.cart.find(p => p.id === id)
    );

    const stock = yield call(api.get, `stock/${id}`);

    const stockAmount = stock.data.amount;
    const currentAmount = productExits ? productExits.amount : 0;

    const amount = currentAmount + 1;

    if (amount > stockAmount) {
        toast.error('Quantidade solicitada fora de estoque');
        return;
    }

    if (productExits) {
        yield put(updateAmountSuccess(id, amount));
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

function* updateAmount({ id, amount }) {
    if (amount <= 0) return;

    const stock = yield call(api.get, `stock/${id}`);
    const stockAmount = stock.data.amount;

    if (amount > stockAmount) {
        toast.error('Quantidade solicitada fora de estoque');
        return;
    }

    yield put(updateAmountSuccess(id, amount));
}

// takeLatest executa o ultimo clique do usuario
export default all([
    takeLatest('@cart/ADD_REQUEST', addToCart),
    takeLatest('@cart/UPDATE_AMOUNT_REQUEST', updateAmount),
]);
