// Este arquivo não é mais usado - produtos agora vêm do banco de dados
// Mantido apenas para referência
import { Product, Category } from '@/types/product';

export const categories: Category[] = [
  { id: '1', name: 'Eletrônicos', slug: 'eletronicos', count: 0, image: null },
  { id: '2', name: 'Moda', slug: 'moda', count: 0, image: null },
  { id: '3', name: 'Casa e Decoração', slug: 'casa-decoracao', count: 0, image: null },
  { id: '4', name: 'Esportes', slug: 'esportes', count: 0, image: null },
  { id: '5', name: 'Livros', slug: 'livros', count: 0, image: null },
  { id: '6', name: 'Brinquedos', slug: 'brinquedos', count: 0, image: null },
];

export const products: Product[] = [];
