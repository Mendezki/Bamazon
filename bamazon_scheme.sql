DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products
(
    id INT(10) NOT NULL
    AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price DECIMAL(5,2) NOT NULL,
  stock_quantity INT(10) default 0,
  PRIMARY KEY(id)
);

INSERT INTO products
    (product_name, department_name, price, stock_quantity)
VALUES ("LEGO City Cargo Train", "Toys & Games", 186.00, 230
),("Sharpie Permanent Markers 12ct", "Office Products", 19.98, 1151
),("Dr. Brown's Glass Bottles 3ct", "Baby", 21.99, 112
),("Fujifilm Instax Mini 9", "Electronics", 49.99, 26
),("Educated: A Memoir, Tara Westover", "Books", 13.00, 179
),("San Marzano Sauce", "Groceries", 7.99, 30
),("Fresh Mozzarella Ciliegine 8oz", "Groceries", 4.50, 5
),("Samsung Galaxy S9 64Gb", "Electronics", 555.49, 95
),("Samsung Qi Wireless Charger", "Electronics", 34.99, 12
),("Malin + Goetz Deodorant, Eucalyptus, 2.6 Fl Oz", "Personal Care", 22.00, 87
),("Ibuprophen", "Pharmacy", 4.45, 187
),("Aesthetics, Theodor Adorno", "Books", 14.51, 3
),("Melissa & Doug Wooden Town Play Set", "Toys& Games", 29.99, 5
);