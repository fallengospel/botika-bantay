'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Camera, X, Loader2 } from 'lucide-react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

const SCANNER_DOM_ID = 'botika-barcode-reader';

const SUPPORTED_FORMATS = [
  Html5QrcodeSupportedFormats.QR_CODE,
  Html5QrcodeSupportedFormats.EAN_13,
  Html5QrcodeSupportedFormats.EAN_8,
  Html5QrcodeSupportedFormats.UPC_A,
  Html5QrcodeSupportedFormats.UPC_E,
  Html5QrcodeSupportedFormats.CODE_128,
  Html5QrcodeSupportedFormats.CODE_39,
];

interface CameraScannerProps {
  onScan: (decodedText: string) => void;
  onClose: () => void;
}

/**
 * Local on-device QR/barcode camera scanner (html5-qrcode).
 * No cloud / Gemini — decode happens in the browser.
 */
export default function CameraScanner({ onScan, onClose }: CameraScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const handledRef = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(true);

  const stopScanner = useCallback(async () => {
    const scanner = scannerRef.current;
    scannerRef.current = null;
    if (!scanner) return;
    try {
      if (scanner.isScanning) {
        await scanner.stop();
      }
      scanner.clear();
    } catch {
      // ignore stop races
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const start = async () => {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        setError('Camera is not available in this browser. Use Manual Lookup instead.');
        setStarting(false);
        return;
      }

      try {
        const scanner = new Html5Qrcode(SCANNER_DOM_ID, {
          formatsToSupport: SUPPORTED_FORMATS,
          verbose: false,
        });
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 240, height: 240 },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            if (handledRef.current) return;
            handledRef.current = true;
            onScan(decodedText);
          },
          () => {
            // per-frame decode miss — expected
          }
        );

        if (!cancelled) setStarting(false);
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error
            ? err.message
            : 'Could not open camera. Check permissions and try again.';
        setError(
          /permission|denied|not allowed/i.test(message)
            ? 'Camera permission denied. Allow camera access in your browser, then try again.'
            : message
        );
        setStarting(false);
      }
    };

    void start();

    return () => {
      cancelled = true;
      void stopScanner();
    };
  }, [onScan, stopScanner]);

  const handleClose = () => {
    void stopScanner().finally(() => onClose());
  };

  return (
    <div className="card-elevated mb-6 overflow-hidden">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h2 className="font-semibold text-surface-900 flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Camera scan
          </h2>
          <p className="text-sm text-surface-500 mt-1">
            Point at QR or barcode — decodes on your device (no cloud AI).
          </p>
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="btn-outline text-sm shrink-0"
          aria-label="Close camera"
        >
          <X className="w-3.5 h-3.5" />
          Close
        </button>
      </div>

      {error ? (
        <div
          role="alert"
          className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800"
        >
          {error}
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden bg-black">
          {starting && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 text-white/90 bg-black/60">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-sm">Starting camera…</span>
            </div>
          )}
          <div id={SCANNER_DOM_ID} className="min-h-[280px] [&_video]:w-full [&_canvas]:w-full" />
        </div>
      )}
    </div>
  );
}
