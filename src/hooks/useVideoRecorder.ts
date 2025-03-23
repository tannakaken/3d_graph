import { type RefObject, useRef, useState } from "react";

export const useVideoRecorder = (canvasRef: RefObject<HTMLCanvasElement | null>) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = () => {
    if (!canvasRef.current) return;

    const stream = canvasRef.current.captureStream();
    mediaRecorderRef.current = new MediaRecorder(stream);

    const chunks: Blob[] = [];
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const dataURL = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "recording.webm";
      link.click();
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return { isRecording, startRecording, stopRecording };
};
