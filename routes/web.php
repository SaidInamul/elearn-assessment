<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Your new products routes
    Route::resource('products', ProductController::class)->only([
        'index', 'create', 'store', 'edit', 'update'
    ]);

    Route::resource('categories', CategoryController::class)->only([
        'index', 'create', 'store', 'update'
    ]);

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
