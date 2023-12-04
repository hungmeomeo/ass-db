-- Drop the FabricManagement database if it exists
DROP DATABASE IF EXISTS Fabric;

-- Create the FabricManagement database
CREATE DATABASE Fabric;

-- Switch to the FabricManagement database
USE Fabric;

-- Create the Suppliers table
CREATE TABLE Employees (
    EmployeeCode VARCHAR(50) PRIMARY KEY,
    Name VARCHAR(50),
    Gender ENUM('male', 'female', 'other'),
    Address VARCHAR(255),
    PhoneNumber VARCHAR(15),
    EmployeeType SET('manager', 'partner_staff', 'operational_staff', 'office_staff'),
    CONSTRAINT CHK_PhoneNumber_Employee CHECK (PhoneNumber REGEXP '^[0-9]+$')
);

CREATE TABLE Suppliers (
    SupplierCode VARCHAR(50) PRIMARY KEY,
    Name VARCHAR(255),
    Address VARCHAR(255),
    BankAccount VARCHAR(20),
    TaxCode VARCHAR(20),
    EmployeeCode VARCHAR(50),
    FOREIGN KEY (EmployeeCode) REFERENCES Employees(EmployeeCode),
    CONSTRAINT CHK_BankAccount_Supplier CHECK (BankAccount REGEXP '^[0-9]+$')
);

-- Create the SupplierPhoneNumbers table
CREATE TABLE SupplierPhoneNumbers (
    SupplierCode VARCHAR(50),
    PhoneNumber VARCHAR(15),
    PRIMARY KEY (SupplierCode, PhoneNumber),
    CONSTRAINT FK_SupplierPhoneNumbers_SupplierCode FOREIGN KEY (SupplierCode) REFERENCES Suppliers(SupplierCode),
    CONSTRAINT CHK_PhoneNumber_Supplier CHECK (PhoneNumber REGEXP '^[0-9]+$')
);

-- Create the FabricCategories table
CREATE TABLE FabricCategories (
    CategoryCode VARCHAR(50) PRIMARY KEY,
    SupplierCode VARCHAR(50),
    CategoryName VARCHAR(255),
    Color VARCHAR(50),
    Quantity INT,
    FOREIGN KEY (SupplierCode) REFERENCES Suppliers(SupplierCode)
);

CREATE TABLE CurrentPrices (
	CategoryCode VARCHAR(50),
    CurrentPrice DECIMAL(10, 2),
    PriceDate DATETIME,
    FOREIGN KEY (CategoryCode) REFERENCES FabricCategories(CategoryCode)
);

-- Create the Customers table
CREATE TABLE Customers (
    CustomerCode VARCHAR(50) PRIMARY KEY,
    EmployeeCode VARCHAR(50),
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    Address VARCHAR(255),
    Arrearage DECIMAL(10, 2),
    PRIMARY_PAYMENTS DECIMAL(10, 2),
    FOREIGN KEY (EmployeeCode) REFERENCES Employees(EmployeeCode)
);

CREATE TABLE CustomerPhoneNumbers (
    CustomerCode VARCHAR(50),
    PhoneNumber VARCHAR(15),
    PRIMARY KEY (CustomerCode, PhoneNumber),
    CONSTRAINT FK_CustomerPhoneNumbers_CustomerCodeCode FOREIGN KEY (CustomerCode) REFERENCES Customers(CustomerCode),
    CONSTRAINT CHK_PhoneNumber_Customer CHECK (PhoneNumber REGEXP '^[0-9]+$')
);
-- Create the Orders table
CREATE TABLE Orders (
    OrderCode VARCHAR(50) PRIMARY KEY,
    CustomerCode VARCHAR(50),
    EmployeeCode VARCHAR(50),
    OrderDate DATETIME,
    TotalPrice DECIMAL(10, 2),
    OrderStatus VARCHAR(20),
    CancellationReason VARCHAR(255),
    FOREIGN KEY (CustomerCode) REFERENCES Customers(CustomerCode),
    FOREIGN KEY (EmployeeCode) REFERENCES Employees(EmployeeCode)
);

-- Create the Bolts table
CREATE TABLE Bolts (
    BoltCode VARCHAR(50) PRIMARY KEY,
    CategoryCode VARCHAR(50),
    OrderCode VARCHAR(50),
    Length DECIMAL(5, 2),
    FOREIGN KEY (OrderCode) REFERENCES Orders(OrderCode),
    FOREIGN KEY (CategoryCode) REFERENCES FabricCategories(CategoryCode)
);

