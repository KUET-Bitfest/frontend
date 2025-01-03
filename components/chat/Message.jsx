"use client"
import { useEffect, useState } from 'react';
import { Loader2 } from "lucide-react"
import { IoDocumentAttach } from 'react-icons/io5';

export default function Message({ sender, messageContent, image, fileName }) {
  const isOwner = sender === 'owner';
  
  return (
    <div className={`flex ${isOwner ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] rounded-lg px-4 py-2 ${
        isOwner 
          ? 'bg-purple-600 text-white rounded-br-none' 
          : 'bg-slate-700 text-white rounded-bl-none'
      }`}>
        {image && (
          <div className="mb-2">
            <img 
              src={image}
              alt="Shared image" 
              className="max-w-full rounded-lg"
              style={{ maxHeight: '200px', objectFit: 'contain' }}
            />
          </div>
        )}
        {fileName && (
          <div className="flex items-center gap-2 mb-2 text-sm">
            <IoDocumentAttach className="w-4 h-4" />
            <span>{fileName}</span>
          </div>
        )}
        {messageContent === undefined && !isOwner ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Processing...</span>
          </div>
        ) : (
          <p className="text-sm whitespace-pre-wrap">{messageContent}</p>
        )}
      </div>
    </div>
  );
} 