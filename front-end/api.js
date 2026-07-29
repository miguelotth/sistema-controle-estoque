
window.api = {

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