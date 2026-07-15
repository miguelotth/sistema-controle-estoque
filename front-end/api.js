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

    if (!response.ok) {
      throw new Error("Erro ao buscar produtos");
    }

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

  // Obter produto por ID (LEGADO: ainda usa LocalStorage, ver OBS no topo do arquivo)
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
          quantidade: qty,
          motivo: reason
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.erro || "Erro ao movimentar estoque");
    }

    return data;
  },

  // Registrar Movimentação no Histórico (LEGADO: ver OBS no topo do arquivo.
  // O backend já registra a movimentação dentro de adjustStock, então esta
  // função não deve ser chamada em conjunto com adjustStock para evitar duplicidade)
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

    const response = await fetch(
      "http://localhost:3000/movimentacoes"
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar movimentações");
    }

    const data = await response.json();

    return data.map(m => ({
      id: m.id,
      productId: m.produto_id,
      productName: m.nome,
      sku: m.sku,
      type: m.tipo,
      quantity: Number(m.quantidade),
      reason: m.motivo,
      date: m.data_movimentacao
    }));

  }

};