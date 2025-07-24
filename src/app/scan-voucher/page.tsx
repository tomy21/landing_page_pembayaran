"use client";

import React, { useEffect, useRef, useState } from "react";
import Html5QrScanner from "../components/Html5QrScanner";
import { Html5Qrcode } from "html5-qrcode";

export default function ScanPage() {
  const [scanResult, setScanResult] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio("/beep.mp3"); // 🟡 Masukkan file beep ke folder public
    setHasMounted(true);
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().then(() => {
          scannerRef.current?.clear();
        });
      }
    };
  }, []);

  const startScan = async () => {
    try {
      setIsScanning(true);

      setTimeout(async () => {
        const html5QrCode = new Html5Qrcode("qr-reader");
        const devices = await Html5Qrcode.getCameras();
        console.log("📷 Available devices:", devices);

        if (devices && devices.length) {
          const cameraId = devices[0].id;

          await html5QrCode.start(
            cameraId,
            { fps: 10, qrbox: 250 },
            (decodedText) => {
              if (decodedText !== scanResult) {
                setScanResult(decodedText);
                // handleSubmit(decodedText); // ✅ Auto submit saat QR scan berhasil
                html5QrCode.stop();
                setIsScanning(false);
              }
            },
            (error) => {
              console.warn("Scan error", error);
            }
          );

          scannerRef.current = html5QrCode;
        } else {
          console.error("No cameras found");
          setIsScanning(false);
        }
      }, 0);
    } catch (err) {
      console.error("Scanner init failed", err);
      setIsScanning(false);
    }
  };

  const stopScan = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      setIsScanning(false);
    }
  };

  if (!hasMounted) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <input
          type="text"
          placeholder="Hasil scan QR akan muncul di sini"
          className="border rounded px-3 py-2 text-sm w-1/3"
          value={scanResult}
          onChange={(e) => setScanResult(e.target.value)}
          // onKeyDown={(e) => {
          //   if (e.key === "Enter") {
          //     handleSubmit(scanResult);
          //   }
          // }}
          autoFocus
        />

        <button
          className="px-3 py-2 bg-green-600 text-white rounded text-sm"
          onClick={startScan}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Scan QR"}
        </button>

        {/* <button
          className="px-3 py-2 bg-gray-500 text-white rounded text-sm"
          onClick={stopScan}
        >
          Stop
        </button> */}
      </div>

      {isScanning && <div id="qr-reader" className="w-full max-w-md" />}
    </div>
  );
}
