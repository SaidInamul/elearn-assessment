<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    public function index()
    {
        return Inertia::render('Products/Index', [
            'products' => Inertia::lazy(fn () => ProductResource::collection(Product::with('category')->latest()->get())),
            'categories' => Category::select('id', 'name')->orderBy('name')->get(),
        ]);
    }

    public function show(Product $product)
    {
        return Inertia::render('Products/Show', [
            'product' => new ProductResource($product)
        ]);
    }

    public function create()
    {
        return Inertia::render('Products/Create', [
            'categories' => Category::select('id', 'name')->orderBy('name')->get(),
        ]);
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        try {
            // Start the transaction
            DB::beginTransaction();

            // Perform the database operation
            Product::create($request->validated());

            // If everything is successful, commit the changes to the database
            DB::commit();

            return redirect()->route('products.index')
                ->with('message', 'Product created successfully.');

        } catch (\Exception $e) {
            // If anything goes wrong, undo the database changes
            DB::rollBack();

            // Log the actual error so you can figure out what went wrong later
            Log::error('Failed to create product: ' . $e->getMessage());

            // Redirect back with an error flash message
            return back()->with('error', 'Something went wrong while saving the product. Please try again.');
        }
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $product->update($request->validated());

            DB::commit();

            return redirect()->route('products.index')
                ->with('message', 'Product updated successfully.');

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Failed to update product ID ' . $product->id . ': ' . $e->getMessage());

            return back()->with('error', 'Something went wrong while updating the product. Please try again.');
        }
    }
}
