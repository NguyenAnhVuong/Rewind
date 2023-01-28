<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;


use App\Models\Restaurant;
use Illuminate\Http\Request;
use App\Models\Restaurant_Image;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class RestaurantController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        $restaurants = Restaurant::all();
        foreach ($restaurants as $restaurant) {
            $users = User::all();
            foreach ($users as $user) {
                if ($user->id == $restaurant->user_id) {
                    $restaurant->user = $user->name;
                }
            }
            $images = Restaurant_Image::where('restaurant_id', $restaurant->id)->get('image');
            $image_names = [];
            foreach ($images as $image) {
                $image_names[] = $image->image;
            }
            $restaurant->images = $image_names;
        }

        return response()->json([
            'status' => true,
            'message' => 'Restaurants Fetched Successfully',
            'restaurants' => $restaurants
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
        try {
            //Validated
            $newRestaurant = [
                'name' => $request->name,
                'address' => $request->address,
                'phone' => $request->phone,
                'description' => $request->description,
                'user_id' => Auth::id(),
                'avatar' => $request->avatar
            ];
            $validateRestaurant = Validator::make($newRestaurant, [
                'name' => 'required',
                'address' => 'required',
                'phone' => 'required',
                'description' => 'required',
                'user_id' => 'required|numeric',
                'avatar' => 'required'
            ]);

            if ($validateRestaurant->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validation Error',
                    'errors' => $validateRestaurant->errors()
                ], 401);
            }

            $restaurant = Restaurant::create($newRestaurant);

            foreach ($request->images as $image) {
                Restaurant_Image::create(
                    [
                        'restaurant_id' => $restaurant->id,
                        'image' => $image
                    ]
                );
            }

            return response()->json([
                'status' => true,
                'message' => 'Restaurant Created Successfully',
            ], 200);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json([
                'status' => false,
                'message' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Restaurant  $restaurant
     * @return \Illuminate\Http\Response
     */
    public function show(Restaurant $restaurant)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Restaurant  $restaurant
     * @return \Illuminate\Http\Response
     */
    public function edit(Restaurant $restaurant)
    {
        //

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Restaurant  $restaurant
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
        try {
            //Validated
            $newRestaurant = [
                'name' => $request->name,
                'address' => $request->address,
                'phone' => $request->phone,
                'description' => $request->description,
                'user_id' => Auth::id(),
                'avatar' => $request->avatar
            ];
            $validateRestaurant = Validator::make($newRestaurant, [
                'name' => 'required',
                'address' => 'required',
                'phone' => 'required',
                'description' => 'required',
                'user_id' => 'required|numeric',
                'avatar' => 'required'
            ]);

            if ($validateRestaurant->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validation Error',
                    'errors' => $validateRestaurant->errors()
                ], 401);
            }

            $restaurant = Restaurant::find($id);
            if ($restaurant->user_id != Auth::id()) {
                return response()->json([
                    'status' => false,
                    'message' => 'You are not authorized to edit this restaurant'
                ], 401);
            }

            Restaurant::where('id', $id)->update($newRestaurant);
            Restaurant_Image::where('restaurant_id', $id)->delete();
            foreach ($request->images as $image) {
                Restaurant_Image::create(
                    [
                        'restaurant_id' => $id,
                        'image' => $image
                    ]
                );
            }

            return response()->json([
                'status' => true,
                'message' => 'Restaurant Updated Successfully',
            ], 200);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json([
                'status' => false,
                'message' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Restaurant  $restaurant
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
        try {
            $restaurant = Restaurant::find($id);
            if (!$restaurant) {
                return response()->json([
                    'status' => false,
                    'message' => 'Restaurant Not Found',
                ], 404);
            }
            if ($restaurant->user_id != Auth::id() && Auth::id() != 2) {
                return response()->json([
                    'status' => false,
                    'message' => 'You are not authorized to delete this restaurant'
                ], 401);
            }
            Restaurant_Image::where('restaurant_id', $id)->delete();
            Restaurant::where('id', $id)->delete();
            return response()->json([
                'status' => true,
                'message' => 'Restaurant Deleted Successfully',
            ], 200);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json([
                'status' => false,
                'message' => $th->getMessage(),
            ], 500);
        }
    }

    public function getRestaurantByUserId($id)
    {
        $reviews = Restaurant::where('user_id', $id)->get();
        return response()->json([
            'status' => true,
            'message' => 'Reviews Fetched Successfully',
            'data' => $reviews
        ], 200);
    }

    public function getRestaurantDetails($id)
    {
        try {
            $restaurant = Restaurant::find($id);
            $restaurant->images;
            $restaurant->comments;
            $images = $restaurant->images->map(function ($image) {
                return $image->image;
            });

            $sum = 0;
            foreach ($restaurant->comments as $comment) {
                $sum += $comment->rating;
            }
            $rating = -1;
            if (count($restaurant->comments) > 0) {
                $rating = $sum / count($restaurant->comments);
            }

            $comments = $restaurant->comments()->orderBy('created_at', 'desc')->get()->map(function ($comment) {
                $user = User::find($comment->user_id);
                return [
                    "id" => $comment->id,
                    "comment" => $comment->content,
                    "rating" => $comment->rating,
                    "created_at" => $comment->created_at,
                    "updated_at" => $comment->updated_at,
                    "user" => [
                        "id" => $user->id,
                        "name" => $user->name,
                        "email" => $user->email,
                        "avatar" => $user->avatar,
                    ]
                ];
            });

            $output = [
                "id" => $restaurant->id,
                "name" => $restaurant->name,
                "address" => $restaurant->address,
                "phone" => $restaurant->phone,
                "description" => $restaurant->description,
                "avatar" => $restaurant->avatar,
                "user_id" => $restaurant->user_id,
                "comments" => $comments,
                "images" => $images,
                "rating" => $rating
            ];
            return response()->json([
                'status' => true,
                'message' => 'Restaurant Fetched Successfully',
                'data' => [
                    'restaurant' => $output,
                ]
            ], 200);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json([
                'status' => false,
                'message' => $th->getMessage(),
            ], 500);
        }
    }
}
