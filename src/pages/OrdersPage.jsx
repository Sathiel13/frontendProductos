import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOrders } from "../context/OrderContext";
import {
    IoTime,
    IoCheckmarkCircle,
    IoSync,
    IoAirplane,
    IoCheckmarkDone,
    IoCloseCircle,
    IoCart,
    IoCard,
    IoStorefront,
    IoLocation,
    IoMail,
    IoCall,
} from "react-icons/io5";

const statusConfig = {
    pendiente: {
        icon: IoTime,
        color: "text-yellow-400",
        bg: "bg-yellow-500/20",
        label: "Pendiente",
    },
    confirmado: {
        icon: IoCheckmarkCircle,
        color: "text-blue-400",
        bg: "bg-blue-500/20",
        label: "Confirmado",
    },
    en_proceso: {
        icon: IoSync,
        color: "text-purple-400",
        bg: "bg-purple-500/20",
        label: "En Proceso",
    },
    enviado: {
        icon: IoAirplane,
        color: "text-cyan-400",
        bg: "bg-cyan-500/20",
        label: "Enviado",
    },
    entregado: {
        icon: IoCheckmarkDone,
        color: "text-emerald-400",
        bg: "bg-emerald-500/20",
        label: "Entregado",
    },
    cancelado: {
        icon: IoCloseCircle,
        color: "text-red-400",
        bg: "bg-red-500/20",
        label: "Cancelado",
    },
};

function OrdersPage() {
    const { orders, loading, getMyOrders, cancelOrder } = useOrders();
    const navigate = useNavigate();

    useEffect(() => {
        getMyOrders();
    }, []);

    const handleCancelOrder = async (orderId) => {
        if (window.confirm("¿Estás seguro de que quieres cancelar este pedido?")) {
            try {
                await cancelOrder(orderId);
            } catch (error) {
                console.log(error);
            }
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("es-MX", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Mis Pedidos</h1>

                {orders.length === 0 ? (
                    <div className="bg-zinc-800 p-12 rounded-2xl text-center">
                        <IoCart size={80} className="text-gray-600 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-white mb-2">No tienes pedidos aún</h2>
                        <p className="text-gray-400 mb-6">¡Comienza a comprar para ver tus pedidos aquí!</p>
                        <button
                            onClick={() => navigate("/products")}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                        >
                            Ver Productos
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => {
                            const status = statusConfig[order.status];
                            const StatusIcon = status.icon;
                            const PaymentIcon = order.paymentMethod === "card" ? IoCard : IoStorefront;

                            return (
                                <div key={order._id} className="bg-zinc-800 rounded-2xl overflow-hidden">
                                    {/* Header */}
                                    <div className="bg-zinc-700 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                                        <div>
                                            <p className="text-gray-400 text-sm">Pedido</p>
                                            <p className="text-white font-mono font-bold">{order._id}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Fecha</p>
                                            <p className="text-white">{formatDate(order.createdAt)}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Total</p>
                                            <p className="text-emerald-400 font-bold text-lg">
                                                ${order.totalPrice.toFixed(2)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Pago</p>
                                            <div className="flex items-center gap-2 text-white">
                                                <PaymentIcon size={18} />
                                                <span className="text-sm">
                          {order.paymentMethod === "card" ? "Tarjeta" : "Tienda"}
                        </span>
                                            </div>
                                        </div>
                                        <div className={`px-4 py-2 rounded-full ${status.bg} flex items-center gap-2`}>
                                            <StatusIcon size={20} className={status.color} />
                                            <span className={`font-semibold ${status.color}`}>{status.label}</span>
                                        </div>
                                    </div>

                                    {/* Body */}
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Productos */}
                                            <div>
                                                <h3 className="text-white font-semibold mb-3">Productos</h3>
                                                <div className="space-y-2">
                                                    {order.items.map((item, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex justify-between items-center bg-zinc-700 p-3 rounded-lg"
                                                        >
                                                            <div>
                                                                <p className="text-white">{item.name}</p>
                                                                <p className="text-gray-400 text-sm">
                                                                    Cantidad: {item.quantity} × ${item.price.toFixed(2)}
                                                                </p>
                                                            </div>
                                                            <p className="text-emerald-400 font-semibold">
                                                                ${(item.quantity * item.price).toFixed(2)}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Dirección y Pago */}
                                            <div className="space-y-4">
                                                <div>
                                                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                                                        <IoLocation size={20} />
                                                        Dirección de Envío
                                                    </h3>
                                                    <div className="bg-zinc-700 p-4 rounded-lg space-y-1">
                                                        <p className="text-white font-medium">
                                                            {order.shippingAddress.fullName}
                                                        </p>
                                                        <p className="text-gray-400 text-sm flex items-center gap-2">
                                                            <IoMail size={14} /> {order.shippingAddress.email}
                                                        </p>
                                                        <p className="text-gray-400 text-sm flex items-center gap-2">
                                                            <IoCall size={14} /> {order.shippingAddress.phone}
                                                        </p>
                                                        <div className="pt-2 mt-2 border-t border-zinc-600">
                                                            <p className="text-gray-400 text-sm">{order.shippingAddress.address}</p>
                                                            <p className="text-gray-400 text-sm">
                                                                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                                                            </p>
                                                            <p className="text-gray-400 text-sm">{order.shippingAddress.country}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Información de Pago */}
                                                <div>
                                                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                                                        <PaymentIcon size={20} />
                                                        Método de Pago
                                                    </h3>
                                                    <div className="bg-zinc-700 p-4 rounded-lg">
                                                        {order.paymentMethod === "card" ? (
                                                            <div>
                                                                <p className="text-white">Tarjeta de Crédito/Débito</p>
                                                                {order.paymentInfo?.cardLastDigits && (
                                                                    <p className="text-gray-400 text-sm font-mono">
                                                                        •••• •••• •••• {order.paymentInfo.cardLastDigits}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <p className="text-white">Pago en Tienda</p>
                                                                <p className="text-gray-400 text-sm">Pago al recibir el pedido</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Notas */}
                                        {order.notes && (
                                            <div className="mt-4">
                                                <h3 className="text-white font-semibold mb-2">Notas</h3>
                                                <p className="text-gray-400 bg-zinc-700 p-3 rounded-lg">{order.notes}</p>
                                            </div>
                                        )}

                                        {/* Acciones */}
                                        <div className="mt-6 flex gap-3 justify-end">
                                            {(order.status === "pendiente" || order.status === "confirmado") && (
                                                <button
                                                    onClick={() => handleCancelOrder(order._id)}
                                                    className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
                                                >
                                                    Cancelar Pedido
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrdersPage;