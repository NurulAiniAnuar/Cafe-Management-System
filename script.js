<<<<<<< HEAD
/* Order Storage */

function getOrders() {
    return JSON.parse(localStorage.getItem("orders")) || [];
}

function saveOrders(orders) {
    localStorage.setItem("orders", JSON.stringify(orders));
}

/* Place Order */

function addOrder() {

    let orders = getOrders();

    let foods = [];
    let beverages = [];

    document.querySelectorAll(".foodName").forEach((item, index) => {

        let qtyField =
            document.querySelectorAll(".foodQty")[index];

        if (item.value.trim() !== "") {

            foods.push({
                name: item.value.trim(),
                qty: parseInt(qtyField.value) || 1
            });
        }
    });

    document.querySelectorAll(".beverageName").forEach((item, index) => {

        let qtyField =
            document.querySelectorAll(".beverageQty")[index];

        if (item.value.trim() !== "") {

            beverages.push({
                name: item.value.trim(),
                qty: parseInt(qtyField.value) || 1
            });
        }
    });

    let nextId = 1001;

    if (orders.length > 0) {

        nextId =
            Math.max(...orders.map(o => o.id)) + 1;
    }

    let order = {
        id: nextId,
        foods: foods,
        beverages: beverages,
        timestamp: Date.now(),
        status: "Pending"
    };

    orders.push(order);

    saveOrders(orders);

    location.reload();
}

/* Order Search */

function findOrder(orderId) {

    let orders = getOrders();

    return orders.find(
        order => order.id == orderId
    );
}

function clearSearch() {

    let searchBox =
        document.getElementById("searchOrderId");

    if (searchBox) {
        searchBox.value = "";
    }

    loadStaffOrders();
}

/* FIFO Queue */

function showNextOrder() {

    let orders = getOrders();

    let pendingOrders = orders.filter(
        o => o.status === "Pending"
    );

    if (pendingOrders.length === 0) {

        document.getElementById("nextOrder").innerHTML =
            "No pending orders";

        return;
    }

    pendingOrders.sort(
        (a, b) => a.timestamp - b.timestamp
    );

    let next = pendingOrders[0];

    document.getElementById("nextOrder").innerHTML = `
        <div class="order-box">
            <strong>Next FIFO Order:</strong>
            #${next.id}
        </div>
    `;
}

/* Kitchen Actions */

function setPreparing(id) {

    let orders = getOrders();

    let order =
        orders.find(o => o.id == id);

    if (order) {
        order.status = "Preparing";
    }

    saveOrders(orders);

    loadKitchenOrders();
}

function setServing(id) {

    let orders = getOrders();

    let order =
        orders.find(o => o.id == id);

    if (order) {
        order.status = "Serving";
    }

    saveOrders(orders);

    loadKitchenOrders();
}

function markServed(id) {

    let orders = getOrders();

    let order =
        orders.find(o => o.id == id);

    if (order) {
        order.status = "Served";
    }

    saveOrders(orders);

    loadStaffOrders();
}

/* Dashboard */

function loadDashboard() {

    let orders = getOrders();

    let preparingBoard =
        document.getElementById("preparingBoard");

    let servingBoard =
        document.getElementById("servingBoard");

    let totalOrders =
        document.getElementById("totalOrders");

    if (!preparingBoard) return;

    preparingBoard.innerHTML = "";
    servingBoard.innerHTML = "";

    let activeOrders = orders.filter(
        order => order.status !== "Served"
    );

    totalOrders.textContent =
        activeOrders.length;

    let pending = orders.filter(
        o => o.status === "Pending"
    ).length;

    let pendingElement =
        document.getElementById("pendingOrders");

    if (pendingElement) {
        pendingElement.textContent = pending;
    }

    activeOrders.forEach(order => {

        if (order.status === "Preparing") {

            preparingBoard.innerHTML += `
                <div class="order-box dashboard-order">
                    #${order.id}
                </div>
            `;
        }

        if (order.status === "Serving") {

            servingBoard.innerHTML += `
                <div class="order-box dashboard-order">
                    #${order.id}
                </div>
            `;
        }
    });
}

/* Staff View */

