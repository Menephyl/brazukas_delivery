/**
 * Brazukas Delivery - Product Manager
 * Gerenciador de produtos da loja
 */

import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import MerchantLayout from "@/components/MerchantLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  isAvailable: boolean;
  image?: string;
  preparationTime: number;
}

export default function ProductManager() {
  const [match, params] = useRoute("/merchant/products/:merchantId");
  const merchantId = params?.merchantId ? parseInt(params.merchantId) : 0;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    preparationTime: "15",
    description: "",
  });

  const { data: productsData } = trpc.merchants.listProducts.useQuery(
    { merchantId },
    { enabled: merchantId > 0 }
  );
  const createProductMutation = trpc.merchants.createProduct.useMutation();
  const deleteProductMutation = trpc.merchants.deleteProduct.useMutation();

  useEffect(() => {
    if (productsData) {
      setProducts(productsData as Product[]);
      setLoading(false);
    }
  }, [productsData]);

  const handleAddProduct = async () => {
    if (!formData.name || !formData.price) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      await createProductMutation.mutateAsync({
        merchantId,
        name: formData.name,
        price: parseFloat(formData.price),
        category: formData.category,
        preparationTime: parseInt(formData.preparationTime),
        description: formData.description,
      });

      setFormData({ name: "", price: "", category: "", preparationTime: "15", description: "" });
      setShowForm(false);
      // Refresh products - add new product to list
      const newProduct: Product = {
        id: Math.random(),
        name: formData.name,
        price: parseFloat(formData.price) * 100,
        category: formData.category,
        isAvailable: true,
        preparationTime: parseInt(formData.preparationTime),
      };
      setProducts([...products, newProduct]);
    } catch (error) {
      console.error(error);
      alert("Erro ao adicionar produto");
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm("Tem certeza que deseja deletar este produto?")) return;

    try {
      await deleteProductMutation.mutateAsync({ productId });
      setProducts(products.filter((p) => p.id !== productId));
    } catch (error) {
      console.error(error);
      alert("Erro ao deletar produto");
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!match) return null;

  return (
    <MerchantLayout merchantId={merchantId} merchantName="Minha Loja">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Produtos</h1>
            <p className="text-muted-foreground">Gerenciar produtos da sua loja</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Produto
          </Button>
        </div>

        {/* Add Product Form */}
        {showForm && (
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Adicionar Novo Produto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Nome do produto"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                placeholder="Preço (R$)"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
              <Input
                placeholder="Categoria"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
              <Input
                placeholder="Tempo de preparo (min)"
                type="number"
                value={formData.preparationTime}
                onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
              />
              <Input
                placeholder="Descrição"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="md:col-span-2"
              />
              <div className="flex gap-2 md:col-span-2">
                <Button onClick={handleAddProduct} className="flex-1">
                  Salvar Produto
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Carregando produtos...</div>
        ) : filteredProducts.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">Nenhum produto encontrado</p>
            <Button onClick={() => setShowForm(true)}>Adicionar Primeiro Produto</Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="p-4 hover:shadow-lg transition-shadow">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                )}
                <div className="space-y-2">
                  <h3 className="font-bold text-lg">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div>
                      <p className="text-2xl font-bold">R$ {(product.price / 100).toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">
                        Preparo: {product.preparationTime} min
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-muted rounded-lg">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 hover:bg-red-100 rounded-lg text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        product.isAvailable ? "bg-green-600" : "bg-red-600"
                      }`}
                    />
                    <span className="text-sm">
                      {product.isAvailable ? "Disponível" : "Indisponível"}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MerchantLayout>
  );
}
