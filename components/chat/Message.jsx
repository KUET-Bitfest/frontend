"use client"
import { useEffect, useState } from 'react';
import { Loader2 } from "lucide-react"
import { IoDocumentAttach } from 'react-icons/io5';
import { FaUser } from 'react-icons/fa';
import { RiRobot2Fill } from 'react-icons/ri';

export default function Message({ type, message, image, fileName }) {
  const isOwner = type === 'owner';
  
  return (
    <div className={`flex items-start gap-2 ${isOwner ? 'justify-end' : 'justify-start'}`}>
      {!isOwner && (
        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
          <RiRobot2Fill className="w-5 h-5 text-white" />
        </div>
      )}
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
          <div className="flex items-center gap-2 mb-2 p-2 bg-opacity-20 bg-slate-900 rounded-md">
            <IoDocumentAttach className="w-5 h-5" />
            <span className="text-sm truncate">{fileName}</span>
          </div>
        )}
        {message === undefined && !isOwner ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Processing...</span>
          </div>
        ) : (
          <p className="text-sm whitespace-pre-wrap">{message}</p>
        )}
      </div>
      {isOwner && (
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
          <FaUser className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
} 