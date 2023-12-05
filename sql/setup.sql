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
	CategoryCode VARCHAR(50) ,
    CurrentPrice DECIMAL(10, 2),
    PriceDate DATETIME,
    PRIMARY KEY (CategoryCode , PriceDate),
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
    ImportPrice DECIMAL(10, 2),
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
('CAT003', 'SUP001', 'faux silk', 'Green', 1),
('CAT004', 'SUP003', 'Silk', 'White', 1),
('CAT005', 'SUP004', 'Polyester', 'Black', 2),
('CAT006', 'SUP005', 'Khaki', 'Yellow', 3),
('CAT007', 'SUP005', 'Crewel', 'Blue', 1)
;

INSERT INTO CurrentPrices (CategoryCode, CurrentPrice, PriceDate) VALUES
('CAT001', 100, '2023-11-19'),
('CAT002', 50, '2023-1-1'),
('CAT003', 25, '2023-10-10'),
('CAT004', 125, '2023-10-30'),
('CAT005', 75, '2023-10-23'),
('CAT006', 22.50, '2023-4-11'),
('CAT007', 37.5, '2023-11-27')
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
('ORD001', 'CUS001', 'EMP004', '2023-10-30 10:00:00', 125, 'Full_paid', NULL),
('ORD002', 'CUS003', 'EMP005', '2023-10-31 11:00:00', 22.5, 'Partial_paid', NULL),
('ORD003', 'CUS002', 'EMP006', '2023-11-2 09:00:00', 22.5, 'Cancelled', 'change the location'),
('ORD004', 'CUS003', 'EMP004', '2023-11-3 08:30:00', 22.5, 'Partial_paid', NULL),
('ORD005', 'CUS004', 'EMP006', '2023-11-4 22:30:00', 75, 'Partial_paid', NULL),
('ORD006', 'CUS003', 'EMP004', '2023-11-3 08:30:00', 50, 'Ordered', NULL),
('ORD007', 'CUS004', 'EMP006', '2023-11-4 22:30:00', 75, 'Ordered', NULL),
('ORD008', 'CUS005', 'EMP004', '2023-11-3 08:30:00', 50, 'Ordered', NULL),
('ORD009', 'CUS006', 'EMP006', '2023-11-4 22:30:00', 100, 'Ordered', NULL)
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
('BOL0010', 'CAT006', 'ORD004', 9.4),
('BOL0011', 'CAT004', NULL, 10)
;

INSERT INTO PaymentHistory (CustomerCode, OrderCode, PaymentDate, Amount) VALUES
('CUS001', 'ORD001', '2023-11-5 15:00:00', 100.00),
('CUS001', 'ORD001', '2023-11-6 15:00:00', 25.00),
('CUS003', 'ORD002', '2023-11-7 17:00:00', 20.00),
('CUS003', 'ORD004', '2023-11-8 18:00:00', 20.00),
('CUS004', 'ORD005', '2023-11-8 19:00:00', 70.00)
;

INSERT INTO  CategoryImportHistory (CategoryCode, ImportDate, Quantity, ImportPrice) VALUES
('CAT001', '2020-01-01 10:00:10', 10, 10),
('CAT002', '2020-03-15 09:53:20', 20, 20),
('CAT003', '2022-06-12 12:00:30', 10, 25),
('CAT004', '2022-07-20 22:00:40', 15, 30),
('CAT005', '2022-08-23 17:00:50', 7, 20),
('CAT006', '2022-11-29 15:33:00', 12, 10),
('CAT007', '2022-11-30 11:44:00', 15, 40)
;

-- cau 3 
DELIMITER //

CREATE FUNCTION CalculateTotalPurchasePrice (SupplierCodeInput VARCHAR(50))
RETURNS DECIMAL(10, 2)
READS SQL DATA
BEGIN
    DECLARE totalPurchasePrice DECIMAL(10, 2);

    SELECT SUM(IP.ImportPrice * IP.Quantity) INTO totalPurchasePrice
    FROM FabricCategories AS FC
    INNER JOIN CategoryImportHistory AS IP ON FC.CategoryCode = IP.CategoryCode
    WHERE FC.SupplierCode = SupplierCodeInput;

    RETURN IFNULL(totalPurchasePrice, 0);
END //

DELIMITER ;


-- cau 4
DELIMITER //

CREATE PROCEDURE SortSuppliersByCategories(IN startDate DATETIME, IN endDate DATETIME)
BEGIN
    SELECT S.SupplierCode, S.Name, COUNT(DISTINCT FC.CategoryCode) AS NumberOfCategories
    FROM Suppliers S
    INNER JOIN FabricCategories FC ON S.SupplierCode = FC.SupplierCode
    INNER JOIN CategoryImportHistory IP ON FC.CategoryCode = IP.CategoryCode
    WHERE IP.ImportDate BETWEEN startDate AND endDate
    GROUP BY S.SupplierCode
    ORDER BY NumberOfCategories ASC;
END //

DELIMITER ;

/* chay code
UPDATE CurrentPrices
INNER JOIN	FabricCategories ON CurrentPrices.CategoryCode = FabricCategories.CategoryCode
INNER JOIN CategoryImportHistory ON CategoryImportHistory.CategoryCode = FabricCategories.CategoryCode
SET CurrentPrices.CurrentPrice = CurrentPrices.CurrentPrice * 1.10,
CurrentPrices.PriceDate = NOW()
WHERE FabricCategories.CategoryName LIKE '%Silk%' AND CategoryImportHistory.ImportDate >= '2020-09-01';

select CurrentPrices.*, FabricCategories.* , CategoryImportHistory.ImportDate
from CurrentPrices
INNER JOIN	FabricCategories ON 
CurrentPrices.CategoryCode = FabricCategories.CategoryCode
INNER JOIN CategoryImportHistory ON 
CategoryImportHistory.CategoryCode = FabricCategories.CategoryCode
;

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


