document.getElementById('orderForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const orderDate = document.getElementById('orderDate').value;
    const orderName = document.getElementById('orderName').value;
    const orderProduct = document.getElementById('orderProduct').value;
    const orderQuantity = parseInt(document.getElementById('orderQuantity').value);
    const orderCost = parseFloat(document.getElementById('orderCost').value);
    const orderIncome = parseFloat(document.getElementById('orderIncome').value);

    addOrder(orderDate, orderName, orderProduct, orderQuantity, orderCost, orderIncome);

    document.getElementById('orderForm').reset();
    document.getElementById('orderQuantity').value = 1;
});

document.getElementById('productForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const productName = document.getElementById('productName').value;
    const productSale = parseFloat(document.getElementById('productSale').value);
    const productCost = parseFloat(document.getElementById('productCost').value);

    addProduct(productName, productSale, productCost);
    updateProductSelect(); // Actualizar lista de productos
    updateProductList();

    document.getElementById('productForm').reset();
});

// Controladores de eventos para los botones Montevideo y DAC
document.getElementById('montevideoButton').addEventListener('click', function() {
    document.getElementById('dacButton').classList.remove('selected');
    this.classList.add('selected');
});

document.getElementById('dacButton').addEventListener('click', function() {
    document.getElementById('montevideoButton').classList.remove('selected');
    this.classList.add('selected');
});

document.getElementById('orderProduct').addEventListener('change', updateCostAndIncome);
document.getElementById('orderQuantity').addEventListener('input', updateCostAndIncome);

document.getElementById('clearProductsButton').addEventListener('click', function() {
    clearAllProducts();
});

document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateProductSelect();
    updateProductList();
    loadOrders();
    updateTable();
    updateSummary();
});

let products = [];
let orders = [];

function addOrder(date, name, product, quantity, cost, income) {
    const order = { date, name, product, quantity, cost, income };
    const deliveryOption = document.querySelector('.form-group button.selected');
    if (deliveryOption) {
        order.delivery = deliveryOption.textContent;
    }
    orders.push(order);
    saveOrders();
    updateTable();
    updateSummary();
}

function addProduct(name, sale, cost) {
    const product = { name, sale, cost };
    products.push(product);
    saveProducts();
}

function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

function loadProducts() {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    }
}

function updateProductSelect() {
    const selectElement = document.getElementById('orderProduct');
    selectElement.innerHTML = '<option value="">Seleccione un producto</option>';
    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.name;
        option.textContent = product.name;
        selectElement.appendChild(option);
    });
}

function updateProductList() {
    const productListElement = document.getElementById('productList');
    productListElement.innerHTML = '';
    products.forEach((product, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${product.name} (Venta: $${product.sale}, Costo: $${product.cost})`;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.classList.add('delete-product-btn');
        deleteButton.addEventListener('click', () => deleteProduct(index));
        listItem.appendChild(deleteButton);
        productListElement.appendChild(listItem);
    });
}

function updateCostAndIncome() {
    const selectedProduct = document.getElementById('orderProduct').value;
    const quantity = parseInt(document.getElementById('orderQuantity').value) || 1;

    // Buscar el producto seleccionado en la lista de productos
    const product = products.find(prod => prod.name === selectedProduct);

    // Si se encuentra el producto, se establece el costo y el ingreso en las casillas correspondientes
    if (product) {
        document.getElementById('orderCost').value = (product.cost * quantity).toFixed(2);
        document.getElementById('orderIncome').value = (product.sale * quantity).toFixed(2);
    } else {
        document.getElementById('orderCost').value = '';
        document.getElementById('orderIncome').value = '';
    }
}

function updateTable() {
    const tableBody = document.querySelector('#ordersTable tbody');
    tableBody.innerHTML = '';

    orders.forEach((order, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.date}</td>
            <td>${order.name}</td>
            <td>${order.product}</td>
            <td>${order.quantity}</td>
            <td>$${order.cost.toFixed(2)}</td>
            <td>$${order.income.toFixed(2)}</td>
            <td>${order.delivery}</td>
            <td><button class="delete-btn" onclick="deleteOrder(${index})">Eliminar</button></td>
        `;
        tableBody.appendChild(row);
    });
}

function updateSummary() {
    const totalCost = orders.reduce((acc, curr) => acc + curr.cost, 0);
    const totalIncome = orders.reduce((acc, curr) => acc + curr.income, 0);
    const totalProfit = totalIncome - totalCost;

    document.getElementById('totalCost').textContent = totalCost.toFixed(2);
    document.getElementById('totalIncome').textContent = totalIncome.toFixed(2);
    const totalProfitElement = document.getElementById('totalProfit');
    totalProfitElement.textContent = totalProfit.toFixed(2);
    totalProfitElement.classList.toggle('profit', totalProfit >= 0);
    totalProfitElement.classList.toggle('loss', totalProfit < 0);
}

function saveOrders() {
    localStorage.setItem('orders', JSON.stringify(orders));
}

function loadOrders() {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
        orders = JSON.parse(savedOrders);
    }
}

function deleteOrder(index) {
    orders.splice(index, 1);
    saveOrders();
    updateTable();
    updateSummary();
}

function deleteProduct(index) {
    products.splice(index, 1);
    saveProducts();
    updateProductList();
    updateProductSelect(); // Actualizar la lista de productos en el select
}

function clearAllProducts() {
    products = [];
    saveProducts();
    updateProductList();
    updateProductSelect(); // Actualizar la lista de productos en el select
}
