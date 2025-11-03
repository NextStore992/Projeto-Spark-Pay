import { useState } from 'react';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, Product } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';

export default function ProductsManager() {
  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    image: '',
    images: [] as string[],
    category: '',
    featured: false,
    in_stock: true,
    rating: 0,
    reviews: 0,
    discount: 0,
    tags: '',
  });
  const [imageInput, setImageInput] = useState('');

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      image: '',
      images: [],
      category: '',
      featured: false,
      in_stock: true,
      rating: 0,
      reviews: 0,
      discount: 0,
      tags: '',
    });
    setImageInput('');
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image || '',
      images: (product as any).images || [],
      category: product.category,
      featured: product.featured,
      in_stock: product.in_stock,
      rating: product.rating || 0,
      reviews: product.reviews,
      discount: product.discount || 0,
      tags: product.tags?.join(', ') || '',
    });
    setImageInput('');
    setIsDialogOpen(true);
  };

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageInput.trim()],
      }));
      setImageInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      images: formData.images.length > 0 ? formData.images : [],
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : null,
    };

    if (editingProduct) {
      await updateProduct.mutateAsync({ id: editingProduct.id, ...productData });
    } else {
      await createProduct.mutateAsync(productData);
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      await deleteProduct.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gerenciar Produtos</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="description">Descrição *</Label>
                  <Textarea
                    id="description"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Preço *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.slug}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="image">URL da Imagem Principal</Label>
                  <Input
                    id="image"
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label>Imagens Adicionais</Label>
                  <div className="flex gap-2">
                    <Input
                      value={imageInput}
                      onChange={(e) => setImageInput(e.target.value)}
                      placeholder="URL da imagem..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddImage();
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddImage} variant="outline">
                      Adicionar
                    </Button>
                  </div>
                  {formData.images.length > 0 && (
                    <div className="space-y-2 mt-2 max-h-48 overflow-y-auto">
                      {formData.images.map((img, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 border rounded">
                          <img src={img} alt={`Preview ${index + 1}`} className="h-12 w-12 object-cover rounded" />
                          <span className="flex-1 text-sm truncate">{img}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveImage(index)}
                          >
                            Remover
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount">Desconto (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rating">Avaliação (0-5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reviews">Número de Avaliações</Label>
                  <Input
                    id="reviews"
                    type="number"
                    min="0"
                    value={formData.reviews}
                    onChange={(e) => setFormData({ ...formData, reviews: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="eletrônico, popular, novidade"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                  <Label htmlFor="featured">Produto em Destaque</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="in_stock"
                    checked={formData.in_stock}
                    onCheckedChange={(checked) => setFormData({ ...formData, in_stock: checked })}
                  />
                  <Label htmlFor="in_stock">Em Estoque</Label>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
                <Button type="submit" disabled={createProduct.isPending || updateProduct.isPending}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-center text-muted-foreground">Carregando produtos...</p>
      ) : products.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">Nenhum produto cadastrado</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Primeiro Produto
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Imagem</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Nome</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Categoria</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Preço</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <img
                        src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'}
                        alt={product.name}
                        className="h-12 w-12 rounded object-cover"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium">{product.name}</td>
                    <td className="px-4 py-3 text-sm">{product.category}</td>
                    <td className="px-4 py-3 text-sm font-medium">R$ {product.price.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        product.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {product.in_stock ? 'Em Estoque' : 'Fora de Estoque'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(product.id)}
                          disabled={deleteProduct.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}