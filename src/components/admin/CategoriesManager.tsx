import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Pencil, Trash2, Plus } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';

export default function CategoriesManager() {
  const { data: categories, isLoading, refetch } = useCategories();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    image: '',
  });

  const resetForm = () => {
    setFormData({ name: '', slug: '', image: '' });
    setEditingId(null);
  };

  const handleEdit = (category: any) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      image: category.image || '',
    });
    setEditingId(category.id);
    setOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    setSaving(true);
    try {
      const categoryData = {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
        image: formData.image || null,
      };

      if (editingId) {
        const { error } = await (supabase as any)
          .from('categories')
          .update(categoryData)
          .eq('id', editingId);
        if (error) throw error;
        toast.success('Categoria atualizada!');
      } else {
        const { error } = await (supabase as any)
          .from('categories')
          .insert(categoryData);
        if (error) throw error;
        toast.success('Categoria criada!');
      }

      resetForm();
      setOpen(false);
      refetch();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Erro ao salvar categoria');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta categoria?')) return;

    try {
      const { error } = await (supabase as any)
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Categoria deletada!');
      refetch();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Erro ao deletar categoria');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gerenciar Categorias</CardTitle>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Editar Categoria' : 'Nova Categoria'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Eletrônicos"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (opcional)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="eletronicos"
                />
                <p className="text-xs text-muted-foreground">
                  Deixe vazio para gerar automaticamente
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">URL da Imagem (opcional)</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Produtos</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.map((category: any) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                <TableCell>{category.count || 0}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(category)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
