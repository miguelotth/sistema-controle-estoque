



/**
 * api.js - Camada de serviço de dados (Simulação de API com LocalStorage)
 *
 * Este arquivo abstrai o acesso aos dados para que a transição para uma API real (Express/MySQL)
 * seja extremamente fácil no futuro. Todas as funções retornam Promises para simular atrasos de rede.
 */

// Chaves utilizadas no LocalStorage
const STORAGE_PRODUCTS_KEY = 'erp_estoque_produtos';
const STORAGE_MOVEMENTS_KEY = 'erp_estoque_movimentacoes';

// Dados iniciais para preencher o sistema no primeiro acesso (visualização de ERP realista)
const DEFAULT_PRODUCTS = [
  {
    id: '1',
    sku: 'MP-AC-001',
    name: 'Chapa de Aço Carbono 2mm (1x2m)',
    category: 'Matéria-Prima',
    price: 189.90,
    quantity: 12,
    minQuantity: 20,
    description: 'Chapa de aço carbono laminada a quente para estruturas industriais.'
  },
  {
    id: '2',
    sku: 'CON-EL-325',
    name: 'Eletrodo Revestido E6013 3.25mm',
    category: 'Consumíveis',
    price: 1.85,
    quantity: 350,
    minQuantity: 100,
    description: 'Eletrodo para soldagem em geral em aço carbono.'
  },
  {
    id: '3',
    sku: 'LUB-GR-001',
    name: 'Graxa Grafitada Chassis 1kg',
    category: 'Lubrificantes',
    price: 38.50,
    quantity: 6,
    minQuantity: 10,
    description: 'Graxa lubrificante à base de cálcio com grafite de alta aderência.'
  },
  {
    id: '4',
    sku: 'DIS-CO-115',
    name: 'Disco de Corte Inox 4.1/2"',
    category: 'Ferramentas',
    price: 6.90,
    quantity: 75,
    minQuantity: 50,
    description: 'Disco abrasivo para corte rápido de aço inoxidável e ligas.'
  },
  {
    id: '5',
    sku: 'PAR-SE-122',
    name: 'Parafuso Sextavado M12 x 50mm 8.8',
    category: 'Fixadores',
    price: 4.20,
    quantity: 120,
    minQuantity: 150,
    description: 'Parafuso sextavado de alta resistência, acabamento zincado.'
  }
];

const DEFAULT_MOVEMENTS = [
  {
    id: '1',
    productId: '1',
    productName: 'Chapa de Aço Carbono 2mm (1x2m)',
    sku: 'MP-AC-001',
    type: 'saida', // 'entrada' ou 'saida'
    quantity: 3,
    date: '2026-06-09T10:30:00.000Z',
    reason: 'Ordem de Serviço #1052'
  },
  {
    id: '2',
    productId: '2',
    productName: 'Eletrodo Revestido E6013 3.25mm',
    sku: 'CON-EL-325',
    type: 'entrada',
    quantity: 200,
    date: '2026-06-08T15:45:00.000Z',
    reason: 'Nota Fiscal de Compra #44920'
  }
];

// Helper: Simular latência de rede (300ms)
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: Obter dados locais
function getStoredData(key, defaultVal) {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultVal));
    return defaultVal;
  }
  return JSON.parse(data);
}

