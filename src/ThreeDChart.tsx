import { type ReactNode, useCallback, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { cameraPosition, counterCameraPosition } from "./constants";
import * as THREE from "three";
import { FaCamera, FaVideo, FaUndo } from "react-icons/fa";
import { useVideoRecorder } from "./hooks/useVideoRecorder";
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

type Props = {
  children: ReactNode;
}

const ThreeDChart = ({children}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const takeScreenshot = useCallback(() => {
    if (canvasRef.current) {
      const dataURL = canvasRef.current.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "screenshot.png";
      link.click();
    }
  }, []);

  const { startRecording, stopRecording, isRecording } =
    useVideoRecorder(canvasRef);

  const controlRef = useRef<OrbitControlsImpl>(null);
  const resetAngle = useCallback(() => {
    if (controlRef.current) {
      controlRef.current.reset();
    }
  }, []);

  return (
    <div className="canvas">
      <button type={"button"} onClick={resetAngle} title="reset angle">
        <FaUndo size={15} className="icon" />
      </button>
      <button type={"button"} onClick={takeScreenshot} title="screenshot">
        <FaCamera size={15} className="icon" />
      </button>
      <button
        type={"button"}
        onClick={isRecording ? stopRecording : startRecording}
        title={isRecording ? "stop recording": "start recording"}
      >
        <FaVideo size={15} className={isRecording ? "recording icon" : "icon"} />
      </button>
      <Canvas
        camera={{position: cameraPosition}}
        ref={canvasRef}
        gl={{
          preserveDrawingBuffer: true, // toDataURLで画像化するために必要。
        }}
      >
        <OrbitControls ref={controlRef} makeDefault />
        <directionalLight position={counterCameraPosition} intensity={2} />
        <directionalLight position={cameraPosition} intensity={2} />
        <ambientLight intensity={1} />
        {/* 黒背景 */}
        <mesh>
          <sphereGeometry args={[50, 32, 32]} />
          <meshBasicMaterial color="black" side={THREE.BackSide} />
        </mesh>
        {children}
      </Canvas>
    </div>
  );
};

export default ThreeDChart;

