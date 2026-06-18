/**
 * app.js - Controlador principal do Frontend do Controle de Estoque
 * 
 * Conecta os elementos da interface (DOM) com a camada de serviço (api.js).
 * Implementa renderização de tabelas, filtros rápidos, preenchimento de KPIs,
 * gerenciamento de modais e exibição de alertas de feedback (toasts).
 */

// A variável 'api' é carregada no escopo global a partir de api.js no index.html

// --- ELEMENTOS DO DOM ---
const elements = {
  // Abas
  tabEstoqueBtn: document.getElementById('tab-estoque-btn'),
  tabMovimentacoesBtn: document.getElementById('tab-movimentacoes-btn'),
  tabEstoque: document.getElementById('tab-estoque'),
  tabMovimentacoes: document.getElementById('tab-movimentacoes'),

  // KPIs
  kpiTotalSkus: document.getElementById('kpi-total-skus'),
  kpiTotalItems: document.getElementById('kpi-total-items'),
  kpiTotalValue: document.getElementById('kpi-total-value'),
  kpiLowStockCount: document.getElementById('kpi-low-stock-count'),
  kpiCardLowStock: document.getElementById('kpi-card-low-stock'),

  // Filtros
  searchFilter: document.getElementById('search-filter'),
  categoryFilter: document.getElementById('category-filter'),
  lowStockFilter: document.getElementById('low-stock-filter'),
  btnResetFilters: document.getElementById('btn-reset-filters'),

  // Tabelas
  productsTableBody: document.getElementById('products-table-body'),
  noProductsMsg: document.getElementById('no-products-msg'),
  movementsTableBody: document.getElementById('movements-table-body'),
  noMovementsMsg: document.getElementById('no-movements-msg'),
  movementCount: document.getElementById('movement-count'),

  // Modais
  modalProductBackdrop: document.getElementById('modal-product-backdrop'),
  modalMovementBackdrop: document.getElementById('modal-movement-backdrop'),
  modalDeleteBackdrop: document.getElementById('modal-delete-backdrop'),
  
  // Botões de abertura de modal
  btnOpenAddModal: document.getElementById('btn-open-add-modal'),
  btnSaveProduct: document.getElementById('btn-save-product'),

  // Formulário Produto
  productForm: document.getElementById('product-form'),
  productModalTitle: document.getElementById('product-modal-title'),
  productId: document.getElementById('product-id'),
  productSku: document.getElementById('product-sku'),
  productCategory: document.getElementById('product-category'),
  productName: document.getElementById('product-name'),
  productPrice: document.getElementById('product-price'),
  productMinQuantity: document.getElementById('product-min-quantity'),
  productQuantity: document.getElementById('product-quantity'),
  initialQtyContainer: document.getElementById('initial-qty-container'),
  productDescription: document.getElementById('product-description'),

  // Formulário Movimentação
  movementForm: document.getElementById('movement-form'),
  movementProductId: document.getElementById('movement-product-id'),
  movementProductName: document.getElementById('movement-product-name'),
  movementType: document.getElementById('movement-type'),
  movementQty: document.getElementById('movement-qty'),
  movementReason: document.getElementById('movement-reason'),

  // Confirmação de Exclusão
  deleteProductDisplayName: document.getElementById('delete-product-display-name'),
  btnConfirmDelete: document.getElementById('btn-confirm-delete'),

  // Notificações e metadados
  toastContainer: document.getElementById('toast-container'),
  currentDate: document.getElementById('current-date')
};

// --- ESTADO LOCAL DO FRONTEND ---
let state = {
  products: [],
  movements: [],
  productIdToDelete: null,
  activeTab: 'estoque' // 'estoque' ou 'movimentacoes'
};

// --- FORMATADORES AUXILIARES ---
const formatCurrency = (val) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// --- TOAST NOTIFICATIONS (Alertas rápidos estilo banco) ---
const showToast = (message, type = 'success') => {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  toast.innerHTML = `
    <span>${message}</span>
    <button style="background:none; border:none; font-weight:bold; cursor:pointer;" onclick="this.parentElement.remove()">&times;</button>
  `;
  
  elements.toastContainer.appendChild(toast);
  
  setTimeout(() => {
    if (toast.parentElement) {
      toast.remove();
    }
  }, 4000);
};

