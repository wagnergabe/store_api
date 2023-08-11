const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({
    name: '2',
  });
  res.status(200).json({ products, numHits: products.length });
};
const getAllProducts = async (req, res) => {
  const { featured, company, name, sort } = req.query;
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }

  if (company) {
    queryObject.company = company;
  }

  if (name) {
    queryObject.name = { $regex: name, $options: 'i'}
  }

  let result = Product.find(queryObject)

  //sort
  if(sort){
    const sortList = sort.split(',').join(' ')
    result = result.sort(sortList)
  }
  else {
    result = result.sort('createAt')
  }

if(fields) {
    const fieldList = fields.split('').join(' ')
    result = result.select(fieldList)
}

  const products = await result
  res.status(200).json({ products, numberHits: products.length });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
