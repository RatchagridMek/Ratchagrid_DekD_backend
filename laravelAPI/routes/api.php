<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\Forum_Controller;



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

Route::get('/forum', [Forum_Controller::class, 'index']);
Route::post('/newforum', [Forum_Controller::class, 'store']);
Route::get('/forum/{id}', [Forum_Controller::class, 'edit']);
Route::put('/updateforum/{id}', [Forum_Controller::class, 'update']);
Route::delete('/deleteforum/{id}', [Forum_Controller::class, 'destroy']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
