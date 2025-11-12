import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Camera, Lock } from "lucide-react";

interface ModalPODProps {
  orderId: string;
  pinDelivery: string;
  onClose: () => void;
  onSubmit: (pod: { type: "photo" | "pin"; url?: string; code?: string }) => Promise<void>;
}

export default function ModalPOD({ orderId, pinDelivery, onClose, onSubmit }: ModalPODProps) {
  const [method, setMethod] = useState<"photo" | "pin" | null>(null);
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhotoCapture = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      alert("Escolha ou tire uma foto");
      return;
    }

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        await onSubmit({
          type: "photo",
          url: dataUrl,
        });
        onClose();
      };
      reader.readAsDataURL(file);
    } catch (err) {
      alert("Erro ao processar foto");
    } finally {
      setLoading(false);
    }
  };

  const handlePinSubmit = async () => {
    if (pin.length !== 4) {
      alert("PIN deve ter 4 dígitos");
      return;
    }

    if (pin !== pinDelivery) {
      alert("PIN incorreto");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        type: "pin",
        code: pin,
      });
      onClose();
    } catch (err) {
      alert("Erro ao confirmar PIN");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Finalizar Entrega #{orderId}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!method ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-4">
              Escolha como comprovar a entrega:
            </p>

            <button
              onClick={() => setMethod("photo")}
              className="w-full flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-green-600 hover:bg-green-50 transition"
            >
              <Camera className="w-6 h-6 text-green-600" />
              <div className="text-left">
                <div className="font-medium">Foto da Entrega</div>
                <div className="text-sm text-gray-600">Tire uma foto do cliente</div>
              </div>
            </button>

            <button
              onClick={() => setMethod("pin")}
              className="w-full flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition"
            >
              <Lock className="w-6 h-6 text-blue-600" />
              <div className="text-left">
                <div className="font-medium">PIN do Cliente</div>
                <div className="text-sm text-gray-600">Digite o código de 4 dígitos</div>
              </div>
            </button>
          </div>
        ) : method === "photo" ? (
          <div className="space-y-4">
            <div className="bg-gray-100 rounded-lg p-4">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setMethod(null)}
                disabled={loading}
                className="flex-1"
              >
                Voltar
              </Button>
              <Button
                onClick={handlePhotoCapture}
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {loading ? "Enviando..." : "Confirmar Foto"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PIN de 4 dígitos
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="0000"
                className="w-full px-4 py-2 border-2 border-blue-300 rounded-lg text-center text-2xl font-bold tracking-widest focus:outline-none focus:border-blue-600"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setMethod(null)}
                disabled={loading}
                className="flex-1"
              >
                Voltar
              </Button>
              <Button
                onClick={handlePinSubmit}
                disabled={loading || pin.length !== 4}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {loading ? "Verificando..." : "Confirmar PIN"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