// --- CARREGAR DADOS---
const loadData = async () => {
  try {
    state.products = await api.getProducts();
    state.movements = await api.getMovements();
    
    updateCategoryFilterDropdown();
    renderDashboard();
    renderProductsTable();
    renderMovementsTable();
  } catch (error) {
    showToast('Falha ao sincronizar dados com o banco de dados.', 'error');
    console.error(error);
  }
};

// --- CONTROLE DE EXIBIÇÃO DE ABA ---
const switchTab = (tab) => {
  state.activeTab = tab;
  if (tab === 'estoque') {
    elements.tabEstoqueBtn.classList.add('active');
    elements.tabMovimentacoesBtn.classList.remove('active');
    elements.tabEstoque.classList.add('active');
    elements.tabMovimentacoes.classList.remove('active');
  } else {
    elements.tabEstoqueBtn.classList.remove('active');
    elements.tabMovimentacoesBtn.classList.add('active');
    elements.tabEstoque.classList.remove('active');
    elements.tabMovimentacoes.classList.add('active');
    // Atualizar tabela de movimentos em tempo real
    renderMovementsTable();
  }
};

// --- ATUALIZAR CATEGORIAS NO FILTRO SELECT ---
const updateCategoryFilterDropdown = () => {
  const currentValue = elements.categoryFilter.value;
  
  // Obter categorias únicas existentes nos produtos
  const categories = [...new Set(state.products.map(p => p.category))].filter(Boolean).sort();
  
  // Manter apenas a primeira opção padrão "Todas as Categorias"
  elements.categoryFilter.innerHTML = '<option value="">Todas as Categorias</option>';
  
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    elements.categoryFilter.appendChild(opt);
  });

  // Restaurar o valor selecionado se ele ainda existir
  if (categories.includes(currentValue)) {
    elements.categoryFilter.value = currentValue;
  }
};

// --- ATUALIZAR ACÚMULO DE DADOS NO PAINEL DE METAS (KPIs) ---
const renderDashboard = () => {
  const totalSkus = state.products.length;
  
  let totalItems = 0;
  let totalValue = 0;
  let lowStockCount = 0;

  state.products.forEach(p => {
    totalItems += p.quantity;
    totalValue += (p.price * p.quantity);
    
    if (p.quantity < p.minQuantity) {
      lowStockCount++;
    }
  });

  elements.kpiTotalSkus.textContent = totalSkus;
  elements.kpiTotalItems.textContent = totalItems;
  elements.kpiTotalValue.textContent = formatCurrency(totalValue);
  elements.kpiLowStockCount.textContent = lowStockCount;

  // Destacar levemente se houver alerta de estoque baixo
  if (lowStockCount > 0) {
    elements.kpiCardLowStock.style.borderColor = 'var(--color-warning)';
    elements.kpiCardLowStock.style.backgroundColor = 'var(--color-warning-bg)';
  } else {
    elements.kpiCardLowStock.style.borderColor = 'var(--border-color)';
    elements.kpiCardLowStock.style.backgroundColor = 'var(--bg-card)';
  }
};

