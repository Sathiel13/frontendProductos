import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
import { createProductRequest, getProductsRequest, deleteProductRequest, getProductRequest, updateProductRequest } from "../api/products";


const ProductsContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useProducts = () => {
    const context = useContext(ProductsContext);

    if (!context) {
        throw new Error('useProducts debe estar definido en un contexto');
    }
    return context;
};

export function ProductsProvider({ children }) {
    const [products, setProducts] = useState([]);

    const createProduct = async (product) => {
        try {
            const res = await createProductRequest(product);
            setProducts([...products, res.data]);
        } catch (error) {
            console.log(error);
        }
    };

    const getProducts = async () => {
        try {
            const res = await getProductsRequest();
            setProducts(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const deleteProduct = async (id) => {
        try {
            const res = await deleteProductRequest(id);
            if (res.status === 200)
                setProducts(products.filter(product => product._id !== id));
        } catch (error) {
            console.log(error);
        }
    };

    const getProduct = async (id) => {
        try {
            const res = await getProductRequest(id);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const updateProduct = async (id, product) => {
        try {
            const res = await updateProductRequest(id, product);
            // Actualizar el producto en el estado local
            setProducts(products.map(p => p._id === id ? res.data : p));
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <ProductsContext.Provider value={{
            products,
            createProduct,
            getProducts,
            deleteProduct,
            getProduct,
            updateProduct
        }}>
            {children}
        </ProductsContext.Provider>
    );
}

ProductsProvider.propTypes = {
    children: PropTypes.any,
};