function loadStaffOrders() {

    let orders = getOrders();

    let container =
        document.getElementById("staffOrders");

    if (!container) return;

    container.innerHTML = "";

    let searchValue = "";

    let searchBox =
        document.getElementById("searchOrderId");

    if (searchBox) {
        searchValue =
            searchBox.value.trim();
    }

    let queueOrders = orders
        .filter(order => order.status === "Pending")
        .sort((a, b) => a.timestamp - b.timestamp);

    let filteredOrders = orders
        .filter(order => order.status !== "Served")
        .filter(order => {

            if (searchValue === "") {
                return true;
            }

            return String(order.id)
                .includes(searchValue);
        })
        .slice(0, 10);

    if (filteredOrders.length === 0) {

        container.innerHTML = `
            <div class="order-box">
                Order not found.
            </div>
        `;

        return;
    }

    filteredOrders.forEach(order => {

        let queuePosition =
            queueOrders.findIndex(
                o => o.id === order.id
            );

        container.innerHTML += `
            <div class="order-box">

                <div class="order-number">
                    #${order.id}
                </div>

                <p><strong>Foods:</strong></p>

                <ul>
                    ${(order.foods || [])
                        .map(food =>
                            `<li>${food.name} x${food.qty}</li>`
                        )
                        .join("")}
                </ul>

                <p><strong>Beverages:</strong></p>

                <ul>
                    ${(order.beverages || [])
                        .map(drink =>
                            `<li>${drink.name} x${drink.qty}</li>`
                        )
                        .join("")}
                </ul>

                <p>
                    Created:
                    ${new Date(order.timestamp)
                        .toLocaleTimeString()}
                </p>

                <p>
                    Queue Position:
                    ${
                        queuePosition >= 0
                        ? queuePosition + 1
                        : "-"
                    }
                </p>

                <p>
                    Status:
                    <span class="${order.status.toLowerCase()}">
                        ${order.status}
                    </span>
                </p>

                ${
                    order.status === "Serving"
                    ? `<button onclick="markServed(${order.id})">
                           Served
                       </button>`
                    : ""
                }

            </div>
        `;
    });
}

/* Dynamic Food Rows */

function addFoodRow() {

    document.getElementById("foodContainer")
        .insertAdjacentHTML(
            "beforeend",
            `
            <div class="item-row">
                <input
                    type="text"
                    class="foodName"
                    placeholder="Food Item">

                <input
                    type="number"
                    class="foodQty"
                    placeholder="Qty">
            </div>
            `
        );
}

/* Dynamic Beverage Rows */

function addBeverageRow() {

    document.getElementById("beverageContainer")
        .insertAdjacentHTML(
            "beforeend",
            `
            <div class="item-row">
                <input
                    type="text"
                    class="beverageName"
                    placeholder="Beverage">

                <input
                    type="number"
                    class="beverageQty"
                    placeholder="Qty">
            </div>
            `
        );
}

/* Kitchen View */

