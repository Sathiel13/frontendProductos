import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { IoTrash, IoPencil, IoCartOutline, IoCheckmark } from "react-icons/io5";
import { useState } from "react";
import PropTypes from "prop-types";

function ProductCard({ product }) {
    const { deleteProduct } = useProducts();
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    const handleAddToCart = () => {
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    return (
        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-zinc-700/50">
            {/* Imagen del producto */}
            <div className="h-48 bg-gradient-to-br from-emerald-600/20 to-cyan-600/20 flex items-center justify-center overflow-hidden">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                ) : (
                    <span className="text-6xl">📦</span>
                )}
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-bold text-white truncate flex-1">{product.name}</h2>
                    <span className="text-xs bg-zinc-700 px-2 py-1 rounded-full text-gray-400 ml-2">
                        {product.year}
                    </span>
                </div>

                <p className="text-3xl font-bold text-emerald-400 mb-4">
                    ${product.price.toFixed(2)}
                </p>

                <div className="flex gap-2">
                    <button
                        onClick={handleAddToCart}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                            added
                                ? "bg-emerald-600 text-white"
                                : "bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white"
                        }`}
                    >
                        {added ? (
                            <>
                                <IoCheckmark size={20} />
                                ¡Agregado!
                            </>
                        ) : (
                            <>
                                <IoCartOutline size={20} />
                                Agregar
                            </>
                        )}
                    </button>

                    <Link
                        to={`/products/${product._id}`}
                        className="p-2.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg transition-colors"
                    >
                        <IoPencil size={20} />
                    </Link>

                    <button
                        onClick={() => {
                            if (window.confirm("¿Estás seguro de eliminar este producto?")) {
                                deleteProduct(product._id);
                            }
                        }}
                        className="p-2.5 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
                    >
                        <IoTrash size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}

ProductCard.propTypes = {
    product: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        image: PropTypes.string,
    }).isRequired,
};

export default ProductCard;