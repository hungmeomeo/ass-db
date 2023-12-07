-- cau 1
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

-- cau 2
SELECT Orders.*
FROM Orders
JOIN Bolts ON Orders.OrderCode = Bolts.OrderCode
JOIN FabricCategories ON Bolts.CategoryCode = FabricCategories.CategoryCode
JOIN Suppliers ON FabricCategories.SupplierCode = Suppliers.SupplierCode
WHERE Suppliers.Name = 'Silk Agency';


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
    WHERE FC.SupplierCode = SupplierCodeInput
    ;
    RETURN IFNULL(totalPurchasePrice, 0);
END //

DELIMITER ;

SELECT Suppliers.SupplierCode, CalculateTotalPurchasePrice(FabricCategories.SupplierCode)
from Suppliers, FabricCategories
where Suppliers.SupplierCode = FabricCategories.SupplierCode
group by Suppliers.SupplierCode;

-- cau 4
DELIMITER //

CREATE PROCEDURE SortSuppliersByCategories(IN startDate DATETIME, IN endDate DATETIME)
BEGIN
    SELECT S.SupplierCode, S.Name, COUNT(FC.CategoryCode) AS NumberOfCategories
    FROM Suppliers S
    INNER JOIN FabricCategories FC ON S.SupplierCode = FC.SupplierCode
    INNER JOIN CategoryImportHistory IP ON FC.CategoryCode = IP.CategoryCode
    WHERE IP.ImportDate BETWEEN startDate AND endDate
    GROUP BY S.SupplierCode
    ORDER BY NumberOfCategories ASC;
END //

DELIMITER ;

CALL SortSuppliersByCategories('2000-1-1', '2023-11-28');