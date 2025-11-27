// Configuração da API
const API_BASE_URL = (() => {
    // Se estiver rodando em localhost:8080 (Docker), usar a URL do container da API
    if (window.location.port === '8080') {
        return 'http://localhost:5000/api';
    }
    // Caso contrário, usar a URL padrão local
    return 'http://localhost:5000/api';
})();

// Elementos do DOM
const sacForm = document.getElementById('sacForm');
const loadingSpinner = document.getElementById('loadingSpinner');
const resumoCard = document.getElementById('resumoCard');
const parcelasCard = document.getElementById('parcelasCard');
const errorAlert = document.getElementById('errorAlert');
const exportBtn = document.getElementById('exportBtn');

// Elementos do resumo
const valorFinanciadoResumo = document.getElementById('valorFinanciadoResumo');
const valorAmortizacao = document.getElementById('valorAmortizacao');
const valorTotalJuros = document.getElementById('valorTotalJuros');
const valorTotalAPagar = document.getElementById('valorTotalAPagar');

// Tabela de parcelas
const parcelasBody = document.getElementById('parcelasBody');

// Dados da última simulação
let lastSimulationData = null;

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    sacForm.addEventListener('submit', handleFormSubmit);
    exportBtn.addEventListener('click', exportToCSV);
    
    // Máscaras para os campos
    setupInputMasks();
});

// Configurar máscaras dos inputs
function setupInputMasks() {
    const valorFinanciado = document.getElementById('valorFinanciado');
    const taxaJuros = document.getElementById('taxaJuros');
    
    // Formatar valor financiado enquanto digita
    valorFinanciado.addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^\d]/g, '');
        if (value.length > 0) {
            value = (parseInt(value) / 100).toFixed(2);
            e.target.value = value;
        }
    });
}

// Manipular envio do formulário
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = {
        valorFinanciado: parseFloat(document.getElementById('valorFinanciado').value),
        taxaJurosAnual: parseFloat(document.getElementById('taxaJuros').value),
        numeroParcelas: parseInt(document.getElementById('numeroParcelas').value)
    };
    
    // Validar dados
    if (!validateFormData(formData)) {
        return;
    }
    
    // Mostrar loading
    showLoading();
    hideResults();
    hideError();
    
    try {
        const result = await simulateSac(formData);
        lastSimulationData = result;
        displayResults(result);
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

// Validar dados do formulário
function validateFormData(data) {
    if (data.valorFinanciado <= 0) {
        showError('O valor financiado deve ser maior que zero.');
        return false;
    }
    
    if (data.taxaJurosAnual < 0) {
        showError('A taxa de juros não pode ser negativa.');
        return false;
    }
    
    if (data.numeroParcelas <= 0 || data.numeroParcelas > 480) {
        showError('O número de parcelas deve ser entre 1 e 480.');
        return false;
    }
    
    return true;
}

// Chamar API para simular SAC
async function simulateSac(data) {
    try {
        const response = await fetch(`${API_BASE_URL}/sac/simulate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao processar simulação');
        }
        
        return await response.json();
    } catch (error) {
        if (error.message.includes('fetch')) {
            throw new Error('Erro de conectividade. Verifique se a API está funcionando.');
        }
        throw error;
    }
}

// Exibir resultados da simulação
function displayResults(data) {
    // Atualizar resumo
    valorFinanciadoResumo.textContent = formatCurrency(data.valorFinanciado);
    valorAmortizacao.textContent = formatCurrency(data.valorAmortizacao);
    valorTotalJuros.textContent = formatCurrency(data.valorTotalJuros);
    valorTotalAPagar.textContent = formatCurrency(data.valorTotalAPagar);
    
    // Atualizar tabela de parcelas
    updateParcelasTable(data.parcelas);
    
    // Mostrar cards com animação
    showResults();
}

// Atualizar tabela de parcelas
function updateParcelasTable(parcelas) {
    parcelasBody.innerHTML = '';
    
    parcelas.forEach(parcela => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="fw-bold">${parcela.numero}</td>
            <td>${formatCurrency(parcela.valorAmortizacao)}</td>
            <td class="text-warning">${formatCurrency(parcela.valorJuros)}</td>
            <td class="fw-bold">${formatCurrency(parcela.valorParcela)}</td>
            <td class="text-muted">${formatCurrency(parcela.saldoDevedor)}</td>
        `;
        
        // Destacar primeira e última parcela
        if (parcela.numero === 1) {
            row.classList.add('table-success');
        } else if (parcela.numero === parcelas.length) {
            row.classList.add('table-info');
        }
        
        parcelasBody.appendChild(row);
    });
}

// Exportar dados para CSV
function exportToCSV() {
    if (!lastSimulationData) {
        alert('Nenhuma simulação disponível para exportar.');
        return;
    }
    
    let csv = 'Parcela,Amortização,Juros,Valor da Parcela,Saldo Devedor\n';
    
    lastSimulationData.parcelas.forEach(parcela => {
        csv += `${parcela.numero},`;
        csv += `${parcela.valorAmortizacao.toFixed(2).replace('.', ',')},`;
        csv += `${parcela.valorJuros.toFixed(2).replace('.', ',')},`;
        csv += `${parcela.valorParcela.toFixed(2).replace('.', ',')},`;
        csv += `${parcela.saldoDevedor.toFixed(2).replace('.', ',')}\n`;
    });
    
    // Download do arquivo
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `simulacao_sac_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Funções de utilitário para interface
function showLoading() {
    loadingSpinner.classList.remove('d-none');
}

function hideLoading() {
    loadingSpinner.classList.add('d-none');
}

function showResults() {
    resumoCard.classList.remove('d-none');
    parcelasCard.classList.remove('d-none');
    resumoCard.classList.add('fade-in');
    parcelasCard.classList.add('fade-in');
}

function hideResults() {
    resumoCard.classList.add('d-none');
    parcelasCard.classList.add('d-none');
}

function showError(message) {
    document.getElementById('errorMessage').textContent = message;
    errorAlert.classList.remove('d-none');
    errorAlert.classList.add('fade-in');
}

function hideError() {
    errorAlert.classList.add('d-none');
}

// Formatar moeda brasileira
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
    }).format(value);
}

// Verificar saúde da API na inicialização
async function checkApiHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/sac/health`);
        if (response.ok) {
            console.log('API SAC está funcionando corretamente.');
        }
    } catch (error) {
        console.warn('Não foi possível conectar com a API SAC:', error);
        showError('Não foi possível conectar com o servidor. Verifique se a API está funcionando.');
    }
}

// Verificar API quando a página carrega
checkApiHealth();