import { Controller, useForm } from "react-hook-form";
import { useProducts } from "../context/ProductContext";
import uploadIcon from "../assets/addphoto.svg";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoBagAdd, IoArrowBack, IoCloudUpload } from "react-icons/io5";

function ProductsFormPage() {
    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: "",
            price: 0.0,
            year: new Date().getFullYear(),
            image: null,
        },
    });

    const { createProduct, getProduct, updateProduct } = useProducts();
    const [selectedImage, setSelectedImage] = useState(uploadIcon);
    const [isLoading, setIsLoading] = useState(false);
    const inputImage = useRef(null);
    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        async function loadProduct() {
            if (params.id) {
                const product = await getProduct(params.id);
                if (product) {
                    setValue("name", product.name);
                    setValue("price", product.price);
                    setValue("year", product.year);
                    // Si tiene imagen, mostrarla
                    if (product.image) {
                        setSelectedImage(product.image);
                    }
                }
            }
        }
        loadProduct();
    }, [params.id]);

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("price", data.price);
            formData.append("year", data.year);

            // Solo agregar imagen si se seleccionó una nueva
            if (data.image && data.image instanceof File) {
                formData.append("image", data.image);
            }

            if (params.id) {
                await updateProduct(params.id, formData);
            } else {
                await createProduct(formData);
            }
            navigate("/products");
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    });

    const handleImageClick = () => {
        inputImage.current.click();
    };

    const handleImageChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
            field.onChange(file);
        }
    };

    return (
        <div className="flex items-center justify-center py-8">
            <div className="bg-zinc-800 max-w-lg w-full p-8 rounded-2xl shadow-xl">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
                >
                    <IoArrowBack size={20} />
                    Volver
                </button>

                <h1 className="text-2xl font-bold text-white mb-6">
                    {params.id ? "Editar Producto" : "Nuevo Producto"}
                </h1>

                <form onSubmit={onSubmit} className="space-y-4">
                    {/* Imagen */}
                    <div className="flex flex-col items-center mb-6">
                        <div
                            onClick={handleImageClick}
                            className="w-48 h-48 rounded-xl overflow-hidden cursor-pointer border-2 border-dashed border-zinc-600 hover:border-emerald-500 transition-colors flex items-center justify-center bg-zinc-700"
                        >
                            {selectedImage === uploadIcon ? (
                                <div className="text-center text-gray-400">
                                    <IoCloudUpload size={48} className="mx-auto mb-2" />
                                    <p className="text-sm">Click para subir imagen</p>
                                </div>
                            ) : (
                                <img
                                    src={selectedImage}
                                    alt="Producto"
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                        <Controller
                            name="image"
                            control={control}
                            render={({ field }) => (
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={inputImage}
                                    onChange={(e) => handleImageChange(e, field)}
                                    className="hidden"
                                />
                            )}
                        />
                        <p className="text-gray-500 text-xs mt-2">PNG, JPG, GIF (máx. 5MB)</p>
                    </div>

                    {/* Nombre */}
                    <div>
                        <label className="block text-gray-400 mb-2">Nombre del producto *</label>
                        <input
                            type="text"
                            className="w-full bg-zinc-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            placeholder="Ej: Laptop Gaming"
                            {...register("name", { required: "El nombre es requerido" })}
                            autoFocus
                        />
                        {errors.name && (
                            <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Precio */}
                    <div>
                        <label className="block text-gray-400 mb-2">Precio *</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                className="w-full bg-zinc-700 text-white pl-8 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                placeholder="0.00"
                                {...register("price", {
                                    required: "El precio es requerido",
                                    min: { value: 0, message: "El precio mínimo es 0" },
                                    valueAsNumber: true,
                                })}
                            />
                        </div>
                        {errors.price && (
                            <p className="text-red-400 text-sm mt-1">{errors.price.message}</p>
                        )}
                    </div>

                    {/* Año */}
                    <div>
                        <label className="block text-gray-400 mb-2">Año *</label>
                        <input
                            type="number"
                            max={new Date().getFullYear()}
                            min="1900"
                            step="1"
                            className="w-full bg-zinc-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            placeholder={new Date().getFullYear().toString()}
                            {...register("year", {
                                required: "El año es requerido",
                                min: { value: 1900, message: "El año mínimo es 1900" },
                                max: {
                                    value: new Date().getFullYear(),
                                    message: `El año máximo es ${new Date().getFullYear()}`,
                                },
                                valueAsNumber: true,
                            })}
                        />
                        {errors.year && (
                            <p className="text-red-400 text-sm mt-1">{errors.year.message}</p>
                        )}
                    </div>

                    {/* Botón Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <IoBagAdd size={24} />
                        {isLoading
                            ? "Guardando..."
                            : params.id
                                ? "Actualizar Producto"
                                : "Crear Producto"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ProductsFormPage;
