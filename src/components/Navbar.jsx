import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  IoPersonAdd,
  IoLogIn,
  IoPerson,
  IoChevronDownSharp,
  IoBagAdd,
  IoBagSharp,
  IoLogOut,
  IoCart,
  IoReceipt,
} from "react-icons/io5";

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { getCartCount, toggleCart } = useCart();
  const navigate = useNavigate();
  const cartCount = getCartCount();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-zinc-800 to-zinc-700 my-3 flex justify-between items-center py-5 px-6 md:px-10 rounded-xl shadow-lg">
      <Link to={isAuthenticated ? "/products" : "/"} className="group">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent group-hover:from-emerald-300 group-hover:to-cyan-300 transition-all">
          🛒 Productos
        </h1>
      </Link>

      <ul className="flex gap-x-3 items-center">
        {/* Botón del carrito */}
        <li>
          <button
            onClick={toggleCart}
            className="relative p-2 bg-zinc-600 hover:bg-zinc-500 rounded-lg transition-colors"
          >
            <IoCart size={24} className="text-white" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </li>

        {isAuthenticated ? (
          <>
            <li>
              <div className="flex items-center gap-2 px-3 py-2 bg-zinc-600/50 rounded-lg">
                <IoPerson size={20} className="text-emerald-400" />
                <span className="text-white font-medium hidden md:block">{user.username}</span>
              </div>
            </li>
            <li>
              <Menu>
                <MenuButton className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 py-2 px-4 text-sm font-semibold text-white shadow-lg transition-colors">
                  Menú
                  <IoChevronDownSharp className="size-4" />
                </MenuButton>
                <MenuItems
                  transition
                  anchor="bottom end"
                  className="w-52 origin-top-right rounded-xl border border-zinc-600 bg-zinc-800 p-2 text-sm text-white shadow-xl mt-2 transition duration-100 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
                >
                  <MenuItem>
                    <button
                      className="group flex w-full items-center gap-3 rounded-lg py-2 px-3 hover:bg-zinc-700 transition-colors"
                      onClick={() => navigate("/products")}
                    >
                      <IoBagSharp className="size-5 text-emerald-400" />
                      Ver Productos
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button
                      className="group flex w-full items-center gap-3 rounded-lg py-2 px-3 hover:bg-zinc-700 transition-colors"
                      onClick={() => navigate("/add-product")}
                    >
                      <IoBagAdd className="size-5 text-cyan-400" />
                      Agregar Producto
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button
                      className="group flex w-full items-center gap-3 rounded-lg py-2 px-3 hover:bg-zinc-700 transition-colors"
                      onClick={() => navigate("/orders")}
                    >
                      <IoReceipt className="size-5 text-purple-400" />
                      Mis Pedidos
                    </button>
                  </MenuItem>
                  <div className="my-2 h-px bg-zinc-600" />
                  <MenuItem>
                    <button
                      className="group flex w-full items-center gap-3 rounded-lg py-2 px-3 hover:bg-red-600/20 text-red-400 transition-colors"
                      onClick={handleLogout}
                    >
                      <IoLogOut className="size-5" />
                      Cerrar Sesión
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                to="/login"
                className="flex items-center gap-2 bg-zinc-600 hover:bg-zinc-500 px-4 py-2 rounded-lg transition-colors"
              >
                <IoLogIn size={20} className="text-white" />
                <span className="text-white hidden md:block">Iniciar</span>
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg transition-colors"
              >
                <IoPersonAdd size={20} className="text-white" />
                <span className="text-white hidden md:block">Registrar</span>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
