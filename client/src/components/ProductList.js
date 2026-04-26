import ProductCard from "./ProductCard";

function ProductList({ products, addToCart, onViewDetails, loadingId }) {
  return (
    <div className="w-full">
      {products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-lg text-gray-600">📭 No products found</p>
          <p className="text-sm text-gray-500 mt-2">
            Try adjusting your filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
              onViewDetails={onViewDetails}
              loadingId={loadingId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;