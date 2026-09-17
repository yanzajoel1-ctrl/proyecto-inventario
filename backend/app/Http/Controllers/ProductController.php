<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Listar todos los productos.
     */
    public function index()
    {
        $products = Product::all();

        return response()->json($products);
    }

    /**
     * Crear un nuevo producto.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'codigo' => 'required|string|max:255|unique:products,codigo',
            'descripcion' => 'required|string',
            'estado' => 'required|in:Disponible,Despachado',
        ]);

        $product = Product::create($validated);

        return response()->json($product, 201);
    }

    /**
     * Mostrar un producto específico.
     */
    public function show(string $id)
    {
        $product = Product::findOrFail($id);

        return response()->json($product);
    }

    /**
     * Actualizar un producto.
     */
    public function update(Request $request, string $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'codigo' => 'required|string|max:255|unique:products,codigo,' . $id,
            'descripcion' => 'required|string',
            'estado' => 'required|in:Disponible,Despachado',
        ]);

        $product->update($validated);

        return response()->json($product);
    }

    /**
     * Eliminar un producto.
     */
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);

        $product->delete();

        return response()->json([
            'message' => 'Producto eliminado correctamente'
        ]);
    }
}