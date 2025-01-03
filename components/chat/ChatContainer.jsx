"use client";
import { useState, useRef } from "react";
import { BsFillSendFill } from "react-icons/bs";
import { FaImage, FaUpload, FaFolderOpen } from "react-icons/fa";
import { IoDocumentAttach } from "react-icons/io5";
import Messages from "./Messages";
import useFetch from "@/ApiHandle/useFetch";
import { PDFCard } from "@/components/ui/components/pdf-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/components/dropdown-menu";

export default function ChatContainer() {
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSelectFromSaved, setIsSelectFromSaved] = useState(false);
  const {data : chatHistory, isLoading, isError} = useFetch(`/chat/history`);
  const fileInputRef = useRef(null);
  const pdfInputRef = useRef(null);
  const id = Math.ceil(Math.random() * 100000000);
  const url = `https://api.openai.com/v1/chat/completions`;
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const {data :savedDocuments, loading, error, setData} = useFetch(`/pdf/user/me`)

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage({
          file: file,
          preview: reader.result,
          base64: reader.result.split(",")[1],
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    }
  };

  const handleFileClick = () => {
    pdfInputRef.current.click();
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (pdfInputRef.current) {
      pdfInputRef.current.value = "";
    }
  };
  
  const handleChatHistoryClick = async (date) => {
    const token = JSON.parse(localStorage.getItem("token"))
    const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/chat/date?date=${date}`,
      {
        method: 'GET',
        headers : {'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token.access_token,
        "ngrok-skip-browser-warning": "69420"
      }}
    );
    const data = await response.json();
    setMessages(data); 
  }
  const handleSaveMessage = async (message) => {
    const token = JSON.parse(localStorage.getItem("token"));
    const formData = new FormData();
    formData.append('message', message.message);
    formData.append('type', message.type);
    if (selectedImage) {
      formData.append('file', selectedImage.file);
    }
    else if (selectedFile && !isSelectFromSaved ) {
      formData.append('file', selectedFile);
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ENDPOINT}/chat/create`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token.access_token,
          "ngrok-skip-browser-warning": "69420"
        },
        body: formData
      }
    );
    if (response.ok) {
      return true;
    }
    return false;
  };

  async function handleSubmit() {
    if (!messageContent.trim() && !selectedImage && !selectedFile) return;

    const newMessage = {
      id,
      message: messageContent,
      image: selectedImage?.preview,
      fileName: selectedFile?.name,
      type: "owner",
    };

    const isSaved = await handleSaveMessage({
        ...newMessage, 
        message: messageContent,
        type: "owner",
    });
    setMessages((prevMessages) => [...prevMessages, newMessage]);
      

    // Add user message

    // Add empty AI message immediately to show loader
    const aiMessageId = Math.ceil(Math.random() * 100000000);
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: aiMessageId,
        type: "ai",
      },
    ]);

    setMessageContent("");

    try {
      let answer;

      // Handle PDF file differently
      if (selectedFile) {
        if(isSelectFromSaved){
          const token = JSON.parse(localStorage.getItem("token"));
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_ENDPOINT}/ai/file-vision-suggestion?prompt=${encodeURIComponent(messageContent)}&file_url=${selectedFile.pdf_url}`,
            {
              method: "POST",
              headers: {
                Authorization: "Bearer " + token.access_token,
                "ngrok-skip-browser-warning": "69420"
              },
            }
          );
          const data = await response.json();
          answer = data.response || "Failed to process PDF";
        }
        else
        {
          const formData = new FormData();
          formData.append("file", selectedFile);
  
          const response = await fetch(
            `${
              process.env.NEXT_PUBLIC_ENDPOINT
            }/ai/file-vision?prompt=${encodeURIComponent(messageContent)}`,
            {
              method: "POST",
              body: formData,
            }
          );
  
          if (!response.ok) {
            throw new Error("PDF processing failed");
          }
  
          const data = await response.json();
          answer = data.response || "Failed to process PDF";
      }
      } else {
        // Existing image/text handling code
        let apiMessageContent = [];

        if (newMessage.message.trim()) {
          apiMessageContent.push({
            type: "text",
            text: newMessage.message,
          });
        }

        if (selectedImage) {
          apiMessageContent.push({
            type: "image_url",
            image_url: {
              url: selectedImage.preview,
            },
          });
        }

        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content:
                  "You are a helpful AI assistant that provides accurate and concise answers. Always respond in Bangla language. User might give you prompts in english alphabets that has bengali meanings. but you should respond in Bangla language.",
              },
              ...messages.map((msg) => ({
                role: msg.owner === "owner" ? "user" : "assistant",
                content: msg.image
                  ? [
                      { type: "text", text: msg.message || "" },
                      {
                        type: "image_url",
                        image_url: {
                          url: msg.image,
                        },
                      },
                    ]
                  : msg.content,
              })),
              {
                role: "user",
                content: apiMessageContent,
              },
            ],
            max_tokens: 300,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error?.message || "Unknown error");
        }
        answer = data.choices[0].message.content;
      }
      const isSaved = await handleSaveMessage({
        message : answer,
        type: "bot",
      });
      
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === aiMessageId ? { ...msg, message: answer } : msg
        )
      );
      

      // Clean up
      setSelectedImage(null);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (pdfInputRef.current) pdfInputRef.current.value = "";
    } catch (error) {
      console.error("Error:", error);
      // Remove loading message on error
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== aiMessageId)
      );
    }
  }

  const handleUploadFromComputer = () => {
    pdfInputRef.current.click();
  };

  const handleUploadFromSaved = () => {
    setShowDocumentsModal(true);
  };

  const handleSelectDocument = (doc) => {
    // Handle the selected document here
    setSelectedFile(doc);
    setIsSelectFromSaved(true);
    setShowDocumentsModal(false);
  };

  return (
    <div className="flex h-full scrollbar-hidden">
     
        {/* Chat History Sidebar */}
        <div className="w-80 bg-slate-800 border-l border-slate-700 border-r-2">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4">
          <h1 className="text-2xl font-bold text-white">Chat History</h1>
        </div>
        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-4rem)]">
          {isLoading ? (
            <div className="text-white text-center">Loading...</div>
          ) : isError ? (
            <div className="text-red-500 text-center">Error loading chat history</div>
          ) : chatHistory?.dates.map((date, index) => (
            <div key={date} className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors" 
              onClick={() => handleChatHistoryClick(date)}
              >
              <div className="text-white font-sm">
                {date}
              </div>
              <div className="text-gray-400 text-sm">
                {chatHistory.first_messages[index]}
              </div>
              <div className="text-gray-400 text-sm">
                {chatHistory.counts[index]} messages
              </div>
            </div>
          ))}
          
        </div>
      </div>
       {/* Main Chat Area */}
      <div className="flex flex-col flex-1">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4">
          <h1 className="text-2xl font-bold text-white">AI Chat Assistant</h1>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col bg-gradient-to-r from-slate-800 to-slate-900">
          <div className="flex-1 overflow-y-auto">
            <Messages messages={messages} />
          </div>

          {(selectedImage || selectedFile) && (
            <div className="px-4 py-2 bg-slate-800">
              <div className="flex items-center gap-2">
                {selectedImage && (
                  <div className="relative">
                    <img
                      src={selectedImage.preview}
                      alt="Selected"
                      className="h-20 w-20 object-cover rounded"
                    />
                    <button
                      onClick={removeSelectedImage}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white text-xs"
                    >
                      ×
                    </button>
                  </div>
                )}
                {selectedFile && (
                  <div className="flex items-center gap-2 bg-slate-700 rounded px-3 py-2">
                    <span className="text-white text-sm">
                      {selectedFile.name || selectedFile.title + '.pdf'}
                    </span>
                    <button
                      onClick={removeSelectedFile}
                      className="text-red-500 hover:text-red-400"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="p-4 bg-slate-800">
            <div className="flex items-center gap-2 bg-slate-700 rounded-lg px-4 py-2">
              <input
                type="text"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Type your message here..."
                className="flex-1 bg-transparent text-white placeholder:text-gray-400 focus:outline-none py-2"
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
              />
              <input
                type="file"
                ref={pdfInputRef}
                onChange={handleFileSelect}
                accept=".pdf"
                className="hidden"
              />
              <button
                onClick={handleImageClick}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Add image"
              >
                <FaImage className="w-5 h-5" />
              </button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    title="Add PDF"
                  >
                    <IoDocumentAttach className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="bg-slate-800 border border-slate-700 text-white shadow-lg animate-in"
                  align="start"
                  sideOffset={8}
                  alignOffset={-150}
                >
                  <DropdownMenuItem 
                    onClick={handleUploadFromComputer}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-slate-700 cursor-pointer"
                  >
                    <FaUpload className="w-4 h-4 text-gray-400" />
                    <span>Upload from Computer</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem 
                    onClick={handleUploadFromSaved}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-slate-700 cursor-pointer"
                  >
                    <FaFolderOpen className="w-4 h-4 text-gray-400" />
                    <span>Upload from Saved Documents</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <button
                onClick={handleSubmit}
                className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full text-white hover:opacity-90 transition-opacity"
              >
                <BsFillSendFill className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showDocumentsModal} onOpenChange={setShowDocumentsModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-100 text-[#000]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Select a Document</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {savedDocuments?.map((doc) => (
              <div 
                key={doc.id} 
                className="cursor-pointer"
                onClick={() => handleSelectDocument(doc)}
              >
                <PDFCard
                  key={doc.id}
                  title={doc.title}
                  caption={doc.caption}
                  status={doc.is_public ? 'public' : 'private'}
                  fileName={doc.fileName}
                  fileUrl={doc.pdf_url}
                  user={doc.user}
                  isSelectable={true}
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
