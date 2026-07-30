<?php

namespace App\Services;

use Cloudinary\Cloudinary;
use Illuminate\Http\UploadedFile;

class ImageUploadService
{
    protected Cloudinary $cloudinary;

    public function __construct()
    {
        $this->cloudinary = new Cloudinary(config('cloudinary.cloud_url'));
    }

    public function upload(UploadedFile $file, string $folder): array
    {
        $result = $this->cloudinary->uploadApi()->upload($file->getRealPath(), [
            'folder' => "riadkit/{$folder}",
        ]);

        return [
            'url' => $result['secure_url'],
            'public_id' => $result['public_id'],
        ];
    }

    public function delete(?string $publicId): void
    {
        if (!$publicId) {
            return;
        }

        try {
            $this->cloudinary->uploadApi()->destroy($publicId);
        } catch (\Exception $e) {
            \Log::warning('Failed to delete image from Cloudinary', [
                'public_id' => $publicId,
                'error' => $e->getMessage(),
            ]);
        }
    }

    public function replace(UploadedFile $file, string $folder, ?string $oldPublicId): array
    {
        $this->delete($oldPublicId);

        return $this->upload($file, $folder);
    }
}
