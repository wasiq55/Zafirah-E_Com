import React, { useState, useEffect } from "react";
import {
  Plus,
  Package,
  Settings,
  Menu,
  Edit,
  Trash2,
} from "lucide-react";
import CreateProduct from "../components/CreateProduct";
import {useSelector} from 'react-redux';
import { fetchSellerProducts } from "../api/ProductApi";

const Seller = () => {
   const [products, setProducts] = useState([]);
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const [loading, setLoading] = useState(true);
   const [showCreateForm, setShowCreateForm] = useState(false);
   const {user} = useSelector((state)=> state.auth);

   const seller = user

   const fetchAllProducts = async() => {
     try {
       setLoading(true);
       const productsData = await fetchSellerProducts();
       setProducts(productsData || [])

     } catch (error) {
       console.log(error);
       setProducts([]);

     } finally {
       setLoading(false);
     }
   }

  useEffect(()=>{
    fetchAllProducts();    
  },[])


  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform lg:translate-x-0 lg:static`}
      >
        <div className="flex flex-col h-full">
          {/* Profile */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              
              <div>
                <h3 className="font-semibold text-gray-900">{seller?.username}</h3>
                <p className="text-sm text-gray-600">{seller?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => setShowCreateForm(false)}
              className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg"
            >
              <Package className="w-5 h-5" />
              <span className="font-medium">Products</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 lg:p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                {showCreateForm ? "Create Product" : "My Products"}
              </h1>
            </div>
            {!showCreateForm && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Product
              </button>
            )}
          </div>
        </header>

        {/* Conditional Render */}
        <div className="p-4 lg:p-6">
          {showCreateForm ? (
            <CreateProduct
              onProductCreated={(newProduct) => {
                setProducts(prevProducts => [newProduct, ...prevProducts]);
                setShowCreateForm(false);
                // Optionally refresh the list to ensure consistency
                // fetchAllProducts();
              }}
              onCancel={() => setShowCreateForm(false)}
            />
          ) : loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64 text-center">
              <Package className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
              <p className="text-gray-500 mb-4">Start by creating your first product</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Product
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-gray-900">
                      ₹{product.price.amount.toLocaleString()}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        product.stock > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.stock > 0
                        ? `${product.stock} in stock`
                        : "Out of stock"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-1 text-sm font-medium">
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Seller;
