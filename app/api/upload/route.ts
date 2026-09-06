import { v2 as cloudinary } from 'cloudinary'
import { NextRequest, NextResponse } from 'next/server'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, JPG, and PNG files are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File is too large. Maximum allowed size is 10 MB.' },
        { status: 400 }
      )
    }

    // Convert File to a Buffer for Cloudinary SDK
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Cloudinary using signed server-side upload
    const result = await new Promise<{ secure_url: string; public_id: string; original_filename: string }>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: 'sebat/briefs',
            use_filename: true,
            unique_filename: true,
          },
          (error, result) => {
            if (error || !result) {
              reject(error || new Error('Cloudinary upload failed.'))
            } else {
              resolve(result as { secure_url: string; public_id: string; original_filename: string })
            }
          }
        )
        uploadStream.end(buffer)
      }
    )

    return NextResponse.json({
      secure_url: result.secure_url,
      public_id: result.public_id,
      file_name: file.name,
    })
  } catch (err: unknown) {
    console.error('Upload error:', err)
    const message = err instanceof Error ? err.message : 'An unexpected error occurred during upload.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
