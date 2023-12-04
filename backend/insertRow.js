const sequelize = require('./database/sequelize')

async function insertMillionRows() {
    const categories = [1, 2, 3, 4, 5, 6];
    const orders = [1, 2, 3, 4, 5];
    const startLength = 3;
    const endLength = 30;
  
    const insertQuery = `
      INSERT INTO Bolts (BoltCode, CategoryCode, OrderCode, Length)
      VALUES ${Array.from({ length: 1000000 }, (_, index) => {
        const boltCode = index;
        const categoryCode = categories[index % categories.length];
        const orderCode = orders[index % orders.length];
        const length = Math.random() * (endLength - startLength) + startLength;
  
        return `('${boltCode}', 'CAT00${categoryCode}', ${orderCode ? `'ORD00${orderCode}'` : 'NULL'}, ${length.toFixed(2)})`;
      }).join(',')}
    `
    await sequelize.query(insertQuery)
}

insertMillionRows()