// Datos simulados de usuarios
const users = {
    '1234567890123456': {
        pin: '1234',
        name: 'Juan Pérez',
        accounts: {
            ahorros: { balance: 50000, number: '001-123-456' },
            corriente: { balance: 25000, number: '002-123-456' }
        }
    },
    '9876543210987654': {
        pin: '5678',
        name: 'María García',
        accounts: {
            ahorros: { balance: 75000, number: '001-987-654' },
            corriente: { balance: 30000, number: '002-987-654' }
        }
    },
    '1111222233334444': {
        pin: '9999',
        name: 'Carlos Rodríguez',
        accounts: {
            ahorros: { balance: 120000, number: '001-111-222' },
            corriente: { balance: 45000, number: '002-111-222' }
        }
    },
    '5555666677778888': {
        pin: '0000',
        name: 'Ana Martínez',
        accounts: {
            ahorros: { balance: 89000, number: '001-555-666' },
            corriente: { balance: 67000, number: '002-555-666' }
        }
    },
    '9999888877776666': {
        pin: '1010',
        name: 'Luis Fernández',
        accounts: {
            ahorros: { balance: 200000, number: '001-999-888' },
            corriente: { balance: 15000, number: '002-999-888' }
        }
    }
};

// Variables globales
let currentUser = null;
let currentCard = null;
let selectedAccount = null;
let selectedSourceAccount = null;

// Función de inicio de sesión
function login() {
    const cardNumber = document.getElementById('cardNumber').value;
    const pin = document.getElementById('pin').value;

    if (cardNumber.length !== 16) {
        showMessage('El número de tarjeta debe tener 16 dígitos', 'error', 'loginMessage');
        return;
    }

    if (pin.length !== 4) {
        showMessage('El PIN debe tener 4 dígitos', 'error', 'loginMessage');
        return;
    }

    if (users[cardNumber] && users[cardNumber].pin === pin) {
        currentUser = users[cardNumber];
        currentCard = cardNumber;
        showSection('menuSection');
        updateCurrentInfo();
        clearLoginForm();
    } else {
        showMessage('Tarjeta o PIN incorrecto', 'error', 'loginMessage');
    }
}

// Función de cierre de sesión
function logout() {
    currentUser = null;
    currentCard = null;
    showSection('loginSection');
    clearLoginForm();
}

// Limpiar formulario de login
function clearLoginForm() {
    document.getElementById('cardNumber').value = '';
    document.getElementById('pin').value = '';
    document.getElementById('loginMessage').innerHTML = '';
}