-- Create the PaymentHistory table
CREATE TABLE PaymentHistory (
    CustomerCode VARCHAR(50),
    OrderCode VARCHAR(50),
    PaymentDate DATETIME,
    Amount DECIMAL(10, 2),
    PRIMARY KEY (CustomerCode, OrderCode, PaymentDate),
    FOREIGN KEY (CustomerCode) REFERENCES Customers(CustomerCode),
    FOREIGN KEY (OrderCode) REFERENCES Orders(OrderCode)
);

CREATE TABLE CategoryImportHistory (
    CategoryCode VARCHAR(50),
    ImportDate DATETIME,
    Quantity INT,
    Price DECIMAL(10, 2),
    PRIMARY KEY (CategoryCode, ImportDate),
    FOREIGN KEY (CategoryCode) REFERENCES FabricCategories(CategoryCode)
);


UPDATE Orders
SET OrderStatus = "Cancelled", CancellationReason = NULL

DELIMITER //
CREATE TRIGGER after_insert_payment AFTER INSERT ON PaymentHistory FOR EACH ROW
BEGIN
    DECLARE totalArrearage DECIMAL(10, 2);
    DECLARE lastPaymentDate DATETIME;

    -- Calculate total arrearage for the customer
    SELECT SUM(TotalPrice) - IFNULL((SELECT SUM(Amount) FROM PaymentHistory WHERE CustomerCode = NEW.CustomerCode), 0)
    INTO totalArrearage
    FROM Orders
    WHERE CustomerCode = NEW.CustomerCode;

    -- Get the most recent payment date for the customer
    SELECT MAX(PaymentDate) INTO lastPaymentDate FROM PaymentHistory WHERE CustomerCode = NEW.CustomerCode;

    -- Update customer status based on arrearage
    IF totalArrearage > 2000 THEN
        UPDATE Customers
        SET WarningStatus = TRUE
        WHERE CustomerCode = NEW.CustomerCode;

        -- Check for bad debt status if the most recent payment is older than 6 months
        IF (lastPaymentDate is NULL) or (lastPaymentDate < DATE_SUB(NOW(), INTERVAL 6 MONTH)) THEN
            UPDATE Customers
            SET BadDebtStatus = TRUE
            WHERE CustomerCode = NEW.CustomerCode;
        END IF;
    END IF;
END //

DELIMITER ;

/* DELIMITER //

CREATE FUNCTION UpdateArrearage(customerID VARCHAR(50))
RETURNS DECIMAL(10, 2)
BEGIN
    DECLARE totalOrders DECIMAL(10, 2);
    DECLARE totalPayments DECIMAL(10, 2);
    DECLARE newArrearage DECIMAL(10, 2);

    -- Tính tổng số tiền đơn hàng của khách hàng
    SELECT SUM(TotalPrice) INTO totalOrders
    FROM Orders
    WHERE CustomerCode = customerID;

    -- Tính tổng số tiền khách hàng đã thanh toán
    SELECT SUM(Amount) INTO totalPayments
    FROM PaymentHistory
    WHERE CustomerCode = customerID;

    -- Tính toán arrearage mới
    SET newArrearage = totalOrders - totalPayments;

    -- Cập nhật arrearage trong bảng Customers
    UPDATE Customers
    SET Arrearage = newArrearage
    WHERE CustomerCode = customerID;

    -- Trả về arrearage mới
    RETURN newArrearage;
END //

DELIMITER ;
*/

-- insert data
INSERT INTO Employees (EmployeeCode, Name, Gender, Address, PhoneNumber, EmployeeType) VALUES
('EMP001', 'John Doe', 'male', '1234 Elm St', '0123456789', 'manager,partner_staff'),
('EMP002', 'Jane Smith', 'female', '5678 Oak St', '0987654321', 'partner_staff'),
('EMP003', 'Alex Johnson', 'other', '9012 Maple Ave', '05556667777', 'partner_staff'),
('EMP004', 'My Dieu', 'female', 'Tp Can Tho', '03334445555', 'manager,operational_staff'),
('EMP005', 'Nau', 'female', 'Tp Can Tho', '0111222333', 'operational_staff'),
('EMP006', 'Map', 'male', 'Tp Can Tho', '0444555666', 'operational_staff'),
('EMP007', 'Cop', 'female', 'TP HCM', '0777888999', 'manager,office_staff'),
('EMP008', 'Dau', 'male', 'Da Nang', '0123412341', 'office_staff'),
('EMP009', 'My Lem', 'female', 'Ha Noi', '0567856785', 'office_staff'),
('EMP0010', 'Su Go', 'male', 'Ha Noi', '0909070809', 'manager')
;


