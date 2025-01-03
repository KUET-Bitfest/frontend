"use client"
import { useEffect, useState } from 'react'
import { Mic, MicOff, ArrowRight, Volume2, VolumeX, History, X, Copy, Trash2 } from 'lucide-react'
import { Button } from '../ui/components/button'
import { mockTranslations } from '@/mock/data'
import { format } from 'date-fns'
import { Toaster } from "@/components/ui/components/toaster"
import { useToast } from '@/hooks/use-toast';
import { Description } from '@radix-ui/react-dialog'

export default function Translator() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState([])
  const { toast } = useToast()

  const handleSaveTranslation = async (outputText) => {
    const token = JSON.parse(localStorage.getItem("token"))
    const response = await fetch(process.env.NEXT_PUBLIC_ENDPOINT +'/translation/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token.access_token,
        "ngrok-skip-browser-warning": "69420"
      },
      body: JSON.stringify({ banglish_text:inputText , bangla_text:outputText}),
    });
    const data = await response.json();
    console.log(data);
  }
  
  useEffect(() => {
    const fetchHistory = async () => {
      if (showHistory) {
        try {
          const token = JSON.parse(localStorage.getItem("token"))
          const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/translation/me`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token.access_token,
              "ngrok-skip-browser-warning": "69420"
            }
          });
          const data = await response.json();
          setHistory(data);
        } catch (error) {
          console.error('Error fetching history:', error);
        }
      }
    };

    fetchHistory();
  }, [showHistory]);

  const handleDeleteHistory = async (id) => {
    const token = JSON.parse(localStorage.getItem("token"))
    const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/translation/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token.access_token,
      }
    });
    if (response.ok) {
      toast({ variant: "success", description: "Translation deleted successfully" });
      setHistory(history.filter(item => item.id !== id));
    }
  }

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    setIsTranslating(true);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are a Banglish to Bangla translator. Convert the given Banglish text (Bengali language written in English alphabets) to proper Bangla text. Only return the translated text in bengali language, nothing else."
            },
            {
              role: "user",
              content: inputText
            }
          ],
          max_tokens: 500
        })
      });

      const data = await response.json();
      if (response.ok) {
        setOutputText(data.choices[0].message.content);
          handleSaveTranslation(data.choices[0].message.content);
        
      } else {
        throw new Error(data.error?.message || 'Translation failed');
      }
    } catch (error) {
      console.error('Translation error:', error);
      setOutputText('Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
      
    }
  };

  const toggleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.lang = 'bn-BD';
      recognition.continuous = true;
      recognition.interimResults = true;

      if (!isListening) {
        recognition.start();
        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');

          if (event.results[0].isFinal) {
            setInputText(prev => prev + ' ' + transcript);
          }
        };
      } else {
        recognition.stop();
      }

      setIsListening(!isListening);
    }
  };

  const speakText = () => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance();
      speech.text = outputText;
      speech.lang = 'bn-BD';
      
      speech.onstart = () => setIsSpeaking(true);
      speech.onend = () => setIsSpeaking(false);
      
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        window.speechSynthesis.speak(speech);
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  }

  return (
    <div className="w-full max-w-6xl mx-auto relative flex flex-col items-center px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Input Section */}
        <div className="relative">
          <div className="absolute top-4 left-4 text-base font-medium text-gray-400">
            Banglish
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-[400px] pt-14 px-8 pb-8 bg-slate-800 text-white text-xl rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter text in Banglish..."
          />
          <button
            onClick={toggleVoiceInput}
            className={`absolute bottom-4 left-4 p-2 rounded-full ${
              isListening ? 'bg-red-500' : 'bg-slate-700'
            } hover:opacity-80`}
          >
            {isListening ? (
              <MicOff className="w-5 h-5 text-white" />
            ) : (
              <Mic className="w-5 h-5 text-white" />
            )}
          </button>
        </div>

        {/* Output Section */}
        <div className="relative">
          <div className="absolute top-4 left-4 text-base font-medium text-gray-400">
            বাংলা
          </div>
          <div className="w-full h-[400px] pt-14 px-8 pb-8 bg-slate-800 text-white text-xl rounded-lg overflow-auto scrollbar-hidden">
            {isTranslating ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            ) : (
              outputText
            )}
          </div>
          {outputText && (
            <button
              onClick={speakText}
              className={`absolute bottom-4 left-4 p-2 rounded-full ${
                isSpeaking ? 'bg-purple-500' : 'bg-slate-700'
              } hover:opacity-80`}
            >
              {isSpeaking ? (
                <VolumeX className="w-5 h-5 text-white" />
              ) : (
                <Volume2 className="w-5 h-5 text-white" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Buttons Group */}
      <div className="flex items-center gap-4 mt-8">
        <Button
          variant="primary"
          onClick={handleTranslate}
          disabled={isTranslating || !inputText.trim()}
          center
          className="px-8 py-3 text-lg"
        >
          Translate
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>

        <Button
          variant="secondary"
          onClick={() => setShowHistory(!showHistory)}
          className="px-8 py-3 text-lg flex items-center gap-2"
        >
          <History className="w-5 h-5" />
          History
        </Button>
      </div>

      {/* History Sidebar */}
      {showHistory && (
        <div className="fixed right-0 top-0 h-full w-[500px] dark:bg-slate-800 bg-main-bg shadow-lg transform transition-transform z-50 overflow-y-auto scrollbar-hidden">
          <div className="p-6 border-b border-slate-700 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-text-primary">Translation History</h2>
            <button
              onClick={() => setShowHistory(false)}
              className="p-2 hover:bg-slate-700 rounded"
            >
              <X className="w-6 h-6 text-text-primary" />
            </button>
          </div>
          <div className="p-6 space-y-6">
            { history && history?.map((item) => (
              <div key={item.id} className="bg-slate-700 rounded-lg p-6 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="text-sm text-gray-400">
                    {format(new Date(item.created_at), 'MMM d, yyyy h:mm a')}
                  </div>
                  <div className="flex gap-2">
                    
                    <button
                      onClick={() => handleDeleteHistory(item.id)}
                      className="p-2 hover:bg-slate-600 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5 text-[#e13a3a]" />
                    </button>
                    <button
                      onClick={() => copyToClipboard(item.banglish_text)}
                      className="p-2 hover:bg-slate-600 rounded"
                      title="Copy Banglish"
                    >
                      <Copy className="w-5 h-5 text-gray-400" />
                    </button>
                    <button
                      onClick={() => copyToClipboard(item.bangla_text)}
                      className="p-2 hover:bg-slate-600 rounded"
                      title="Copy Bengali"
                    >
                      <Copy className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className="text-lg text-white">{item.banglish_text}</div>
                <div className="text-lg text-white font-bengali">{item.bangla_text}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <Toaster />
    </div>
  )
} 