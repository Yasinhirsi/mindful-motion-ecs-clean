"use client";

import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";

export default function FacialAnalysisPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [emotions, setEmotions] = useState<Record<string, number> | null>(null);
  const [dominantEmotion, setDominantEmotion] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const router = useRouter();
  const supabase = getSupabaseClient();

  useEffect(() => {
    return () => {
      // Clean up the stream when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );

        // Convert canvas to base64 image
        const imageData = canvasRef.current.toDataURL("image/jpeg");
        return imageData.split(",")[1]; // Remove the data URL prefix
      }
    }
    return null;
  };

  const analyzeEmotions = async () => {
    setIsAnalyzing(true);

    try {
      // Start camera if not already started
      if (!streamRef.current) {
        await startCamera();
        // Wait for video to be ready
        await new Promise((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = resolve;
          }
        });
      }

      // Capture image
      const imageBase64 = captureImage();

      if (!imageBase64) {
        throw new Error("Failed to capture image");
      }

      // Simulate emotion analysis with random values
      // In a real app, you would send the image to a backend API for analysis
      setTimeout(async () => {
        const mockEmotions = {
          happy: Math.random() * 100,
          sad: Math.random() * 100,
          angry: Math.random() * 100,
          surprised: Math.random() * 100,
          fearful: Math.random() * 100,
          disgusted: Math.random() * 100,
          neutral: Math.random() * 100,
        };

        // Find dominant emotion
        let maxEmotion = "";
        let maxValue = 0;

        Object.entries(mockEmotions).forEach(([emotion, value]) => {
          if (value > maxValue) {
            maxValue = value;
            maxEmotion = emotion;
          }
        });

        setEmotions(mockEmotions);
        setDominantEmotion(maxEmotion);

        // Save to database
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          await supabase.from("emotion_analysis").insert({
            user_id: session.user.id,
            analysis_type: "facial",
            emotions: mockEmotions,
          });
        }

        setIsAnalyzing(false);
      }, 2000);
    } catch (error) {
      console.error("Error analyzing emotions:", error);
      setIsAnalyzing(false);
    }
  };

  const handleStartAnalysis = () => {
    analyzeEmotions();
  };

  const handleStopAnalysis = () => {
    setIsAnalyzing(false);
    stopCamera();
  };

  const handleSaveAndExit = () => {
    stopCamera();
    router.push("/emotion-analysis");
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Facial Expression Analysis
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Camera Feed</CardTitle>
            <CardDescription>
              Position your face in the center of the frame
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {isAnalyzing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                  Analyzing...
                </div>
              )}
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </CardContent>
          <CardFooter className="flex justify-between">
            {!isAnalyzing ? (
              <Button onClick={handleStartAnalysis}>Start Analysis</Button>
            ) : (
              <Button variant="destructive" onClick={handleStopAnalysis}>
                Stop Analysis
              </Button>
            )}
            <Button variant="outline" onClick={handleSaveAndExit}>
              Save & Exit
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Emotion Results</CardTitle>
            <CardDescription>
              Analysis of your facial expressions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {emotions ? (
              <div className="space-y-4">
                <div className="text-center p-4 bg-muted rounded-lg mb-4">
                  <h3 className="text-lg font-medium">Dominant Emotion</h3>
                  <p className="text-2xl font-bold capitalize">
                    {dominantEmotion}
                  </p>
                </div>
                {Object.entries(emotions).map(([emotion, value]) => (
                  <div key={emotion} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">
                        {emotion}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(value)}%
                      </span>
                    </div>
                    <Progress value={value} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Start the analysis to see emotion results
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}