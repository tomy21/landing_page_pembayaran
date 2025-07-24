"use client";

import React, { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

interface Props {
  onScanSuccess: (decodedText: string) => void;
  onScanFailure?: (error: string) => void;
}

const Html5QrScanner: React.FC<Props> = ({ onScanSuccess, onScanFailure }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      false // <--- verbose: false atau true sesuai kebutuhan
    );

    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      scanner.clear().catch((error) => {
        console.error("Failed to clear QR scanner:", error);
      });
    };
  }, []);

  return <div id="qr-reader" />;
};

export default Html5QrScanner;
