const Product = require('../models/product');

const getAllProductsStatic = async (req, res) => {
  const product = await Product.find({
    price: { $gte: 100 },
  }).sort('-name -price');
  res.status(200).json({
    product,
  });
};

const getAllProducts = async (req, res) => {
  const queryObject = {};

  const { featured, company, name, sort, field, numericFilters } = req.query;

  if (featured) {
    queryObject.featured = featured === 'true' ? true : false;
  }

  if (company) {
    queryObject.company = company;
  }

  if (name) {
    queryObject.name = { $regex: name, $options: 'i' };
  }
  if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': 'lte',
    };

    // get operators and replace them with mongo's operator
    const regEx = /\b(<|>|>=|<=|=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );

    // define properties can numeric filter
    const options = ['price', 'rating'];

    // 'price-$gt-40,rating-$gte-4'

    //=> split to array properties filter
    filters = filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-');

      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });

    console.log(queryObject);
  }

  // numeric filter

  let result = Product.find(queryObject);

  // sort
  if (sort) {
    const sortList = sort.split(',').join(' ');
    result = result.sort(sortList);
  } else {
    result = result.sort('createdAt');
  }

  // select field

  if (field) {
    const fieldList = field.split(',').join(' ');
    result = result.select(fieldList);
  }

  // pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const products = await result;
  res.status(200).json({
    nHits: products.length,
    products,
  });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
