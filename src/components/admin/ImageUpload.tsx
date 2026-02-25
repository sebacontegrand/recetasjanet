'use client'

import { UploadCloud, X } from 'lucide-react'
import Image from 'next/image'
import { CldUploadWidget } from 'next-cloudinary'

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    folder?: string;
}

export function ImageUpload({ value, onChange, folder = 'recipes' }: ImageUploadProps) {
    const handleRemove = () => {
        onChange('')
    }

    const onUploadSuccess = (result: any) => {
        if (result.event === 'success') {
            onChange(result.info.secure_url)
        }
    }

    return (
        <div className="w-full">
            {value ? (
                <div className="relative aspect-video w-full max-w-sm rounded-lg overflow-hidden border border-warm-200 group bg-warm-100">
                    <Image src={value} fill alt="Uploaded img" className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="bg-red-500 text-white p-2 text-sm rounded-full hover:bg-red-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center w-full">
                    <CldUploadWidget
                        uploadPreset="recetas_preset"
                        onSuccess={onUploadSuccess}
                        options={{
                            folder: folder,
                            clientAllowedFormats: ["png", "jpeg", "webp", "jpg"],
                            maxFileSize: 5000000,
                        }}
                    >
                        {({ open }) => {
                            return (
                                <button
                                    type="button"
                                    onClick={() => open()}
                                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-brand-primary/20 border-dashed rounded-lg cursor-pointer bg-brand-primary/5 hover:bg-brand-primary/10 transition-colors"
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <UploadCloud className="w-8 h-8 text-brand-primary mb-3" />
                                        <p className="mb-2 text-sm text-brand-900">
                                            <span className="font-semibold">Click para subir</span>
                                        </p>
                                        <p className="text-xs text-brand-800/60 transition-colors">PNG, JPG, WEBP (MAX. 5MB)</p>
                                    </div>
                                </button>
                            );
                        }}
                    </CldUploadWidget>
                </div>
            )}
        </div>
    )
}
