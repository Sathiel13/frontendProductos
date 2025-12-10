import { createContext, useContext, useState } from "react";
import {
    createOrderRequest,
    getMyOrdersRequest,
    getOrderByIdRequest,
    cancelOrderRequest,
} from "../api/orders";

const OrderContext = createContext();

export const useOrders = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error("useOrders debe estar dentro de OrderProvider");
    }
    return context;
};

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);

    const createOrder = async (orderData) => {
        try {
            setLoading(true);
            setErrors([]);
            const res = await createOrderRequest(orderData);
            setOrders((prev) => [res.data, ...prev]);
            return res.data;
        } catch (error) {
            console.log(error);
            const errorMessages = error.response?.data?.message || ["Error al crear el pedido"];
            setErrors(Array.isArray(errorMessages) ? errorMessages : [errorMessages]);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getMyOrders = async () => {
        try {
            setLoading(true);
            const res = await getMyOrdersRequest();
            setOrders(res.data);
        } catch (error) {
            console.log(error);
            setErrors(["Error al obtener los pedidos"]);
        } finally {
            setLoading(false);
        }
    };

    const getOrderById = async (id) => {
        try {
            setLoading(true);
            const res = await getOrderByIdRequest(id);
            setCurrentOrder(res.data);
            return res.data;
        } catch (error) {
            console.log(error);
            setErrors(["Error al obtener el pedido"]);
        } finally {
            setLoading(false);
        }
    };

    const cancelOrder = async (id) => {
        try {
            setLoading(true);
            const res = await cancelOrderRequest(id);
            setOrders((prev) =>
                prev.map((order) => (order._id === id ? res.data : order))
            );
            return res.data;
        } catch (error) {
            console.log(error);
            const errorMessages = error.response?.data?.message || ["Error al cancelar el pedido"];
            setErrors(Array.isArray(errorMessages) ? errorMessages : [errorMessages]);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const clearErrors = () => setErrors([]);

    return (
        <OrderContext.Provider
            value={{
                orders,
                currentOrder,
                loading,
                errors,
                createOrder,
                getMyOrders,
                getOrderById,
                cancelOrder,
                clearErrors,
            }}
        >
            {children}
        </OrderContext.Provider>
    );
};