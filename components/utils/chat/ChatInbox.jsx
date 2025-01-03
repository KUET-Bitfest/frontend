"use client"
import { useEffect, useState } from 'react';
import {
  MultiChatSocket,
  MultiChatWindow,
  useMultiChatLogic,
} from 'react-chat-engine-advanced';


export default function ChatInbox() {

  const projectId = process.env.NEXT_PUBLIC_CHAT_ENGINE_PRODUCT_KEY;
  let token = localStorage?.getItem("token")
  token = JSON.parse(token)
  const senderUsername = token.email;
  const userSecret = "1234"

  const chatProps = useMultiChatLogic (projectId, senderUsername, userSecret);
  const [chatEngine, setChatEngine] = useState(false)
  
  useEffect(() => {
    setChatEngine(true)
  }, [])
  return (
    <div className='h-[90vh]'>
       { chatEngine && 
          <>
            <MultiChatSocket {...chatProps}/>
            <MultiChatWindow {...chatProps} style={{'height' : "85vh"}} />
          </>
       }
    </div>
  )
}
