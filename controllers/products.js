const Product = require("../models/product");


const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
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
  if(numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '<': '$lt',
      '<=': '$lte',
      '=': '$eq',
    }
    const regEx = /\b(<|>|>=|<|<=|=)\b/g
    let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`)
    console.log(filters)
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

const page = Number(req.query.page) || 1
const limit = Number(req.query.limit) || 10
const skip = (page-1) * limit

result = result.skip(skip).limit(limit)

  const products = await result
  res.status(200).json({ products, numberHits: products.length });
};

module.exports = getAllProducts

