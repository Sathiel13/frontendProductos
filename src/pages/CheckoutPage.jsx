import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext";
import {
    IoLocation,
    IoMail,
    IoCall,
    IoPerson,
    IoCard,
    IoArrowBack,
    IoArrowForward,
    IoCheckmarkCircle,
    IoCart,
    IoDocumentText,
    IoCheckmark,
    IoStorefront,
    IoCash,
    IoLockClosed,
} from "react-icons/io5";

function CheckoutPage() {
    const { cartItems, getCartTotal, clearCart } = useCart();
    const { createOrder, errors: orderErrors } = useOrders();
    const { user } = useAuth();
    const navigate = useNavigate();

    // Estados para las etapas
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [createdOrder, setCreatedOrder] = useState(null);
    const [formData, setFormData] = useState({});
    const [paymentMethod, setPaymentMethod] = useState("store"); // "store" o "card"

    const {
        register,
        handleSubmit,
        formState: { errors },
        trigger,
        getValues,
    } = useForm({
        defaultValues: {
            fullName: user?.username || "",
            email: user?.email || "",
            country: "México",
        },
    });

    // Validar y avanzar a siguiente etapa
    const nextStep = async () => {
        let fieldsToValidate = [];

        if (currentStep === 1) {
            // Solo revisar carrito
            if (cartItems.length === 0) return;
            setCurrentStep(2);
            return;
        }

        if (currentStep === 2) {
            fieldsToValidate = ["fullName", "email", "phone", "address", "city", "postalCode"];
            const isValid = await trigger(fieldsToValidate);
            if (isValid) {
                setFormData(getValues());
                setCurrentStep(3);
            }
        }

        if (currentStep === 3) {
            // Validar datos de pago si es con tarjeta
            if (paymentMethod === "card") {
                fieldsToValidate = ["cardNumber", "cardName", "cardExpiry", "cardCvv"];
                const isValid = await trigger(fieldsToValidate);
                if (isValid) {
                    setCurrentStep(4);
                }
            } else {
                setCurrentStep(4);
            }
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Enviar pedido
    const onSubmit = handleSubmit(async (data) => {
        if (cartItems.length === 0) return;

        setIsSubmitting(true);
        try {
            const orderData = {
                items: cartItems.map((item) => ({
                    product: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                })),
                shippingAddress: {
                    fullName: data.fullName,
                    email: data.email,
                    phone: data.phone,
                    address: data.address,
                    city: data.city,
                    postalCode: data.postalCode,
                    country: data.country || "México",
                },
                totalPrice: getCartTotal(),
                notes: data.notes,
                paymentMethod: paymentMethod,
                // Si es con tarjeta, agregar últimos 4 dígitos (para mostrar en el pedido)
                paymentInfo: paymentMethod === "card" ? {
                    cardLastDigits: data.cardNumber.slice(-4)
                } : null
            };

            const order = await createOrder(orderData);
            setCreatedOrder(order);
            setOrderSuccess(true);
            clearCart();
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    });

    // Componente de pasos/stepper
    const Stepper = () => (
        <div className="flex items-center justify-center mb-8 overflow-x-auto">
            <div className="flex items-center min-w-max px-4">
                {[
                    { num: 1, label: "Carrito", icon: IoCart },
                    { num: 2, label: "Envío", icon: IoLocation },
                    { num: 3, label: "Pago", icon: IoCard },
                    { num: 4, label: "Confirmar", icon: IoDocumentText },
                ].map((step, index) => (
                    <div key={step.num} className="flex items-center">
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                                    currentStep >= step.num
                                        ? "bg-emerald-600 text-white"
                                        : "bg-zinc-700 text-gray-400"
                                }`}
                            >
                                {currentStep > step.num ? (
                                    <IoCheckmark size={24} />
                                ) : (
                                    <step.icon size={24} />
                                )}
                            </div>
                            <span
                                className={`mt-2 text-sm font-medium ${
                                    currentStep >= step.num ? "text-emerald-400" : "text-gray-500"
                                }`}
                            >
                                {step.label}
                            </span>
                        </div>
                        {index < 3 && (
                            <div
                                className={`w-16 md:w-24 h-1 mx-2 rounded transition-all duration-300 ${
                                    currentStep > step.num ? "bg-emerald-600" : "bg-zinc-700"
                                }`}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    // Pantalla de éxito
    if (orderSuccess && createdOrder) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-zinc-800 p-8 rounded-2xl max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                        <IoCheckmarkCircle size={50} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">¡Pedido Realizado!</h1>
                    <p className="text-gray-400 mb-6">
                        Tu pedido ha sido creado exitosamente. Te enviaremos un correo con los detalles.
                    </p>
                    <div className="bg-zinc-700 p-4 rounded-lg mb-4">
                        <p className="text-sm text-gray-400">Número de pedido:</p>
                        <p className="text-emerald-400 font-mono font-bold text-lg">{createdOrder._id}</p>
                    </div>
                    <div className="bg-zinc-700 p-4 rounded-lg mb-4">
                        <p className="text-sm text-gray-400">Método de pago:</p>
                        <p className="text-white font-semibold">
                            {paymentMethod === "card" ? "💳 Tarjeta de Crédito/Débito" : "🏪 Pago en Tienda"}
                        </p>
                    </div>
                    <div className="bg-zinc-700 p-4 rounded-lg mb-6">
                        <p className="text-sm text-gray-400">Estado:</p>
                        <span className="inline-block mt-1 px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-semibold">
                            ⏳ Pendiente
                        </span>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate("/orders")}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                        >
                            Ver Mis Pedidos
                        </button>
                        <button
                            onClick={() => navigate("/products")}
                            className="flex-1 bg-zinc-600 hover:bg-zinc-500 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                        >
                            Seguir Comprando
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Carrito vacío
    if (cartItems.length === 0 && currentStep === 1) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-zinc-800 p-8 rounded-2xl max-w-md w-full text-center">
                    <IoCart size={80} className="text-gray-600 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-white mb-4">Carrito Vacío</h1>
                    <p className="text-gray-400 mb-6">No tienes productos en tu carrito.</p>
                    <button
                        onClick={() => navigate("/products")}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                        Ver Productos
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
                >
                    <IoArrowBack size={20} />
                    Volver
                </button>

                <h1 className="text-3xl font-bold text-white mb-6 text-center">Finalizar Compra</h1>

                {/* Stepper */}
                <Stepper />

                {orderErrors.length > 0 && (
                    <div className="bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-lg mb-6">
                        {orderErrors.map((error, i) => (
                            <p key={i}>{error}</p>
                        ))}
                    </div>
                )}

                <form onSubmit={onSubmit}>
                    {/* ETAPA 1: Revisar Carrito */}
                    {currentStep === 1 && (
                        <div className="bg-zinc-800 p-6 rounded-2xl animate-fadeIn">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <IoCart size={24} className="text-emerald-400" />
                                Revisa tu Carrito
                            </h2>

                            <div className="space-y-4 mb-6">
                                {cartItems.map((item) => (
                                    <div
                                        key={item._id}
                                        className="flex items-center justify-between bg-zinc-700 p-4 rounded-lg"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-zinc-600 rounded-lg flex items-center justify-center overflow-hidden">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-2xl">📦</span>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-white font-semibold">{item.name}</h3>
                                                <p className="text-gray-400 text-sm">
                                                    Cantidad: {item.quantity}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-emerald-400 font-bold text-lg">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-zinc-700 pt-4">
                                <div className="flex justify-between items-center text-xl font-bold">
                                    <span className="text-white">Total:</span>
                                    <span className="text-emerald-400">${getCartTotal().toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ETAPA 2: Información de Envío */}
                    {currentStep === 2 && (
                        <div className="bg-zinc-800 p-6 rounded-2xl animate-fadeIn">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <IoLocation size={24} className="text-emerald-400" />
                                Información de Envío
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-400 mb-2 flex items-center gap-2">
                                        <IoPerson size={18} />
                                        Nombre Completo *
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full bg-zinc-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                        placeholder="Tu nombre completo"
                                        {...register("fullName", { required: "El nombre es requerido" })}
                                    />
                                    {errors.fullName && (
                                        <p className="text-red-400 text-sm mt-1">{errors.fullName.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-400 mb-2 flex items-center gap-2">
                                        <IoMail size={18} />
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        className="w-full bg-zinc-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                        placeholder="tu@email.com"
                                        {...register("email", {
                                            required: "El email es requerido",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Email no válido",
                                            },
                                        })}
                                    />
                                    {errors.email && (
                                        <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-400 mb-2 flex items-center gap-2">
                                        <IoCall size={18} />
                                        Teléfono *
                                    </label>
                                    <input
                                        type="tel"
                                        className="w-full bg-zinc-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                        placeholder="+52 123 456 7890"
                                        {...register("phone", { required: "El teléfono es requerido" })}
                                    />
                                    {errors.phone && (
                                        <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-400 mb-2">Ciudad *</label>
                                    <input
                                        type="text"
                                        className="w-full bg-zinc-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                        placeholder="Tu ciudad"
                                        {...register("city", { required: "La ciudad es requerida" })}
                                    />
                                    {errors.city && (
                                        <p className="text-red-400 text-sm mt-1">{errors.city.message}</p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-gray-400 mb-2">Dirección *</label>
                                    <input
                                        type="text"
                                        className="w-full bg-zinc-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                        placeholder="Calle, número, colonia..."
                                        {...register("address", { required: "La dirección es requerida" })}
                                    />
                                    {errors.address && (
                                        <p className="text-red-400 text-sm mt-1">{errors.address.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-400 mb-2">Código Postal *</label>
                                    <input
                                        type="text"
                                        className="w-full bg-zinc-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                        placeholder="12345"
                                        {...register("postalCode", { required: "El código postal es requerido" })}
                                    />
                                    {errors.postalCode && (
                                        <p className="text-red-400 text-sm mt-1">{errors.postalCode.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-400 mb-2">País</label>
                                    <input
                                        type="text"
                                        className="w-full bg-zinc-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                        placeholder="México"
                                        {...register("country")}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-gray-400 mb-2">Notas del pedido (opcional)</label>
                                    <textarea
                                        className="w-full bg-zinc-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
                                        rows="3"
                                        placeholder="Instrucciones especiales para la entrega..."
                                        {...register("notes")}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ETAPA 3: Método de Pago */}
                    {currentStep === 3 && (
                        <div className="bg-zinc-800 p-6 rounded-2xl animate-fadeIn">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <IoCard size={24} className="text-emerald-400" />
                                Método de Pago
                            </h2>

                            {/* Selector de método de pago */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod("store")}
                                    className={`p-6 rounded-xl border-2 transition-all ${
                                        paymentMethod === "store"
                                            ? "border-emerald-500 bg-emerald-500/10"
                                            : "border-zinc-700 bg-zinc-700/50 hover:border-zinc-600"
                                    }`}
                                >
                                    <IoStorefront size={48} className={`mx-auto mb-3 ${paymentMethod === "store" ? "text-emerald-400" : "text-gray-400"}`} />
                                    <h3 className="text-white font-bold text-lg mb-2">Pago en Tienda</h3>
                                    <p className="text-gray-400 text-sm">Paga al recibir tu pedido</p>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod("card")}
                                    className={`p-6 rounded-xl border-2 transition-all ${
                                        paymentMethod === "card"
                                            ? "border-emerald-500 bg-emerald-500/10"
                                            : "border-zinc-700 bg-zinc-700/50 hover:border-zinc-600"
                                    }`}
                                >
                                    <IoCard size={48} className={`mx-auto mb-3 ${paymentMethod === "card" ? "text-emerald-400" : "text-gray-400"}`} />
                                    <h3 className="text-white font-bold text-lg mb-2">Tarjeta de Crédito/Débito</h3>
                                    <p className="text-gray-400 text-sm">Pago seguro en línea</p>
                                </button>
                            </div>

                            {/* Formulario de tarjeta si selecciona pago con tarjeta */}
                            {paymentMethod === "card" && (
                                <div className="bg-zinc-700/50 p-6 rounded-xl border border-zinc-600 animate-fadeIn">
                                    <div className="flex items-center gap-2 mb-4">
                                        <IoLockClosed className="text-emerald-400" />
                                        <span className="text-emerald-400 text-sm font-semibold">Pago Seguro</span>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-gray-400 mb-2">Número de Tarjeta *</label>
                                            <input
                                                type="text"
                                                maxLength="19"
                                                className="w-full bg-zinc-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-mono"
                                                placeholder="1234 5678 9012 3456"
                                                {...register("cardNumber", {
                                                    required: paymentMethod === "card" ? "El número de tarjeta es requerido" : false,
                                                    pattern: {
                                                        value: /^[\d\s]{15,19}$/,
                                                        message: "Número de tarjeta inválido"
                                                    }
                                                })}
                                                onChange={(e) => {
                                                    // Formatear número de tarjeta
                                                    let value = e.target.value.replace(/\s/g, '');
                                                    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
                                                    e.target.value = formattedValue;
                                                }}
                                            />
                                            {errors.cardNumber && (
                                                <p className="text-red-400 text-sm mt-1">{errors.cardNumber.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-gray-400 mb-2">Nombre en la Tarjeta *</label>
                                            <input
                                                type="text"
                                                className="w-full bg-zinc-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all uppercase"
                                                placeholder="JUAN PEREZ"
                                                {...register("cardName", {
                                                    required: paymentMethod === "card" ? "El nombre es requerido" : false,
                                                    minLength: {
                                                        value: 3,
                                                        message: "Nombre muy corto"
                                                    }
                                                })}
                                            />
                                            {errors.cardName && (
                                                <p className="text-red-400 text-sm mt-1">{errors.cardName.message}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-gray-400 mb-2">Fecha de Vencimiento *</label>
                                                <input
                                                    type="text"
                                                    maxLength="5"
                                                    className="w-full bg-zinc-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-mono"
                                                    placeholder="MM/AA"
                                                    {...register("cardExpiry", {
                                                        required: paymentMethod === "card" ? "La fecha es requerida" : false,
                                                        pattern: {
                                                            value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                                                            message: "Formato inválido (MM/AA)"
                                                        }
                                                    })}
                                                    onChange={(e) => {
                                                        let value = e.target.value.replace(/\D/g, '');
                                                        if (value.length >= 2) {
                                                            value = value.slice(0, 2) + '/' + value.slice(2, 4);
                                                        }
                                                        e.target.value = value;
                                                    }}
                                                />
                                                {errors.cardExpiry && (
                                                    <p className="text-red-400 text-sm mt-1">{errors.cardExpiry.message}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-gray-400 mb-2">CVV *</label>
                                                <input
                                                    type="text"
                                                    maxLength="4"
                                                    className="w-full bg-zinc-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-mono"
                                                    placeholder="123"
                                                    {...register("cardCvv", {
                                                        required: paymentMethod === "card" ? "El CVV es requerido" : false,
                                                        pattern: {
                                                            value: /^\d{3,4}$/,
                                                            message: "CVV inválido"
                                                        }
                                                    })}
                                                />
                                                {errors.cardCvv && (
                                                    <p className="text-red-400 text-sm mt-1">{errors.cardCvv.message}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="bg-zinc-800 p-4 rounded-lg mt-4">
                                            <p className="text-gray-400 text-xs flex items-center gap-2">
                                                <IoLockClosed size={16} />
                                                Tu información está segura. Este es un entorno de prueba.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {paymentMethod === "store" && (
                                <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <IoCash size={24} className="text-blue-400 flex-shrink-0 mt-1" />
                                        <div>
                                            <h4 className="text-white font-semibold mb-2">Instrucciones de Pago en Tienda</h4>
                                            <ul className="text-gray-300 text-sm space-y-1">
                                                <li>• Paga al momento de recibir tu pedido</li>
                                                <li>• Aceptamos efectivo y tarjetas</li>
                                                <li>• Ten el monto exacto listo</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ETAPA 4: Confirmar Pedido */}
                    {currentStep === 4 && (
                        <div className="bg-zinc-800 p-6 rounded-2xl animate-fadeIn">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <IoDocumentText size={24} className="text-emerald-400" />
                                Confirmar Pedido
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Resumen de productos */}
                                <div>
                                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                                        <IoCart size={20} />
                                        Productos ({cartItems.length})
                                    </h3>
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {cartItems.map((item) => (
                                            <div
                                                key={item._id}
                                                className="flex justify-between items-center bg-zinc-700 p-3 rounded-lg"
                                            >
                                                <div>
                                                    <p className="text-white text-sm">{item.name}</p>
                                                    <p className="text-gray-400 text-xs">x{item.quantity}</p>
                                                </div>
                                                <p className="text-emerald-400 font-semibold">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-zinc-700">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">Subtotal:</span>
                                            <span className="text-white">${getCartTotal().toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-gray-400">Envío:</span>
                                            <span className="text-emerald-400">Gratis</span>
                                        </div>
                                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-zinc-700 text-xl font-bold">
                                            <span className="text-white">Total:</span>
                                            <span className="text-emerald-400">${getCartTotal().toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Datos de envío y pago */}
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                                            <IoLocation size={20} />
                                            Datos de Envío
                                        </h3>
                                        <div className="bg-zinc-700 p-4 rounded-lg space-y-2">
                                            <p className="text-white font-medium">{getValues("fullName")}</p>
                                            <p className="text-gray-400 text-sm flex items-center gap-2">
                                                <IoMail size={16} /> {getValues("email")}
                                            </p>
                                            <p className="text-gray-400 text-sm flex items-center gap-2">
                                                <IoCall size={16} /> {getValues("phone")}
                                            </p>
                                            <div className="pt-2 mt-2 border-t border-zinc-600">
                                                <p className="text-gray-400 text-sm">{getValues("address")}</p>
                                                <p className="text-gray-400 text-sm">
                                                    {getValues("city")}, {getValues("postalCode")}
                                                </p>
                                                <p className="text-gray-400 text-sm">{getValues("country") || "México"}</p>
                                            </div>
                                            {getValues("notes") && (
                                                <div className="pt-2 mt-2 border-t border-zinc-600">
                                                    <p className="text-gray-500 text-xs">Notas:</p>
                                                    <p className="text-gray-400 text-sm">{getValues("notes")}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                                            <IoCard size={20} />
                                            Método de Pago
                                        </h3>
                                        <div className="bg-zinc-700 p-4 rounded-lg">
                                            {paymentMethod === "store" ? (
                                                <div className="flex items-center gap-3">
                                                    <IoStorefront size={32} className="text-emerald-400" />
                                                    <div>
                                                        <p className="text-white font-semibold">Pago en Tienda</p>
                                                        <p className="text-gray-400 text-sm">Pago al recibir</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3">
                                                    <IoCard size={32} className="text-emerald-400" />
                                                    <div>
                                                        <p className="text-white font-semibold">Tarjeta de Crédito/Débito</p>
                                                        <p className="text-gray-400 text-sm font-mono">
                                                            •••• •••• •••• {getValues("cardNumber")?.slice(-4)}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Botones de navegación */}
                    <div className="flex justify-between mt-6">
                        {currentStep > 1 ? (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="flex items-center gap-2 px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors"
                            >
                                <IoArrowBack size={20} />
                                Anterior
                            </button>
                        ) : (
                            <div></div>
                        )}

                        {currentStep < 4 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors"
                            >
                                Siguiente
                                <IoArrowForward size={20} />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors"
                            >
                                <IoCheckmarkCircle size={20} />
                                {isSubmitting ? "Procesando..." : "Confirmar Pedido"}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CheckoutPage;