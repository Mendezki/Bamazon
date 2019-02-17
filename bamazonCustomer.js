var mysql = require("mysql");
var Table = require('cli-table2');
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
connection.connect();

// Create and display the table made in MySQL
var display = function() {
    connection.query("SELECT * FROM products", function(err, res) {
        if(err) throw err;
        console.log("=======================================");
        console.log("Welcome to BAMAZON!");
        console.log("=======================================");
        console.log("Here are the products we have in stock:");
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
    // run the start function after the connection is made to prompt the user
    startApp()
    });
};

// function which prompts the user for what action they should take
function startApp() {
    inquirer
        .prompt({
        name: "id",
        type: "input",
        message: "Enter the ID of the desired product"
        }).then(function(choiceID) {
            var selection = choiceID.id;
            connection.query("SELECT * FROM products WHERE id=?", selection, function(err, res) {
                if(err) throw err;
                if(res.length === 0) {
                    console.log("");
                    console.log("Item unavailable, please select a product from the list");
                    startApp();
                }
                else {
                    inquirer
                        .prompt({
                        name: "quantity",
                        type: "input",
                        message: "How many items would you like to purchase?"
                        })
                        .then(function (choiceQty) {
                            var quantity = choiceQty.quantity;
                            if (quantity > res[0].stock_quantity) {
                                console.log("Sorry, but it seems that we have only have" + res[0].stock_quantity +
                                    "of the item you selected.");
                            startApp();
                            }
                            else {
                                console.log("You selected " + quantity + " item of " + res[0].product_name + 
                                " to your cart. $" + res[0].price + " is your total");
                        
                            
                            var updateStock = res[0].stock_quantity - quantity;
                            connection.query("UPDATE products SET stock_quantity = " +
                            updateStock + " WHERE id = " + res[0].id, function(err) {
                                if(err) throw err;
                                    console.log("");
                                    console.log("Order processed");
                                    console.log("Thank for your purchase!");
                                    console.log("");
                                    connection.end();
                            });
                            }
                        });
                }
                
            });
        });
};

display();