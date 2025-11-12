/**
 * Brazukas Delivery - Merchant Settings
 * Configurações da loja
 */

import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import MerchantLayout from "@/components/MerchantLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function MerchantSettings() {
  const [match, params] = useRoute("/merchant/settings/:merchantId");
  const merchantId = params?.merchantId ? parseInt(params.merchantId) : 0;
  const [merchant, setMerchant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
    deliveryRadius: "",
    deliveryFee: "",
    minOrderValue: "",
  });

  const { data: merchantData } = trpc.merchants.getProfile.useQuery(
    { merchantId },
    { enabled: merchantId > 0 }
  );

  const updateMutation = trpc.merchants.updateProfile.useMutation();

  useEffect(() => {
    if (merchantData) {
      setMerchant(merchantData);
      setFormData({
        name: merchantData.name || "",
        email: merchantData.email || "",
        phone: merchantData.phone || "",
        description: merchantData.description || "",
        deliveryRadius: (merchantData.deliveryRadius || 0).toString(),
        deliveryFee: ((merchantData.deliveryFee || 0) / 100).toFixed(2),
        minOrderValue: ((merchantData.minOrderValue || 0) / 100).toFixed(2),
      });
      setLoading(false);
    }
  }, [merchantData]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateMutation.mutateAsync({
        merchantId,
        name: formData.name,
        phone: formData.phone,
        description: formData.description,
        deliveryRadius: parseInt(formData.deliveryRadius),
        deliveryFee: Math.round(parseFloat(formData.deliveryFee) * 100),
        minOrderValue: Math.round(parseFloat(formData.minOrderValue) * 100),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      alert("Erro ao salvar configurações");
    } finally {
      setSaving(false);
    }
  };

  if (!match) return null;
  if (loading) return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  if (!merchant) return <div className="text-muted-foreground">Loja não encontrada</div>;

  return (
    <MerchantLayout merchantId={merchantId} merchantName={merchant.name}>
      <div className="space-y-6 max-w-2xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">Gerenciar dados e configurações da sua loja</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="p-4 bg-green-100 text-green-800 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Configurações salvas com sucesso!
          </div>
        )}

        {/* General Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Informações Gerais</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nome da Loja</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Brasil Burgers"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contato@loja.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Telefone</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Descrição</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva sua loja..."
                className="h-24"
              />
            </div>
          </div>
        </Card>

        {/* Delivery Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Configurações de Entrega</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Raio de Entrega (km)</label>
                <Input
                  type="number"
                  value={formData.deliveryRadius}
                  onChange={(e) => setFormData({ ...formData, deliveryRadius: e.target.value })}
                  placeholder="5"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Taxa de Entrega (R$)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.deliveryFee}
                  onChange={(e) => setFormData({ ...formData, deliveryFee: e.target.value })}
                  placeholder="5.00"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Pedido Mínimo (R$)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.minOrderValue}
                  onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                  placeholder="20.00"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Bank Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Dados Bancários</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Banco</label>
                <Input placeholder="Bradesco" disabled />
              </div>
              <div>
                <label className="text-sm font-medium">Tipo de Conta</label>
                <Input placeholder="Corrente" disabled />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Agência</label>
                <Input placeholder="1234" disabled />
              </div>
              <div>
                <label className="text-sm font-medium">Conta</label>
                <Input placeholder="123456-7" disabled />
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Editar Dados Bancários
            </Button>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 border-red-200 bg-red-50">
          <h2 className="text-xl font-bold mb-4 text-red-900">Zona de Risco</h2>
          <div className="space-y-4">
            <p className="text-sm text-red-800">
              As ações abaixo são irreversíveis. Tenha cuidado ao executá-las.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-100">
                Desativar Loja
              </Button>
              <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-100">
                Deletar Loja
              </Button>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save className="w-4 h-4" />
            {saving ? "Salvando..." : "Salvar Configurações"}
          </Button>
          <Button variant="outline">Cancelar</Button>
        </div>
      </div>
    </MerchantLayout>
  );
}