// --- LISTAGEM DE PRODUTOS ---
const renderProductsTable = () => {
  const searchTerm = elements.searchFilter.value.toLowerCase().trim();
  const categoryFilterVal = elements.categoryFilter.value;
  const lowStockFilterChecked = elements.lowStockFilter.checked;

  // Filtra dados com base nos filtros ativos
  const filteredProducts = state.products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm) || p.sku.toLowerCase().includes(searchTerm);
    const matchesCategory = !categoryFilterVal || p.category === categoryFilterVal;
    const matchesLowStock = !lowStockFilterChecked || p.quantity < p.minQuantity;
    return matchesSearch && matchesCategory && matchesLowStock;
  });

  elements.productsTableBody.innerHTML = '';

  if (filteredProducts.length === 0) {
    elements.noProductsMsg.style.display = 'block';
    return;
  }

  elements.noProductsMsg.style.display = 'none';

  filteredProducts.forEach(product => {
    const isLow = product.quantity < product.minQuantity;
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td class="code-col">${product.sku}</td>
      <td style="font-weight: 600;">${product.name}</td>
      <td><span class="badge badge-neutral">${product.category}</span></td>
      <td class="price-col">${formatCurrency(product.price)}</td>
      <td class="qty-col" style="font-weight: 600; color: ${isLow ? 'var(--color-danger)' : 'inherit'};">
        ${product.quantity}
      </td>
      <td class="qty-col" style="color: var(--text-secondary); font-size: 12px;">${product.minQuantity}</td>
      <td style="text-align: center;">
        <span class="badge ${isLow ? 'badge-danger' : 'badge-success'}">
          ${isLow ? 'Estoque Baixo' : 'Normal'}
        </span>
      </td>
      <td style="text-align: center;">
        <div class="action-buttons" style="justify-content: center;">
          <button class="btn btn-secondary btn-sm" data-action="move" data-id="${product.id}">
            &plus;&sol;&minus; Movimentar
          </button>
          <button class="btn btn-secondary btn-sm" data-action="edit" data-id="${product.id}">
            Editar
          </button>
          <button class="btn btn-danger-outline btn-sm" data-action="delete" data-id="${product.id}">
            Excluir
          </button>
        </div>
      </td>
    `;
    elements.productsTableBody.appendChild(tr);
  });
};

// --- LISTAGEM DE HISTÓRICO ---
const renderMovementsTable = () => {
  elements.movementsTableBody.innerHTML = '';
  
  if (state.movements.length === 0) {
    elements.noMovementsMsg.style.display = 'block';
    elements.movementCount.textContent = '0 movimentações';
    return;
  }

  elements.noMovementsMsg.style.display = 'none';
  elements.movementCount.textContent = `${state.movements.length} movimentações registradas`;

  state.movements.forEach(move => {
    const tr = document.createElement('tr');
    const isEntrada = move.type === 'entrada';

    tr.innerHTML = `
      <td style="color: var(--text-secondary); font-size: 13px;">${formatDate(move.date)}</td>
      <td class="code-col">${move.sku}</td>
      <td style="font-weight: 500;">${move.productName}</td>
      <td style="text-align: center;">
        <span class="badge" style="background-color: ${isEntrada ? 'var(--color-success-bg)' : 'var(--color-danger-bg)'}; color: ${isEntrada ? 'var(--color-success)' : 'var(--color-danger)'};">
          ${isEntrada ? 'Entrada' : 'Saída'}
        </span>
      </td>
      <td class="qty-col" style="font-weight: 600; color: ${isEntrada ? 'var(--color-success)' : 'var(--color-danger)'};">
        ${isEntrada ? '+' : '-'}${move.quantity}
      </td>
      <td style="font-style: italic; color: var(--text-secondary); max-width: 250px; overflow: hidden; text-overflow: ellipsis;">
        ${move.reason}
      </td>
    `;
    elements.movementsTableBody.appendChild(tr);
  });
};

// --- GERENCIAMENTO DE OPERAÇÕES CRUD / INTERAÇÕES DA TABELA ---
const handleTableActions = (e) => {
  const button = e.target.closest('button');
  if (!button) return;

  const action = button.dataset.action;
  const id = button.dataset.id;

console.log("Botão clicado:", action, id);

  const product = state.products.find(
  p => String(p.id) === String(id)
);
  if (!product) return;

  if (action === 'move') {
    // Abrir Modal de Movimentação Rápida
    elements.movementProductId.value = product.id;
    elements.movementProductName.value = product.name;
    elements.movementQty.value = '';
    elements.movementReason.value = '';
    elements.modalMovementBackdrop.classList.add('active');
  } else if (action === 'edit') {
    // Abrir Modal de Edição de Produto
    elements.productModalTitle.textContent = 'Editar Dados do Produto';
    elements.productId.value = product.id;
    elements.productSku.value = product.sku;
    elements.productCategory.value = product.category;
    elements.productName.value = product.name;
    elements.productPrice.value = product.price;
    elements.productMinQuantity.value = product.minQuantity;
    elements.productDescription.value = product.description;
    
    // Esconde a quantidade inicial na edição (para evitar distorções de estoque sem justificativa)
    elements.initialQtyContainer.style.display = 'none';
    elements.productQuantity.removeAttribute('required');

    elements.modalProductBackdrop.classList.add('active');
  } else if (action === 'delete') {
    // Abrir Confirmação de Exclusão
    state.productIdToDelete = product.id;
    elements.deleteProductDisplayName.textContent = `${product.name} (${product.sku})`;
    elements.modalDeleteBackdrop.classList.add('active');
  }
};

// --- SUBMIT: FORMULÁRIO DE PRODUTO (Criar / Editar) ---
const handleProductSubmit = async (e) => {
  e.preventDefault();
  
  const id = elements.productId.value;
  const productData = {
    sku: elements.productSku.value,
    category: elements.productCategory.value,
    name: elements.productName.value,
    price: elements.productPrice.value,
    minQuantity: elements.productMinQuantity.value,
    quantity: elements.productQuantity.value || 0,
    description: elements.productDescription.value
  };

  const btnSave = elements.btnSaveProduct;
  const originalText = btnSave.textContent;
  
  try {
    btnSave.disabled = true;
    btnSave.textContent = 'Gravando...';

    if (id) {
      // Modo Edição
      await api.updateProduct(id, productData);
      showToast('Produto atualizado com sucesso no estoque!');
    } else {
      // Modo Cadastro
      await api.createProduct(productData);
      showToast('Produto cadastrado com sucesso!');
    }

    elements.modalProductBackdrop.classList.remove('active');
    await loadData();
  } catch (error) {
    showToast(error.message || 'Erro ao salvar o produto.', 'error');
  } finally {
    btnSave.disabled = false;
    btnSave.textContent = originalText;
  }
};

// --- SUBMIT: FORMULÁRIO DE MOVIMENTAÇÃO (Entrada/Saída) ---
const handleMovementSubmit = async (e) => {
  e.preventDefault();

  const id = elements.movementProductId.value;
  const type = elements.movementType.value;
  const qty = parseInt(elements.movementQty.value);
  const reason = elements.movementReason.value.trim();

  const btnSubmit = elements.movementForm.querySelector('button[type="submit"]');
  const originalText = btnSubmit.textContent;

  try {
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Registrando...';

    await api.adjustStock(id, type, qty, reason);
    
    showToast(`Movimentação de ${type === 'entrada' ? 'entrada' : 'saída'} lançada com sucesso!`);
    elements.modalMovementBackdrop.classList.remove('active');
    
    await loadData();
  } catch (error) {
    showToast(error.message || 'Erro ao registrar movimentação.', 'error');
  } finally {
    btnSubmit.disabled = false;
    btnSubmit.textContent = originalText;
  }
};

// --- SUBMIT: CONFIRMAÇÃO DE EXCLUSÃO ---
const handleConfirmDelete = async () => {
  if (!state.productIdToDelete) return;

  const btnDelete = elements.btnConfirmDelete;
  const originalText = btnDelete.textContent;

  try {
    btnDelete.disabled = true;
    btnDelete.textContent = 'Apagando...';

    await api.deleteProduct(state.productIdToDelete);
    
    showToast('Produto removido com sucesso do estoque.');
    elements.modalDeleteBackdrop.classList.remove('remove');
    elements.modalDeleteBackdrop.classList.remove('active');
    state.productIdToDelete = null;

    await loadData();
  } catch (error) {
    showToast(error.message || 'Não foi possível excluir o produto.', 'error');
  } finally {
    btnDelete.disabled = false;
    btnDelete.textContent = originalText;
  }
};

// --- INICIALIZAÇÃO DA APLICAÇÃO ---
const init = () => {
  // Ajusta data atual
  elements.currentDate.textContent = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date());

  // Listeners das Abas
  elements.tabEstoqueBtn.addEventListener('click', () => switchTab('estoque'));
  elements.tabMovimentacoesBtn.addEventListener('click', () => switchTab('movimentacoes'));

  // Listeners dos Filtros
  elements.searchFilter.addEventListener('input', renderProductsTable);
  elements.categoryFilter.addEventListener('change', renderProductsTable);
  elements.lowStockFilter.addEventListener('change', renderProductsTable);
  
  elements.btnResetFilters.addEventListener('click', () => {
    elements.searchFilter.value = '';
    elements.categoryFilter.value = '';
    elements.lowStockFilter.checked = false;
    renderProductsTable();
  });

  // Abertura do Modal de Cadastro
  elements.btnOpenAddModal.addEventListener('click', () => {
    elements.productModalTitle.textContent = 'Cadastrar Novo Produto';
    elements.productForm.reset();
    elements.productId.value = '';
    
    // Exibe a quantidade inicial no cadastro
    elements.initialQtyContainer.style.display = 'flex';
    elements.productQuantity.setAttribute('required', 'true');

    elements.modalProductBackdrop.classList.add('active');
  });

  // Vinculação dos formulários
  elements.productsTableBody.addEventListener('click', handleTableActions);
  elements.productForm.addEventListener('submit', handleProductSubmit);
  elements.movementForm.addEventListener('submit', handleMovementSubmit);
  elements.btnConfirmDelete.addEventListener('click', handleConfirmDelete);

  // Carregar dados iniciais
  loadData();
};

// Executar após carregar DOM
document.addEventListener('DOMContentLoaded', init);
