import axios from './axios';

export const getProductsRequest = () => axios.get('/products');

export const getProductRequest = (id) => axios.get('/products/' + id);

export const createProductRequest = (product) => axios.post('/products', product, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});

export const deleteProductRequest = (id) => axios.delete('/products/' + id);

export const updateProductRequest = (id, product) => axios.put('/products/' + id, product, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});
