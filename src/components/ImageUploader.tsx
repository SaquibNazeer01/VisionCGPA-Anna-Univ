import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../utils/cn';

interface ImageUploaderProps {
  onImageUpload: (base64: string, file: File) => void;
  isAnalyzing: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, isAnalyzing }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onImageUpload(reader.result as string, file);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
    disabled: isAnalyzing
  } as any);

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300",
        "flex flex-col items-center justify-center p-12 text-center",
        isDragActive ? "border-indigo-500 bg-indigo-50/50" : "border-zinc-200 hover:border-indigo-400 hover:bg-zinc-50",
        isAnalyzing && "pointer-events-none opacity-60"
      )}
    >
      <input {...getInputProps()} />

      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: isDragActive ? 1.1 : 1 }}
        className="mb-4"
      >
        {isAnalyzing ? (
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        ) : (
          <Upload className={cn(
            "w-12 h-12 transition-colors duration-300",
            isDragActive ? "text-indigo-500" : "text-zinc-400 group-hover:text-indigo-400"
          )} />
        )}
      </motion.div>

      <div className="space-y-1">
        <p className="text-lg font-medium text-zinc-900">
          {isAnalyzing ? "Analyzing Marksheet..." : isDragActive ? "Drop it here" : "Upload Marksheet"}
        </p>
        <p className="text-sm text-zinc-500">
          {isAnalyzing ? "VisionCGPA is extracting subject details" : "Drag & drop or click to select image"}
        </p>
      </div>

      {isAnalyzing && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-indigo-500"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </div>
  );
};
