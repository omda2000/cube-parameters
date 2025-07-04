declare global {
  interface Window {
    __switchCameraMode?: (orthographic: boolean) => void;
  }
}
export {};
