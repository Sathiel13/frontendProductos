import axios from "./axios";

export const createOrderRequest = (orderData) => axios.post("/orders", orderData);

export const getMyOrdersRequest = () => axios.get("/orders");

export const getOrderByIdRequest = (id) => axios.get(`/orders/${id}`);

export const updateOrderStatusRequest = (id, status) =>
    axios.put(`/orders/${id}/status`, { status });

export const cancelOrderRequest = (id) => axios.put(`/orders/${id}/cancel`);