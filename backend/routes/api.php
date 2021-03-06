<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RestaurantController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/restaurant/get', [RestaurantController::class, 'index']);
Route::post('/restaurant/add', [RestaurantController::class, 'store'])->middleware('auth:sanctum');
Route::put('/restaurant/update/{id}', [RestaurantController::class, 'update'])->middleware('auth:sanctum');
Route::delete('/restaurant/delete/{id}', [RestaurantController::class, 'destroy'])->middleware('auth:sanctum');
Route::get('/restaurant/details/{id}', [RestaurantController::class, 'getRestaurantDetails']);
Route::get('/user/{id}/restaurants', [RestaurantController::class, 'getRestaurantByUserId'])->middleware('auth:sanctum');
Route::post('/auth/register', [AuthController::class, 'createUser']);
Route::post('/auth/login', [AuthController::class, 'loginUser']);
Route::post('/auth/logout', [AuthController::class, 'logoutUser'])->middleware('auth:sanctum');
Route::post('/upload', function (Request $request) {
    $images = array();
    foreach ($request->file('images') as $image) {
        $name = 'restaurant' . time() . rand(1, 99) . '.' . $image->getClientOriginalExtension();
        $destinationPath = public_path('/images');
        $image->move($destinationPath, $name);
        $images[] = $name;
    }
    return response()->json([
        'status' => true,
        'message' => 'Images Uploaded Successfully',
        'images' => $images
    ], 200);
})->middleware('auth:sanctum');