// Helper: Gravar dados locais
function setStoredData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// API de Produtos (exposta globalmente para evitar bloqueio de CORS ao abrir como arquivo local)
window.api = {
  // Obter todos os produtos
 async getProducts() {

  const response = await fetch(
    "http://localhost:3000/produtos"
  );

  const products = await response.json();

  return products.map(p => ({
    id: p.id,
    sku: p.sku,
    name: p.nome,
    category: p.categoria,
    price: Number(p.preco),
    quantity: p.quantidade,
    minQuantity: p.quantidade_minima,
    description: p.descricao
  }));

},

  // Obter produto por ID
  async getProductById(id) {
    await delay();
    const products = getStoredData(STORAGE_PRODUCTS_KEY, DEFAULT_PRODUCTS);
    return products.find(p => p.id === id) || null;
  },

  // Criar novo produto
  async createProduct(productData) {

  const response = await fetch(
    "http://localhost:3000/produtos",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sku: productData.sku,
        nome: productData.name,
        categoria: productData.category,
        preco: parseFloat(productData.price),
        quantidade: parseInt(productData.quantity),
        quantidade_minima: parseInt(productData.minQuantity),
        descricao: productData.description
      })
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.erro || "Erro ao cadastrar produto");
  }

  return result;
},
  // Atualizar produto existente
  async updateProduct(id, updatedData) {
    await delay();
    const products = getStoredData(STORAGE_PRODUCTS_KEY, DEFAULT_PRODUCTS);
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
      throw new Error('Produto não localizado.');
    }

    const currentProduct = products[index];

    // Se o SKU mudou, validar unicidade
    const newSku = updatedData.sku ? updatedData.sku.trim().toUpperCase() : currentProduct.sku;
    if (newSku !== currentProduct.sku && products.some(p => p.sku === newSku && p.id !== id)) {
      throw new Error(`Já existe outro produto cadastrado com o SKU/Código: ${newSku}`);
    }

    // Guardar quantidade antiga para comparar se houve mudança direta
    const oldQty = currentProduct.quantity;
    const newQty = parseInt(updatedData.quantity) || 0;

    const updatedProduct = {
      ...currentProduct,
      sku: newSku,
      name: updatedData.name.trim(),
      category: updatedData.category.trim() || 'Sem Categoria',
      price: parseFloat(updatedData.price) || 0,
      quantity: newQty,
      minQuantity: parseInt(updatedData.minQuantity) || 0,
      description: updatedData.description ? updatedData.description.trim() : ''
    };

    products[index] = updatedProduct;
    setStoredData(STORAGE_PRODUCTS_KEY, products);

    // Registra movimentação de ajuste se a quantidade foi modificada manualmente
    if (newQty !== oldQty) {
      const diff = newQty - oldQty;
      await this.registerMovement({
        productId: id,
        productName: updatedProduct.name,
        sku: updatedProduct.sku,
        type: diff > 0 ? 'entrada' : 'saida',
        quantity: Math.abs(diff),
        reason: 'Ajuste Manual de Cadastro'
      });
    }

    return updatedProduct;
  },

  // Deletar produto
  async deleteProduct(id) {
    await delay();
    const products = getStoredData(STORAGE_PRODUCTS_KEY, DEFAULT_PRODUCTS);
    const productToDelete = products.find(p => p.id === id);

    if (!productToDelete) {
      throw new Error('Produto não localizado.');
    }

    const filtered = products.filter(p => p.id !== id);
    setStoredData(STORAGE_PRODUCTS_KEY, filtered);

    // Limpar histórico associado (opcional, mas bom manter para consistência)
    const movements = getStoredData(STORAGE_MOVEMENTS_KEY, DEFAULT_MOVEMENTS);
    const filteredMovements = movements.filter(m => m.productId !== id);
    setStoredData(STORAGE_MOVEMENTS_KEY, filteredMovements);

    return true;
  },

  // Registrar Entrada ou Saída de Estoque avulsa
  async adjustStock(id, type, qty, reason) {
    await delay();
    if (qty <= 0) throw new Error('A quantidade deve ser maior que zero.');
    if (type !== 'entrada' && type !== 'saida') throw new Error('Tipo de movimentação inválido.');

    const products = getStoredData(STORAGE_PRODUCTS_KEY, DEFAULT_PRODUCTS);
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
      throw new Error('Produto não localizado.');
    }

    const product = products[index];

    if (type === 'saida' && product.quantity < qty) {
      throw new Error(`Estoque insuficiente. Saldo disponível: ${product.quantity} unidades.`);
    }

    // Atualiza quantidade
    if (type === 'entrada') {
      product.quantity += qty;
    } else {
      product.quantity -= qty;
    }

    products[index] = product;
    setStoredData(STORAGE_PRODUCTS_KEY, products);

    // Registrar movimentação
    await this.registerMovement({
      productId: id,
      productName: product.name,
      sku: product.sku,
      type: type,
      quantity: qty,
      reason: reason || (type === 'entrada' ? 'Ajuste de Entrada' : 'Ajuste de Saída')
    });

    return product;
  },

  // Registrar Movimentação no Histórico
  async registerMovement({ productId, productName, sku, type, quantity, reason }) {
    const movements = getStoredData(STORAGE_MOVEMENTS_KEY, DEFAULT_MOVEMENTS);
    
    const newMovement = {
      id: Date.now().toString() + Math.random().toString().slice(-4),
      productId,
      productName,
      sku,
      type,
      quantity: parseInt(quantity),
      date: new Date().toISOString(),
      reason: reason || ''
    };

    movements.unshift(newMovement); // Adiciona no início (mais recente primeiro)
    setStoredData(STORAGE_MOVEMENTS_KEY, movements);
    return newMovement;
  },

  // Obter Histórico de Movimentações
  async getMovements() {
    await delay();
    return getStoredData(STORAGE_MOVEMENTS_KEY, DEFAULT_MOVEMENTS);
  }
};