INSERT INTO Suppliers (SupplierCode, Name, Address, BankAccount, TaxCode, EmployeeCode) VALUES
('SUP001', 'Nguyen Van A', 'Tan Thoi Hoa, Tan Phu', '1122334455', 'TX001', 'EMP001'),
('SUP002', 'Nguyen Thi B', 'Phuong 2, Tan Binh', '2233556677', 'TX002', 'EMP002'),
('SUP003', 'Silk Agency', 'Phuong 3, Quan 3', '1112223330', 'TX001', 'EMP003'),
('SUP004', 'Silk Agency', 'Long An', '1234512345', 'TX001', 'EMP001'),
('SUP005', 'Dinh Thi E', 'Binh Chanh', '6789067890', 'TX001', 'EMP003'),
('SUP007', 'Ly Thi F', 'Phuong 14, Quan 10', '2345623456', 'TX001', 'EMP002')
;

INSERT INTO SupplierPhoneNumbers  ( SupplierCode, PhoneNumber) VALUES
('SUP001', '0121212121'),
('SUP001', '0232323232'),
('SUP001', '0343434343'),
('SUP002', '0454545454'),
('SUP003', '0565656565'),
('SUP004', '0676767676'),
('SUP005', '0787878787'),
('SUP007', '0898989898'),
('SUP007', '0909090909')
;

INSERT INTO FabricCategories (CategoryCode, SupplierCode, CategoryName, Color, Quantity) VALUES
('CAT001', 'SUP001', 'Cotton', 'Red', 2),
('CAT002', 'SUP002', 'Silk', 'Blue', 2),
('CAT003', 'SUP001', 'Wool', 'Green', 1),
('CAT004', 'SUP003', 'Linen', 'White', 0),
('CAT005', 'SUP004', 'Polyester', 'Black', 2),
('CAT006', 'SUP005', 'Rayon', 'Yellow', 3),
('CAT007', 'SUP007', 'Denim', 'Blue', 1)
;

INSERT INTO CurrentPrices (CategoryCode, CurrentPrice, PriceDate) VALUES
('CAT001', 100, '2020-11-19'),
('CAT002', 50, '2022-1-1'),
('CAT003', 25, '2022-10-10'),
('CAT004', 125, '2000-10-30'),
('CAT005', 75, '2002-10-23'),
('CAT006', 22.50, '2000-4-11'),
('CAT007', 37.5, '2023-11-27'),
('CAT001', 100, '2020-10-19'),
('CAT002', 30, '2021-1-1'),
('CAT003', 20, '2022-1-10')
;

INSERT INTO Customers (CustomerCode, EmployeeCode, FirstName, LastName, Address, Arrearage, PRIMARY_PAYMENTS) VALUES
('CUS001', 'EMP007', 'Nguyen Thi Hoang', 'Mot', '123 Maple St', 0.00, 0.00),
('CUS002', 'EMP007', 'Phan Ngoc Khue', 'Hai', '234 Maple St',  150.00, 150.00),
('CUS003', 'EMP007', 'Bui Thi Bich', 'Ba', '345 Oak St', 150.00, 150.00),
('CUS004', 'EMP008', 'Nguyen Tran Thao', 'Bon', '456 Oak St', 150.00, 150.00),
('CUS005', 'EMP008', 'Pham Thanh', 'Nam', '456 Oak St', 150.00, 150.00),
('CUS006', 'EMP009', 'Vuong Thao', 'Sau', '789 Pine St', 200.00, 200.00)
;
INSERT INTO CustomerPhoneNumbers (CustomerCode, PhoneNumber) VALUES
('CUS001','0111111111'),
('CUS001','0101010101'),
('CUS002','0222222222'),
('CUS003','0333333333'),
('CUS004','0444444444'),
('CUS005','05456435555'),
('CUS005','075645555'),
('CUS005','055555455'),
('CUS006','0556445645')
;

