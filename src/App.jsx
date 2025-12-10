import {BrowserRouter,Routes,Route} from 'react-router-dom';
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { AuthProvider } from './context/AuthContext'
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ProductsPage from './pages/ProductsPage';
import ProductsFormPage from './pages/ProductsFormPage';
import ProtectedRoute from './ProtectedRoute';
import { ProductsProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import Navbar from './components/Navbar';
import Cart from './components/Cart';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import NotFound from './pages/NotFound';

function App(){
    return (
        <AuthProvider>
            <ProductsProvider>
                <CartProvider>
                    <OrderProvider>
                        <BrowserRouter
                            future={{
                                v7_startTransition: true,
                                v7_relativeSplatPath: true,
                            }}
                        >
                            <main className='container mx-auto px-10'>
                                <Navbar/>
                                <Cart/>
                                <Routes>
                                    {/*Rutas Publicas */}
                                    <Route path='/' element={<HomePage />} />
                                    <Route path='/login' element={<LoginPage />} />
                                    <Route path='/register' element={<RegisterPage />} />

                                    {/*Selecion de rutas  protegidas */}
                                    <Route element={<ProtectedRoute />}>
                                        <Route path='/profile' element={<ProfilePage />} />
                                        <Route path='/products' element={<ProductsPage />} />
                                        <Route path='/add-product' element={<ProductsFormPage />} />
                                        <Route path='/products/:id' element={<ProductsFormPage />} />
                                        <Route path='/checkout' element={<CheckoutPage />} />
                                        <Route path='/orders' element={<OrdersPage />} />
                                    </Route>

                                    <Route path="*" element={<NotFound />}/>
                                </Routes>
                            </main>
                        </BrowserRouter>
                    </OrderProvider>
                </CartProvider>
            </ProductsProvider>
        </AuthProvider>
    )
}

export default App