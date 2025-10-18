import React, { useState, useEffect } from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import api from "@/lib/api";

const SimiliarProductSection = ({ categoryId, currentProductId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/products");
        
        // Filter products by same category and exclude current product
        let filtered = response.data.products.filter(
          (p) => p.is_active && p.id !== currentProductId
        );

        // If categoryId provided, prioritize same category
        if (categoryId) {
          const sameCategory = filtered.filter((p) => p.category_id === categoryId);
          
          // If we have products in same category, use them
          if (sameCategory.length > 0) {
            filtered = sameCategory;
          }
        }

        // Limit to 4 products
        setProducts(filtered.slice(0, 4));
      } catch (err) {
        console.error("Error fetching similar products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProducts();
  }, [categoryId, currentProductId]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <section className="py-10 px-20 max-md:px-5">
        <div className="text-center">
          <p>Memuat produk serupa...</p>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null; // Don't show section if no similar products
  }

  return (
    <section className="py-10 px-20 max-md:px-5">
      <div>
        <h4 className="text-[48px] font-bold text-center uppercase max-sm:text-[32px]">
          ANDA MUNGKIN JUGA MENYUKAI
        </h4>
      </div>
      <div className="flex flex-col w-full">
        <div className="grid grid-cols-4 gap-4 mt-7 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {products.map((product) => (
            <div key={product.id}>
              <Link to={`/product/${product.id}`}>
                <figure className="h-[298px] rounded-[20px] overflow-hidden bg-gray-200">
                  <img
                    src={product.image_url || "/product1.png"}
                    alt={product.name}
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </figure>
              </Link>
              <div className="mt-3 flex flex-col gap-1">
                <Link to={`/product/${product.id}`}>
                  <h4 className="text-xl font-bold hover:text-gray-600 transition-colors">
                    {product.name}
                  </h4>
                </Link>
                <div className="flex gap-1 items-center">
                  <div className="text-[#FFC633] flex items-center gap-1 text-lg">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStarHalfAlt />
                  </div>
                  <span className="text-sm">4.5/5</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">
                    {formatPrice(product.price)}
                  </span>
                  {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                    <span className="text-xs text-orange-500">
                      Stok: {product.stock_quantity}
                    </span>
                  )}
                  {product.stock_quantity === 0 && (
                    <span className="text-xs text-red-500">Habis</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SimiliarProductSection;