INSERT INTO Orders (OrderCode, CustomerCode, EmployeeCode, OrderDate, TotalPrice, OrderStatus, CancellationReason ) VALUES
('ORD001', 'CUS001', 'EMP004', '2023-10-30 10:00:00', 500.00, 'Full_paid', NULL),
('ORD002', 'CUS002', 'EMP005', '2023-10-31 11:00:00', 300.00, 'Ordered', NULL),
('ORD003', 'CUS002', 'EMP006', '2023-11-2 09:00:00', 450.00, 'Cancelled', 'change the location'),
('ORD004', 'CUS003', 'EMP004', '2023-11-3 08:30:00', 500.00, 'Partial_paid', NULL),
('ORD005', 'CUS004', 'EMP006', '2023-11-4 22:30:00', 100.00, 'Full_paid', NULL),
('ORD006', 'CUS003', 'EMP004', '2023-11-3 08:30:00', 500.00, 'Partial_paid', NULL),
('ORD007', 'CUS004', 'EMP006', '2023-11-4 22:30:00', 100.00, 'Full_paid', NULL),
('ORD008', 'CUS005', 'EMP004', '2023-11-3 08:30:00', 500.00, 'Partial_paid', NULL),
('ORD009', 'CUS006', 'EMP006', '2023-11-4 22:30:00', 100.00, 'Full_paid', NULL)
;

INSERT INTO Bolts (BoltCode, CategoryCode, OrderCode, Length) VALUES
('BOL001', 'CAT001', 'ORD001', 10),
('BOL002', 'CAT001', 'ORD009', 11),
('BOL003', 'CAT002', 'ORD006', 15),
('BOL004', 'CAT002', 'ORD008', 16),
('BOL005', 'CAT003', 'ORD001', 20.5),
('BOL006', 'CAT005', 'ORD007', 4.5),
('BOL007', 'CAT005', 'ORD005', 5.5),
('BOL008', 'CAT006', 'ORD002', 6.5),
('BOL009', 'CAT006', 'ORD003', 7.5),
('BOL0010', 'CAT006', 'ORD004', 9.4)
;

INSERT INTO PaymentHistory (CustomerCode, OrderCode, PaymentDate, Amount) VALUES
('CUS001', 'ORD001', '2023-11-5 15:00:00', 499.00),
('CUS001', 'ORD001', '2023-11-6 15:00:00', 1.00),
('CUS003', 'ORD002', '2023-11-7 17:00:00', 300.00),
('CUS003', 'ORD004', '2023-11-8 18:00:00', 100.00),
('CUS004', 'ORD005', '2023-11-8 19:00:00', 50.00)
;

INSERT INTO  CategoryImportHistory (CategoryCode, ImportDate, Quantity, Price) VALUES
('CAT001', '2000-01-01 10:00:10', 10, 435),
('CAT002', '2001-03-15 09:53:20', 20,765.99),
('CAT003', '2002-06-12 12:00:30', 10,647),
('CAT004', '2003-07-20 22:00:40', 15,785),
('CAT005', '2004-08-23 17:00:50', 7,454),
('CAT006', '2007-10-06 16:30:15', 8,543),
('CAT006', '2020-11-29 15:33:00', 12,655),
('CAT007', '2023-11-30 11:44:00', 15,565)
;



-- cau 4
DELIMITER //

CREATE PROCEDURE SortSuppliersByCategories(IN startDate DATETIME, IN endDate DATETIME)
BEGIN
    SELECT S.SupplierCode, S.Name, COUNT(DISTINCT FC.CategoryCode) AS NumberOfCategories
    FROM Suppliers S
    INNER JOIN FabricCategories FC ON S.SupplierCode = FC.SupplierCode
    INNER JOIN CurrentPrices IP ON FC.CategoryCode = IP.CategoryCode
    WHERE IP.PriceDate BETWEEN startDate AND endDate
    GROUP BY S.SupplierCode
    ORDER BY NumberOfCategories ASC;
END //

DELIMITER ;

-- cau 3 old
DELIMITER //

CREATE FUNCTION CalculateTotalPurchasePrice (SupplierCodeInput VARCHAR(50))
RETURNS DECIMAL(10, 2)
READS SQL DATA
BEGIN
    DECLARE totalPurchasePrice DECIMAL(10, 2);

    SELECT SUM(IP.CurrentPrice * FC.Quantity) INTO totalPurchasePrice
    FROM FabricCategories AS FC
    INNER JOIN CurrentPrices AS IP ON FC.CategoryCode = IP.CategoryCode
    WHERE FC.SupplierCode = SupplierCodeInput;

    RETURN IFNULL(totalPurchasePrice, 0);
END //

DELIMITER ;


