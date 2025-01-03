"use client"
import Lottie from "lottie-react";
import loading from '@/components/lottie/loader1.json'

export default function Loading() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Lottie className="w-[45%] max-w-[400px]" animationData={loading} />
    </div>
  );
}
