import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/components/button"
import { Input } from "@/components/ui/components/input"
import OpenAI from "openai"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/components/dialog"

export default function StoryGenerationModal({ isOpen, onClose, onGenerate }) {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const generateStory = async () => {
    if (!prompt.trim()) return
    
    setIsGenerating(true)
    try {
      const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
        dangerouslyAllowBrowser: true
      });

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a creative Bengali story writer. Generate engaging stories in Bengali script (not Banglish) based on the given prompt. The story should be well-structured with proper paragraphs and engaging narrative. Your answer shouldn't exceed 200 words."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      });

      const story = completion.choices[0].message.content;
      onGenerate(story);
      onClose();
      setPrompt('');
    } catch (error) {
      console.error('Error generating story:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Generate Story</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your story prompt or topic..."
            className="w-full"
          />
        </div>
        
        <DialogFooter className="sm:justify-end">
          <Button
            center
            onClick={generateStory}
            disabled={!prompt.trim() || isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                Generate
                <span className="ml-2 bg-purple-500/50 text-xs px-2 py-0.5 rounded-full">
                  AI
                </span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 