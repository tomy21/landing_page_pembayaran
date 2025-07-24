"use client";
import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import Image from "next/image";
import { Html5Qrcode, Html5QrcodeScanner } from "html5-qrcode";
import Loading from "./Loading";

export default function QrisWithPopup({
  qrContent,
  isLoading,
}: {
  qrContent: string;
  isLoading: boolean;
}) {
  const [showOptions, setShowOptions] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const [result, setResult] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showOptions ? "hidden" : "auto";
  }, [showOptions]);

  // useEffect(() => {
  //   if (qrContent) setIsLoading(false);
  // }, [qrContent]);

  const handleDownloadFullImage = async () => {
    if (!qrRef.current) return;
    const canvas = await html2canvas(qrRef.current);
    const dataURL = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "qris-full.png";
    link.click();
  };

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

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        {/* QR Box */}
        <div
          ref={qrRef}
          className={`cursor-pointer w-[300px] min-h-[200px] flex items-center justify-center mb-3 ${
            isLoading ? "bg-gray-200 animate-pulse rounded" : ""
          }`}
          onClick={() => !isLoading && setShowOptions(true)}
        >
          {isLoading ? (
            <Loading />
          ) : (
            <QRCodeSVG
              value={qrContent?.toString()}
              size={200}
              level="H"
              includeMargin={true}
            />
          )}
        </div>

        <div className="my-3">
          <p className="text-center text-xs font-semibold">
            SATU QRIS UNTUK SEMUA
          </p>
          <p className="text-center text-[10px] text-gray-500 mb-2">
            Cek aplikasi penyelenggara di: www.aspi-qris.id
          </p>
        </div>

        <div className="flex justify-between items-center w-full mb-5 space-x-2">
          <div
            onClick={() => {
              const goPayLink = `gopay://gopay/qr?code=${qrContent}`;
              window.location.href = goPayLink;

              // Optional: Fallback jika tidak terinstall
              setTimeout(() => {
                window.open("https://gojek.com/gopay", "_blank");
              }, 2000);
            }}
            className="flex flex-row justify-start items-start border border-yellow-400 rounded-lg p-2 hover:bg-yellow-100 hover:cursor-pointer w-full"
          >
            <Image
              src="/logoGopay.png"
              alt="gopay"
              width={30}
              height={30}
              className="mr-2"
            />
            <div className="flex flex-col justify-start items-start text-yellow-500">
              <p className="text-xs">Buka Aplikasi</p>
              <p className="text-xs">Gopay</p>
            </div>
          </div>
          <div
            onClick={handleDownloadFullImage}
            className="flex flex-row justify-center items-center border border-yellow-400 rounded-lg p-3 hover:bg-yellow-100 hover:cursor-pointer w-full text-yellow-500"
          >
            <p className="text-md">Download Qris</p>
          </div>
        </div>

        <div
          onClick={startScan}
          className="flex flex-row justify-center text-center bg-yellow-500 rounded-lg p-3 hover:bg-yellow-100 hover:cursor-pointer w-full text-white"
        >
          <p className="text-md">Scan Voucher</p>
        </div>
      </div>

      {isScanning && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-900/50">
          <div id="qr-reader" className="w-full max-w-md" />
        </div>
      )}
    </>
  );
}
