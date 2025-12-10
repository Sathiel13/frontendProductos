import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IoClose, IoTrash, IoAdd, IoRemove, IoCart } from "react-icons/io5";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Cart() {
    const {
        cartItems,
        isCartOpen,
        setIsCartOpen,
        removeFromCart,
        updateQuantity,
        getCartTotal,
        clearCart,
    } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (!isAuthenticated) {
            setIsCartOpen(false);
            navigate("/login");
            return;
        }
        setIsCartOpen(false);
        navigate("/checkout");
    };

    return (
        <Transition.Root show={isCartOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={setIsCartOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                    <div className="flex h-full flex-col bg-zinc-900 shadow-xl">
                                        {/* Header */}
                                        <div className="flex items-center justify-between px-4 py-6 bg-zinc-800">
                                            <Dialog.Title className="text-xl font-bold text-white flex items-center gap-2">
                                                <IoCart size={24} />
                                                Carrito de Compras
                                            </Dialog.Title>
                                            <button
                                                type="button"
                                                className="text-gray-400 hover:text-white transition-colors"
                                                onClick={() => setIsCartOpen(false)}
                                            >
                                                <IoClose size={28} />
                                            </button>
                                        </div>

                                        {/* Items */}
                                        <div className="flex-1 overflow-y-auto px-4 py-6">
                                            {cartItems.length === 0 ? (
                                                <div className="text-center text-gray-400 py-10">
                                                    <IoCart size={64} className="mx-auto mb-4 opacity-50" />
                                                    <p className="text-lg">Tu carrito está vacío</p>
                                                    <p className="text-sm mt-2">Agrega productos para comenzar</p>
                                                </div>
                                            ) : (
                                                <ul className="space-y-4">
                                                    {cartItems.map((item) => (
                                                        <li
                                                            key={item._id}
                                                            className="flex items-center gap-4 bg-zinc-800 p-4 rounded-lg"
                                                        >
                                                            <div className="flex-1">
                                                                <h3 className="text-white font-semibold">{item.name}</h3>
                                                                <p className="text-emerald-400 font-bold">
                                                                    ${item.price.toFixed(2)}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                                    className="p-1 bg-zinc-700 rounded hover:bg-zinc-600 transition-colors"
                                                                >
                                                                    <IoRemove size={18} className="text-white" />
                                                                </button>
                                                                <span className="text-white w-8 text-center font-semibold">
                                  {item.quantity}
                                </span>
                                                                <button
                                                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                                    className="p-1 bg-zinc-700 rounded hover:bg-zinc-600 transition-colors"
                                                                >
                                                                    <IoAdd size={18} className="text-white" />
                                                                </button>
                                                            </div>
                                                            <button
                                                                onClick={() => removeFromCart(item._id)}
                                                                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded transition-colors"
                                                            >
                                                                <IoTrash size={20} />
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>

                                        {/* Footer */}
                                        {cartItems.length > 0 && (
                                            <div className="border-t border-zinc-700 px-4 py-6 bg-zinc-800">
                                                <div className="flex justify-between text-lg font-bold text-white mb-4">
                                                    <span>Total:</span>
                                                    <span className="text-emerald-400">${getCartTotal().toFixed(2)}</span>
                                                </div>
                                                <button
                                                    onClick={handleCheckout}
                                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                                                >
                                                    Proceder al Pago
                                                </button>
                                                <button
                                                    onClick={clearCart}
                                                    className="w-full mt-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-semibold py-2 px-4 rounded-lg transition-colors"
                                                >
                                                    Vaciar Carrito
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}

export default Cart;