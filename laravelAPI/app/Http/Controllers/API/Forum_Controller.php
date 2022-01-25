<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\forum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class Forum_Controller extends Controller
{
    public function index()
    {
        $forum = forum::all();
        return response()->json([
            'status' => 200,
            'data' => $forum,
        ]);
    }

    public function edit($id)
    {
        $forum = forum::find($id);
        if ($forum) {
            return response()->json([
                'status' => 200,
                'forum' => $forum,
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'ไม่พบกระทู้ที่ท่านต้องการครับ',
            ]);
        }
    }

    public function destroy($id)
    {
        $forum = forum::find($id);
        if ($forum) {
            $forum->delete();

            return response()->json([
                'status' => 200,
                'message' => 'ข้อมูลกระทู้ได้ทำการลบเรียบร้อยครับ',
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'ไม่พบกระทู้ที่ท่านต้องการครับ',
            ]);
        }
    }

    public function update(Request $request, $id)
    {
        $content_min_range = 6;
        $content_max_range = 2000;

        $validator = Validator::make($request->all(), [
            'header' => 'required|max:140|min:4',
            'content' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'validate_err' => $validator->messages(),
            ]);
        } else {

            $forum = forum::find($id);
            if ($forum) {
                $header = $request->input('header');
                $content = $request->input('content');
                $len = strlen(strip_tags($content));
                if ($len < $content_min_range) {
                    return response()->json([
                        'status' => 401,
                        'message' => 'ข้อมูล content จะต้องมีตัวอักษรอย่างน้อย 6 ตัวครับ',
                    ]);
                } else if ($len > $content_max_range) {
                    return response()->json([
                        'status' => 401,
                        'message' => 'ข้อมูล content จะต้องมีตัวอักษรน้อยกว่า 2000 ตัวครับ',
                    ]);
                } else {
                    if ($header != strip_tags($header)) {
                        return response()->json([
                            'status' => 400,
                            'message' => 'ระบบไม่รองรับข้อมูลแท็คของ HTML ครับ',
                        ]);
                    } else {
                        $forum->forum_header = $header;
                        $forum->forum_content = $content;
                        $forum->update();

                        return response()->json([
                            'status' => 200,
                            'message' => 'แก้ไขข้อมูลกระทู้เรียบร้อยแล้วครับ',
                        ]);
                    }
                }
            } else {
                return response()->json([
                    'status' => 404,
                    'message' => 'ไม่พบกระทู้ที่ท่านต้องการครับ',
                ]);
            }
        }
    }

    public function store(Request $request)
    {
        $content_min_range = 6;
        $content_max_range = 2000;

        $validator = Validator::make($request->all(), [
            'header' => 'required|max:140|min:4',
            'content' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'validate_err' => $validator->messages(),
            ]);
        } else {
            $header = $request->input('header');
            $content = $request->input('content');
            $len = strlen(strip_tags($content));
            if ($len < $content_min_range) {
                return response()->json([
                    'status' => 401,
                    'message' => 'ข้อมูล content จะต้องมีตัวอักษรอย่างน้อย 6 ตัวครับ',
                ]);
            } else if($len > $content_max_range){
                return response()->json([
                    'status' => 401,
                    'message' => 'ข้อมูล content จะต้องมีตัวอักษรน้อยกว่า 2000 ตัวครับ',
                ]);
            } else {
                if ($header != strip_tags($header)) {
                    return response()->json([
                        'status' => 400,
                        'message' => 'ระบบไม่รองรับข้อมูลแท็คของ HTML ครับ',
                    ]);
                } else {
                    $forum = new forum;
                    $forum->forum_header = $header;
                    $forum->forum_content = $content;
                    $forum->save();
                    return response()->json([
                        'status' => 200,
                        'message' => 'เพิ่มข้อมูลกระทู้เรียบร้อยแล้วครับ',
                    ]);
                }
            }
        }
    }
}