-- cau 3
/*DELIMITER //

CREATE FUNCTION CalculateTotalPurchasePrice (SupplierCodeInput VARCHAR(255))
RETURNS TEXT
READS SQL DATA
BEGIN
    DECLARE totalPurchasePrice DECIMAL(10, 2);
    DECLARE finalResult TEXT DEFAULT '';
    DECLARE currentIndex INT DEFAULT 1;
    DECLARE currentSupplierCode VARCHAR(50);
    DECLARE supplierCount INT;

    -- Tính tổng số nhà cung cấp trong danh sách
    SET supplierCount = CHAR_LENGTH(SupplierCodeInput) - CHAR_LENGTH(REPLACE(SupplierCodeInput, ',', '')) + 1;

    -- Lặp qua từng nhà cung cấp
    WHILE currentIndex <= supplierCount DO
        SET currentSupplierCode = SUBSTRING_INDEX(SUBSTRING_INDEX(SupplierCodeInput, ',', currentIndex), ',', -1);

        SELECT SUM(IP.CurrentPrice * FC.Quantity) INTO totalPurchasePrice
        FROM FabricCategories AS FC
        INNER JOIN CurrentPrices AS IP ON FC.CategoryCode = IP.CategoryCode
        WHERE FC.SupplierCode = currentSupplierCode;

        -- Cộng dồn kết quả vào chuỗi trả về
        SET finalResult = CONCAT(finalResult, 'Supplier ', currentSupplierCode, ': ', IFNULL(totalPurchasePrice, 0), ';\n');

        SET currentIndex = currentIndex + 1;
    END WHILE;

    RETURN finalResult;
END //

DELIMITER ;
*/

/* cau 1 + 2
-- cau 1
UPDATE CurrentPrices
INNER JOIN	FabricCategories ON 
CurrentPrices.CategoryCode = FabricCategories.CategoryCode
SET 	CurrentPrices.CurrentPrice = CurrentPrices.CurrentPrice * 1.10,
CurrentPrices.PriceDate = NOW()
WHERE FabricCategories.Name = 'Silk' AND CurrentPrices.PriceDate >= '2020-09-01';

-- cau 2
SELECT Orders.*
FROM Orders
JOIN Bolts ON Orders.OrderCode = Bolts.OrderCode
JOIN FabricCategories ON Bolts.CategoryCode = FabricCategories.CategoryCode
JOIN Suppliers ON FabricCategories.SupplierCode = Suppliers.SupplierCode
WHERE Suppliers.Name = 'Silk Agency';

CREATE PROCEDURE SortSuppliersByCategoryCount(IN StartDate DATETIME, IN EndDate DATETIME)
BEGIN
    SELECT S.SupplierCode, COUNT(DISTINCT FC.CategoryCode) AS CategoryCount
    FROM Suppliers AS S
    JOIN FabricCategories AS FC ON S.SupplierCode = FC.SupplierCode
    JOIN CurrentPrices AS IP ON FC.CategoryCode = IP.CategoryCode
    WHERE IP.PriceDate BETWEEN StartDate AND EndDate
    GROUP BY S.SupplierCode
    ORDER BY S.CategoryCode;
END //

 */
/* chay code
UPDATE CurrentPrices
INNER JOIN	FabricCategories ON 
CurrentPrices.CategoryCode = FabricCategories.CategoryCode
SET 	CurrentPrices.CurrentPrice = CurrentPrices.CurrentPrice * 1.10,
CurrentPrices.PriceDate = NOW()
WHERE FabricCategories.CategoryName LIKE '%Silk%' AND CurrentPrices.PriceDate >= '2020-09-01';

select * 
from CurrentPrices
INNER JOIN	FabricCategories ON 
CurrentPrices.CategoryCode = FabricCategories.CategoryCode;

SELECT Orders.*
FROM Orders
JOIN Bolts ON Orders.OrderCode = Bolts.OrderCode
JOIN FabricCategories ON Bolts.CategoryCode = FabricCategories.CategoryCode
JOIN Suppliers ON FabricCategories.SupplierCode = Suppliers.SupplierCode
WHERE Suppliers.Name = 'Silk Agency';

CALL SortSuppliersByCategories('2000-1-1', '2023-11-28');

SELECT Suppliers.SupplierCode, CalculateTotalPurchasePrice(FabricCategories.SupplierCode)
from Suppliers, FabricCategories
where Suppliers.SupplierCode = FabricCategories.SupplierCode
group by Suppliers.SupplierCode;
*/



