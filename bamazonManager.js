var mysql = require("mysql");
var Table = require("cli-table2");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "....",
    database: "bamazon_DB"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
    if(err) throw err;
    console.log();
    start();
});

function start() {
    inquirer
    .prompt([
        {
            name: "options",
            type: "list",
            message: "Welcome, what would you like to do?",
            choices: ["View Complete Inventory", "View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "End Session"]
        }
    ]).then(function(choice){
        switch(choice.options){
            case "View Complete Inventory": displayInventory();
                break;
            case "View Products for Sale": saleProducts();
                break;
            case "View Low Inventory": lowInventory();
                break;
            case "Add to Inventory": addToInventory();
                break;
            case "Add New Product": addNewProduct();
                break;
            case "End Session": console.log('Bye!');
        }
    });
}

function displayInventory() {
       connection.query("SELECT * FROM products", function(err, res) {
        if(err) throw err;
        console.log("---------------------------------------");
        console.log("");
        console.log("Complete Inventory");
        console.log("");
        console.log("---------------------------------------");

        var table = new Table({
        head: ["Product ID", "Product Name", "Department", "Price", "Stock"],
        colWidths: [10, 40, 10, 10, 10],
        style: {
            compact: true
        }
    });
    for (var i = 0; i < res.length; i++){
        table.push([res[i].id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
    }
    console.log(table.toString());
    console.log("");
    start()
    });
}

function saleProducts() {
    connection.query("SELECT * FROM products WHERE price < 10.00", function (err, res) {
        if (err) throw err;
        console.log("---------------------------------------");
        console.log("");
        console.log("Store Complete Inventory");
        console.log("");
        console.log("---------------------------------------");

        var table = new Table({
            head: ["Product ID", "Product Name", "Department", "Price", "Stock"],
            colWidths: [10, 40, 10, 10, 10],
            style: {
                compact: true
            }
        });
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
        }
        console.log(table.toString());
        console.log("");
        start();
    });
}

function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 20", function (err, res) {
        if (err) throw err;
        console.log("---------------------------------------");
        console.log("");
        console.log("Low Inventory");
        console.log("");
        console.log("---------------------------------------");

        var table = new Table({
            head: ["Product ID", "Product Name", "Department", "Price", "Stock"],
            colWidths: [10, 40, 10, 10, 10],
            style: {
                compact: true
            }
        });
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
        }
        console.log(table.toString());
        console.log("");
        start();
    });
}

function addToInventory() {
        console.log("---------------------------------------");
        console.log("");
        console.log("Add to Inventory");
        console.log("");
        console.log("---------------------------------------");
       
connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        var items = [];
        for(var i = 0; i < res.length; i++) {
            items.push(res[i].product_name);
        } 

        inquirer
        .prompt([
            {
            name: "product",
            type: "list",
            choices: items,
            message: "What product would you like to add to the inventory?"
        },
        {
            name: "quantity",
            type: "input",
            message: "What is the amount of items would you like to add?",
            validate: function(value) {
                if(isNaN(value) === false){
                    return true;
                } else { 
                return false;
                }
            }
        }
    ])
    .then(function(choice){
        var actualStock;
        for(var i = 0; i < res.length; i++){
            if(res[i].product_name === choice.product){
                actualStock = res[i].stock_quantity;
            }
        }
        connection.query("UPDATE products SET ? WHERE ?", [{
            stock_quantity: actualStock + parseInt(choice.quantity)
        },{
            product_name: choice.product
        }  
    ],
    function(err, res){
        if(err) throw err;
        console.log("Amount updated");
        start();
    });
    })
});
}

function addNewProduct() {
    console.log("---------------------------------------");
    console.log("");
    console.log("Add New Product");
    console.log("");
    console.log("---------------------------------------");

    var storeDepartments = [];

    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            storeDepartments.push(res[i].department_name);
        }

        inquirer
        .prompt([
            {
            name: "product",
            type: "list",
            message: "Product: ",
            validate: function(value){
                if(value){
                    return true;
                } else {
                    return false
                }
            }
            },{
                name: "department",
                type: "list",
                message: "Department: ",
                choices: storeDepartments
            },{
                name: "price",
                type: "input",
                message: "Price: ",
                validate: function (value) {
                    if (value) {
                        return true;
                    } else {
                        return false
                    }
                }
            },{
                name: "quantity",
                type: "input",
                message: "Quantity: ",
                validate: function (value) {
                    if (value) {
                        return true;
                    } else {
                        return false
                    }
                }
            }
        ])
        .then(function(choice) {
            connection.query(
                "INSERT INTO product SET ?",
                {
                    product_name: choice.product,
                    department_name: choice.department,
                    price: choice.price,
                    stock_quantity: choice.quantity
                }, function(err, res){
                    if(err) throw err;
                    console.log("New product has been added to the inventory.");
                }
            )
        })
        start();
    });
}
