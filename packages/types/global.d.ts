export {};

declare global {
  interface Window {
    bridge: {
      removeLoading: () => void;
      api: import("electron").IpcRenderer;
    };
  }
}