// Mostrar sección específica
function showSection(sectionId) {
    document.querySelectorAll('.login-section, .menu-section, .operation-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

// Actualizar información del usuario actual
function updateCurrentInfo() {
    document.getElementById('currentCard').textContent = currentCard.substring(0, 4) + '****' + currentCard.substring(12);
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString('es-ES');
}

// Mostrar operación específica
function showOperation(operation) {
    document.getElementById('operationTitle').textContent = getOperationTitle(operation);
    document.getElementById('operationContent').innerHTML = getOperationContent(operation);
    showSection('operationSection');
}

// Obtener título de operación
function getOperationTitle(operation) {
    const titles = {
        'balance': '💰 Consulta de Saldo',
        'withdraw': '💸 Retiro de Dinero',
        'deposit': '💳 Depósito de Dinero',
        'transfer': '🔄 Transferencia de Dinero'
    };
    return titles[operation];
}

// Obtener contenido de operación
function getOperationContent(operation) {
    switch(operation) {
        case 'balance':
            return getBalanceContent();
        case 'withdraw':
            return getWithdrawContent();
        case 'deposit':
            return getDepositContent();
        case 'transfer':
            return getTransferContent();
        default:
            return '';
    }
}

// Contenido para consulta de saldo
function getBalanceContent() {
    let content = '<div class="accounts-select">';
    for (let [type, account] of Object.entries(currentUser.accounts)) {
        content += `
            <div class="account-card">
                <h4>${type.toUpperCase()}</h4>
                <p>Cuenta: ${account.number}</p>
                <p class="balance">$${account.balance.toLocaleString()}</p>
            </div>
        `;
    }
    content += '</div>';
    return content;
}

// Contenido para retiro
function getWithdrawContent() {
    return `
        <div class="operation-form">
            <div class="accounts-select">
                <div class="account-card" onclick="selectAccount('withdraw', 'ahorros')">
                    <h4>AHORROS</h4>
                    <p>$${currentUser.accounts.ahorros.balance.toLocaleString()}</p>
                </div>
                <div class="account-card" onclick="selectAccount('withdraw', 'corriente')">
                    <h4>CORRIENTE</h4>
                    <p>$${currentUser.accounts.corriente.balance.toLocaleString()}</p>
                </div>
            </div>
            <div id="withdrawForm" class="hidden">
                <div class="input-group">
                    <label>Monto a retirar:</label>
                    <input type="number" id="withdrawAmount" placeholder="Ingrese el monto">
                </div>
                <button class="btn" onclick="processWithdraw()">Retirar</button>
            </div>
            <div id="withdrawMessage"></div>
        </div>
    `;
}

// Contenido para depósito
function getDepositContent() {
    return `
        <div class="operation-form">
            <div class="accounts-select">
                <div class="account-card" onclick="selectAccount('deposit', 'ahorros')">
                    <h4>AHORROS</h4>
                    <p>$${currentUser.accounts.ahorros.balance.toLocaleString()}</p>
                </div>
                <div class="account-card" onclick="selectAccount('deposit', 'corriente')">
                    <h4>CORRIENTE</h4>
                    <p>$${currentUser.accounts.corriente.balance.toLocaleString()}</p>
                </div>
            </div>
            <div id="depositForm" class="hidden">
                <div class="input-group">
                    <label>Monto a depositar:</label>
                    <input type="number" id="depositAmount" placeholder="Ingrese el monto">
                </div>
                <button class="btn" onclick="processDeposit()">Depositar</button>
            </div>
            <div id="depositMessage"></div>
        </div>
    `;
}

// Contenido para transferencia
function getTransferContent() {
    return `
        <div class="operation-form">
            <h3>Cuenta Origen:</h3>
            <div class="accounts-select">
                <div class="account-card" onclick="selectSourceAccount('ahorros')">
                    <h4>AHORROS</h4>
                    <p>$${currentUser.accounts.ahorros.balance.toLocaleString()}</p>
                </div>
                <div class="account-card" onclick="selectSourceAccount('corriente')">
                    <h4>CORRIENTE</h4>
                    <p>$${currentUser.accounts.corriente.balance.toLocaleString()}</p>
                </div>
            </div>
            <div id="transferForm" class="hidden">
                <div class="input-group">
                    <label>Cuenta destino:</label>
                    <input type="text" id="destinationAccount" placeholder="Número de cuenta destino">
                </div>
                <div class="input-group">
                    <label>Monto a transferir:</label>
                    <input type="number" id="transferAmount" placeholder="Ingrese el monto">
                </div>
                <button class="btn" onclick="processTransfer()">Transferir</button>
            </div>
            <div id="transferMessage"></div>
        </div>
    `;
}

// Seleccionar cuenta para operaciones
function selectAccount(operation, accountType) {
    selectedAccount = accountType;
    document.getElementById(operation + 'Form').classList.remove('hidden');
}

// Seleccionar cuenta origen para transferencias
function selectSourceAccount(accountType) {
    selectedSourceAccount = accountType;
    document.getElementById('transferForm').classList.remove('hidden');
}

// Procesar retiro
function processWithdraw() {
    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    
    if (!amount || amount <= 0) {
        showMessage('Ingrese un monto válido', 'error', 'withdrawMessage');
        return;
    }

    if (amount > currentUser.accounts[selectedAccount].balance) {
        showMessage('Saldo insuficiente', 'error', 'withdrawMessage');
        return;
    }

    if (amount % 10000 !== 0) {
        showMessage('El monto debe ser múltiplo de $10,000', 'error', 'withdrawMessage');
        return;
    }

    currentUser.accounts[selectedAccount].balance -= amount;
    showMessage(`Retiro exitoso de $${amount.toLocaleString()} de su cuenta ${selectedAccount}. Nuevo saldo: $${currentUser.accounts[selectedAccount].balance.toLocaleString()}`, 'success', 'withdrawMessage');
    
    // Actualizar la vista después de 3 segundos
    setTimeout(() => {
        showOperation('balance');
    }, 3000);
}

// Procesar depósito
function processDeposit() {
    const amount = parseFloat(document.getElementById('depositAmount').value);
    
    if (!amount || amount <= 0) {
        showMessage('Ingrese un monto válido', 'error', 'depositMessage');
        return;
    }

    currentUser.accounts[selectedAccount].balance += amount;
    showMessage(`Depósito exitoso de $${amount.toLocaleString()} en su cuenta ${selectedAccount}. Nuevo saldo: $${currentUser.accounts[selectedAccount].balance.toLocaleString()}`, 'success', 'depositMessage');
    
    // Actualizar la vista después de 3 segundos
    setTimeout(() => {
        showOperation('balance');
    }, 3000);
}

// Procesar transferencia
function processTransfer() {
    const amount = parseFloat(document.getElementById('transferAmount').value);
    const destinationAccount = document.getElementById('destinationAccount').value;
    
    if (!amount || amount <= 0) {
        showMessage('Ingrese un monto válido', 'error', 'transferMessage');
        return;
    }

    if (!destinationAccount) {
        showMessage('Ingrese una cuenta destino', 'error', 'transferMessage');
        return;
    }

    if (amount > currentUser.accounts[selectedSourceAccount].balance) {
        showMessage('Saldo insuficiente', 'error', 'transferMessage');
        return;
    }

    currentUser.accounts[selectedSourceAccount].balance -= amount;
    showMessage(`Transferencia exitosa de $${amount.toLocaleString()} desde ${selectedSourceAccount} a la cuenta ${destinationAccount}. Nuevo saldo: $${currentUser.accounts[selectedSourceAccount].balance.toLocaleString()}`, 'success', 'transferMessage');
    
    // Actualizar la vista después de 3 segundos
    setTimeout(() => {
        showOperation('balance');
    }, 3000);
}

// Mostrar mensajes
function showMessage(message, type, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = `<div class="message ${type}">${message}</div>`;
    
    // Limpiar mensaje después de 5 segundos
    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}

// Volver al menú principal
function backToMenu() {
    showSection('menuSection');
}

// Inicialización cuando se carga el documento
document.addEventListener('DOMContentLoaded', function() {
    // Permitir login con Enter en el campo PIN
    document.getElementById('pin').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            login();
        }
    });
    
    // Permitir solo números en el campo de tarjeta
    document.getElementById('cardNumber').addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '');
    });
    
    // Permitir solo números en el campo PIN
    document.getElementById('pin').addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '');
    });
});
