<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;
use App\Http\Resources\CategoryResource;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Categories/Index', [
            'categories' => Inertia::lazy(fn () => CategoryResource::collection(Category::latest()->get()))
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Categories/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryRequest $request)
    {
        //
        try {
            // Start the transaction
            DB::beginTransaction();

            // Perform the database operation
            Category::create($request->validated());

            // If everything is successful, commit the changes to the database
            DB::commit();

            return redirect()->route('categories.index')
                ->with('message', 'Category created successfully.');

        } catch (\Exception $e) {
            // If anything goes wrong, undo the database changes
            DB::rollBack();

            // Log the actual error so you can figure out what went wrong later
            Log::error('Failed to create category: ' . $e->getMessage());

            // Redirect back with an error flash message
            return back()->with('error', 'Something went wrong while saving the category. Please try again.');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        try {
            // Start the transaction
            DB::beginTransaction();

            // Perform the database operation
            $category->update($request->validated());

            // If everything is successful, commit the changes to the database
            DB::commit();

            return redirect()->route('categories.index')
                ->with('message', 'Category updated successfully.');

        } catch (\Exception $e) {
            // If anything goes wrong, undo the database changes
            DB::rollBack();

            // Log the actual error so you can figure out what went wrong later
            Log::error('Failed to update category: ' . $e->getMessage());

            // Redirect back with an error flash message
            return back()->with('error', 'Something went wrong while updating the category. Please try again.');
        }
    }
}
