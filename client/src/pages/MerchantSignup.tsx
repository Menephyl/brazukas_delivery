/**
 * Brazukas Delivery - Merchant Signup Page
 * Página para comerciantes criarem conta e cadastrarem sua loja
 */

import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Loader2, Upload } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function MerchantSignup() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"info" | "bank" | "confirm">("info");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    cnpj: "",
    description: "",
    category: "Restaurante",
  });

  const [bankData, setBankData] = useState({
    bank: "",
    account: "",
    accountType: "checking",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBankChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBankData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const signupMutation = trpc.merchants.signup.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validações básicas
      if (!formData.name || !formData.email || !formData.phone || !formData.cnpj) {
        throw new Error("Preencha todos os campos obrigatórios");
      }

      if (!/^\d{14}$/.test(formData.cnpj.replace(/\D/g, ""))) {
        throw new Error("CNPJ inválido");
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error("Email inválido");
      }

      // Chamar API de signup
      const result = await signupMutation.mutateAsync({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        cnpj: formData.cnpj.replace(/\D/g, ""),
        description: formData.description,
        category: formData.category,
        logo: logoPreview,
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          setLocation(`/merchant/dashboard/${result.merchantId}`);
        }, 2000);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao criar loja";
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Cadastre sua Loja</h1>
            <p className="text-lg text-muted-foreground">
              Comece a vender no Brazukas Delivery em poucos minutos
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex gap-4 mb-8">
            <div className={`flex-1 h-2 rounded-full ${step === "info" || step === "bank" || step === "confirm" ? "bg-primary" : "bg-muted"}`} />
            <div className={`flex-1 h-2 rounded-full ${step === "bank" || step === "confirm" ? "bg-primary" : "bg-muted"}`} />
            <div className={`flex-1 h-2 rounded-full ${step === "confirm" ? "bg-primary" : "bg-muted"}`} />
          </div>

          {success && (
            <Card className="p-6 mb-6 border-green-200 bg-green-50">
              <div className="flex gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-900">Loja criada com sucesso!</h3>
                  <p className="text-sm text-green-800">Redirecionando para seu dashboard...</p>
                </div>
              </div>
            </Card>
          )}

          {error && (
            <Card className="p-6 mb-6 border-red-200 bg-red-50">
              <div className="flex gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-900">Erro</h3>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </Card>
          )}

          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Informações Básicas */}
              {step === "info" && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Informações da Loja</h2>

                  <div>
                    <label className="block text-sm font-medium mb-2">Nome da Loja *</label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Ex: Brasil Burgers"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Telefone *</label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(61) 99999-9999"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">CNPJ *</label>
                    <Input
                      type="text"
                      name="cnpj"
                      value={formData.cnpj}
                      onChange={handleInputChange}
                      placeholder="00.000.000/0000-00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Endereço *</label>
                    <Input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Rua, número, bairro"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Categoria</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option>Restaurante</option>
                        <option>Pizzaria</option>
                        <option>Sushi</option>
                        <option>Açaí</option>
                        <option>Café</option>
                        <option>Outro</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Logo</label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="hidden"
                          id="logo-input"
                        />
                        <label
                          htmlFor="logo-input"
                          className="flex items-center justify-center gap-2 px-3 py-2 border rounded-md cursor-pointer hover:bg-muted"
                        >
                          <Upload className="w-4 h-4" />
                          {logo ? "Trocar" : "Fazer upload"}
                        </label>
                      </div>
                    </div>
                  </div>

                  {logoPreview && (
                    <div className="flex items-center gap-4">
                      <img src={logoPreview} alt="Logo preview" className="w-20 h-20 rounded-lg object-cover" />
                      <p className="text-sm text-muted-foreground">Logo preview</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-2">Descrição</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Descreva sua loja..."
                      className="w-full px-3 py-2 border rounded-md min-h-24"
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={() => setStep("bank")}
                    className="w-full"
                    disabled={loading}
                  >
                    Próximo
                  </Button>
                </div>
              )}

              {/* Step 2: Dados Bancários */}
              {step === "bank" && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Dados Bancários</h2>
                  <p className="text-sm text-muted-foreground">
                    Onde você gostaria de receber os pagamentos?
                  </p>

                  <div>
                    <label className="block text-sm font-medium mb-2">Banco *</label>
                    <Input
                      type="text"
                      name="bank"
                      value={bankData.bank}
                      onChange={handleBankChange}
                      placeholder="Ex: Banco do Brasil"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Tipo de Conta *</label>
                      <select
                        name="accountType"
                        value={bankData.accountType}
                        onChange={handleBankChange}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="checking">Corrente</option>
                        <option value="savings">Poupança</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Número da Conta *</label>
                      <Input
                        type="text"
                        name="account"
                        value={bankData.account}
                        onChange={handleBankChange}
                        placeholder="Agência / Conta"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep("info")}
                      className="flex-1"
                      disabled={loading}
                    >
                      Voltar
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setStep("confirm")}
                      className="flex-1"
                      disabled={loading}
                    >
                      Próximo
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Confirmação */}
              {step === "confirm" && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Confirme seus Dados</h2>

                  <div className="bg-muted p-4 rounded-lg space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Loja:</span>
                      <span className="font-medium">{formData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Email:</span>
                      <span className="font-medium">{formData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">CNPJ:</span>
                      <span className="font-medium">{formData.cnpj}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Banco:</span>
                      <span className="font-medium">{bankData.bank}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <input type="checkbox" id="terms" className="mt-1" required />
                    <label htmlFor="terms" className="text-sm">
                      Concordo com os <a href="/terms" className="text-primary underline">Termos de Serviço</a> e <a href="/privacy" className="text-primary underline">Política de Privacidade</a>
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep("bank")}
                      className="flex-1"
                      disabled={loading}
                    >
                      Voltar
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Criando loja...
                        </>
                      ) : (
                        "Criar Loja"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Já tem uma loja? <a href="/merchant/login" className="text-primary underline">Faça login</a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