function loadKitchenOrders() {

    let orders = getOrders();

    let container =
        document.getElementById("kitchenOrders");

    if (!container) return;

    container.innerHTML = "";

    orders
        .filter(order => order.status !== "Served")
        .slice(0, 10)
        .forEach(order => {

            container.innerHTML += `
                <div class="order-box">

                    <div class="order-number">
                        #${order.id}
                    </div>

                    <p><strong>Foods:</strong></p>

                    <ul>
                        ${order.foods
                            .map(food =>
                                `<li>${food.name} x${food.qty}</li>`
                            )
                            .join("")}
                    </ul>

                    <p><strong>Beverages:</strong></p>

                    <ul>
                        ${order.beverages
                            .map(drink =>
                                `<li>${drink.name} x${drink.qty}</li>`
                            )
                            .join("")}
                    </ul>

                    <p>
                        Status:
                        ${order.status}
                    </p>

                    ${
                        order.status === "Pending"
                        ? `<button onclick="setPreparing(${order.id})">
                               Preparing
                           </button>`
                        : ""
                    }

                    ${
                        order.status === "Preparing"
                        ? `<button onclick="setServing(${order.id})">
                               Serving
                           </button>`
                        : ""
                    }

                </div>
            `;
        });
=======
// =========================
// ORDER MANAGEMENT SYSTEM
// Circular Queue + Order Lookup
// =========================

function getOrders() {
    return JSON.parse(localStorage.getItem("orders")) || [];
}

function saveOrders(orders) {
    localStorage.setItem("orders", JSON.stringify(orders));
}

// =========================
// PlaceOrder()
// =========================

function addOrder() {

    let orders = getOrders();

    let foods = [];
    let beverages = [];

    document.querySelectorAll(".foodName").forEach((item, index) => {

        let qtyField =
            document.querySelectorAll(".foodQty")[index];

        if(item.value.trim() !== "") {

            foods.push({
                name: item.value.trim(),
                qty: parseInt(qtyField.value) || 1
            });
        }
    });

    document.querySelectorAll(".beverageName").forEach((item, index) => {

        let qtyField =
            document.querySelectorAll(".beverageQty")[index];

        if(item.value.trim() !== "") {

            beverages.push({
                name: item.value.trim(),
                qty: parseInt(qtyField.value) || 1
            });
        }
    });

    let nextId = 1001;

    if (orders.length > 0) {
        nextId =
            Math.max(...orders.map(o => o.id)) + 1;
    }

    let order = {
        id: nextId,
        foods: foods,
        beverages: beverages,
        timestamp: Date.now(),
        status: "Pending"
    };

    // Circular Enqueue concept
    orders.push(order);

    saveOrders(orders);

    location.reload();
}

// =========================
// Search Order
// =========================

function findOrder(orderId) {

    let orders = getOrders();

    return orders.find(
        order => order.id == orderId
    );
}

function clearSearch() {

    let searchBox =
        document.getElementById("searchOrderId");

    if (searchBox) {
        searchBox.value = "";
    }

    loadStaffOrders();
}

// =========================
// FIFO Queue Visualization
// =========================

function showNextOrder() {

    let orders = getOrders();

    let pendingOrders =
        orders.filter(
            o => o.status === "Pending"
        );

    if(pendingOrders.length === 0) {

        document.getElementById(
            "nextOrder"
        ).innerHTML =
            "No pending orders";

        return;
    }

    pendingOrders.sort(
        (a,b) => a.timestamp - b.timestamp
    );

    let next = pendingOrders[0];

    document.getElementById(
        "nextOrder"
    ).innerHTML = `
        <div class="order-box">
            <strong>Next FIFO Order:</strong>
            #${next.id}
        </div>
    `;
}

// =========================
// Kitchen Actions
// =========================

function setPreparing(id) {

    let orders = getOrders();

    let order =
        orders.find(o => o.id == id);

    if(order) {
        order.status = "Preparing";
    }

    saveOrders(orders);

    loadKitchenOrders();
}

function setServing(id) {

    let orders = getOrders();

    let order =
        orders.find(o => o.id == id);

    if(order) {
        order.status = "Serving";
    }

    saveOrders(orders);

    loadKitchenOrders();
}

// =========================
// ServeNextOrder()
// =========================

function markServed(id) {

    let orders = getOrders();

    let order =
        orders.find(o => o.id == id);

    if(order) {
        order.status = "Served";
    }

    saveOrders(orders);

    loadStaffOrders();
}

// =========================
// Dashboard
// =========================

function loadDashboard() {

    let orders = getOrders();

    let preparingBoard =
        document.getElementById("preparingBoard");

    let servingBoard =
        document.getElementById("servingBoard");

    let totalOrders =
        document.getElementById("totalOrders");

    if(!preparingBoard) return;

    preparingBoard.innerHTML = "";
    servingBoard.innerHTML = "";

    let activeOrders =
        orders.filter(
            order => order.status !== "Served"
        );

    totalOrders.textContent =
        activeOrders.length;

    let pending =
        orders.filter(
            o => o.status === "Pending"
        ).length;

    let pendingElement =
        document.getElementById("pendingOrders");

    if(pendingElement){
        pendingElement.textContent =
            pending;
    }

    activeOrders.forEach(order => {

        if(order.status === "Preparing") {

            preparingBoard.innerHTML += `
                <div class="order-box dashboard-order">
                    #${order.id}
                </div>
            `;
        }

        if(order.status === "Serving") {

            servingBoard.innerHTML += `
                <div class="order-box dashboard-order">
                    #${order.id}
                </div>
            `;
        }
    });
}

// =========================
// Staff View
// =========================

function loadStaffOrders() {

    let orders = getOrders();

    let container =
        document.getElementById("staffOrders");

    if (!container) return;

    container.innerHTML = "";

    let searchValue = "";

    let searchBox =
        document.getElementById("searchOrderId");

    if (searchBox) {
        searchValue =
            searchBox.value.trim();
    }

    let queueOrders = orders
        .filter(order =>
            order.status === "Pending"
        )
        .sort(
            (a, b) =>
            a.timestamp - b.timestamp
        );

    let filteredOrders = orders

        .filter(order =>
            order.status !== "Served"
        )

        .filter(order => {

            if (searchValue === "") {
                return true;
            }

            return String(order.id)
                .includes(searchValue);

        })

        .slice(0, 10);

    if (filteredOrders.length === 0) {

        container.innerHTML = `
            <div class="order-box">
                Order not found.
            </div>
        `;

        return;
    }

    filteredOrders.forEach(order => {

        let queuePosition =
            queueOrders.findIndex(
                o => o.id === order.id
            );

        container.innerHTML += `

        <div class="order-box">

            <div class="order-number">
                #${order.id}
            </div>

            <p><strong>Foods:</strong></p>

            <ul>
                ${(order.foods || [])
                    .map(food =>
                        `<li>${food.name} x${food.qty}</li>`
                    )
                    .join("")}
            </ul>

            <p><strong>Beverages:</strong></p>

            <ul>
                ${(order.beverages || [])
                    .map(drink =>
                        `<li>${drink.name} x${drink.qty}</li>`
                    )
                    .join("")}
            </ul>

            <p>
                Created:
                ${new Date(order.timestamp)
                    .toLocaleTimeString()}
            </p>

            <p>
                Queue Position:
                ${
                    queuePosition >= 0
                    ? queuePosition + 1
                    : "-"
                }
            </p>

            <p>
                Status:
                <span class="${order.status.toLowerCase()}">
                    ${order.status}
                </span>
            </p>

            ${
                order.status === "Serving"
                ?
                `<button onclick="markServed(${order.id})">
                    Served
                </button>`
                :
                ""
            }

        </div>

        `;
    });

}

// =========================
// Dynamic Food Rows
// =========================

function addFoodRow() {

    document
    .getElementById("foodContainer")
    .insertAdjacentHTML(
        "beforeend",
        `
        <div class="item-row">
            <input
                type="text"
                class="foodName"
                placeholder="Food Item">

            <input
                type="number"
                class="foodQty"
                placeholder="Qty">
        </div>
        `
    );
}

// =========================
// Dynamic Beverage Rows
// =========================

function addBeverageRow() {

    document
    .getElementById("beverageContainer")
    .insertAdjacentHTML(
        "beforeend",
        `
        <div class="item-row">
            <input
                type="text"
                class="beverageName"
                placeholder="Beverage">

            <input
                type="number"
                class="beverageQty"
                placeholder="Qty">
        </div>
        `
    );
}

// =========================
// Kitchen View
// =========================

function loadKitchenOrders() {

    let orders = getOrders();

    let container =
        document.getElementById("kitchenOrders");

    if(!container) return;

    container.innerHTML = "";

    orders
    .filter(order =>
        order.status !== "Served"
    )
    .slice(0, 10)

    .forEach(order => {
        container.innerHTML += `

        <div class="order-box">

            <div class="order-number">
                #${order.id}
            </div>

            <p><strong>Foods:</strong></p>

            <ul>
                ${order.foods
                    .map(food =>
                        `<li>${food.name} x${food.qty}</li>`
                    )
                    .join("")}
            </ul>

            <p><strong>Beverages:</strong></p>

            <ul>
                ${order.beverages
                    .map(drink =>
                        `<li>${drink.name} x${drink.qty}</li>`
                    )
                    .join("")}
            </ul>

            <p>
                Status:
                ${order.status}
            </p>

            ${
                order.status === "Pending"
                ?
                `<button onclick="setPreparing(${order.id})">
                    Preparing
                </button>`
                :
                ""
            }

            ${
                order.status === "Preparing"
                ?
                `<button onclick="setServing(${order.id})">
                    Serving
                </button>`
                :
                ""
            }

        </div>

        `;
    });
>>>>>>> 531219215ec08ad739a171eace6c230f140591b3
}