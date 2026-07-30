<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ImageUploadService;
use Illuminate\Http\Request;

class UploadController extends Controller
{
    protected ImageUploadService $imageUpload;

    public function __construct(ImageUploadService $imageUpload)
    {
        $this->imageUpload = $imageUpload;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'file' => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
            'folder' => 'required|string|in:riads/logos,riads/covers,menu-items,excursions',
        ]);

        $result = $this->imageUpload->upload(
            $validated['file'],
            $validated['folder']
        );

        return response()->json([
            'url' => $result['url'],
            'public_id' => $result['public_id'],
        ]);
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'public_id' => 'required|string',
        ]);

        $this->imageUpload->delete($validated['public_id']);

        return response()->json(['message' => 'Image deleted successfully']);
    }
}
