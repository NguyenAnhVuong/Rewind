<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        try {
            $comments = Comment::all();
            return response()->json([
                'status' => true,
                'message' => 'Comments Fetched Successfully',
                'data' => $comments
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Something went wrong',
                'errors' => $th
            ], 500);
        }
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
            $newComment = [
                'restaurant_id' => $request->restaurant_id,
                'user_id' => Auth::id(),
                'content' => $request->content,
                'rating' => $request->rating
            ];

            $validateComment = Validator::make($newComment, [
                'restaurant_id' => 'required|numeric',
                'user_id' => 'required|numeric',
                'content' => 'required',
                'rating' => 'required|numeric'
            ]);

            if ($validateComment->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validation Error',
                    'errors' => $validateComment->errors()
                ], 401);
            }

            $comment = Comment::create($newComment);

            return response()->json([
                'status' => true,
                'message' => 'Comment Created Successfully',
                'data' => $comment
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
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $comment)
    {
        //
        try {
            $newComment = [
                'restaurant_id' => $request->restaurant_id,
                'user_id' => Auth::id(),
                'content' => $request->content,
                'rating' => $request->rating
            ];

            $validateComment = Validator::make($newComment, [
                'restaurant_id' => 'required|numeric',
                'user_id' => 'required|numeric',
                'content' => 'required',
                'rating' => 'required|numeric'
            ]);

            if ($validateComment->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validation Error',
                    'errors' => $validateComment->errors()
                ], 401);
            }

            $comment = Comment::find($comment);
            $comment->update($newComment);

            return response()->json([
                'status' => true,
                'message' => 'Comment Updated Successfully',
                'data' => $comment
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
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
        try {
            $comment = Comment::find($id);
            $comment->delete();

            return response()->json([
                'status' => true,
                'message' => 'Comment Deleted Successfully',
                'data' => $comment
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
