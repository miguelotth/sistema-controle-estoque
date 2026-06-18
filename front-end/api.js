



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
        preco: productData.price,
        quantidade: productData.quantity,
        quantidade_minima: productData.minQuantity,
        descricao: productData.description
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.erro || "Erro ao cadastrar produto");
  }

  return data;
},
  // Atualizar produto existente
async updateProduct(id, updatedData) {

  const response = await fetch(
    `http://localhost:3000/produtos/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sku: updatedData.sku,
        nome: updatedData.name,
        categoria: updatedData.category,
        preco: updatedData.price,
        quantidade: updatedData.quantity,
        quantidade_minima: updatedData.minQuantity,
        descricao: updatedData.description
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.erro || "Erro ao atualizar produto");
  }

  return data;
},

  // Deletar produto
  async deleteProduct(id) {

  const response = await fetch(
    `http://localhost:3000/produtos/${id}`,
    {
      method: "DELETE"
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.erro || "Erro ao excluir produto");
  }

  return true;
},

  // Registrar Entrada ou Saída de Estoque avulsa
async adjustStock(id, type, qty, reason) {

  const response = await fetch(
    `http://localhost:3000/produtos/${id}/movimentar`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        tipo: type,
        quantidade: qty
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.erro);
  }

  return data;
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
