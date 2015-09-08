
# GET Total count of records in database 

exports.getTotalCount = (req, res) ->
  db = req.db
  collection = db.get('aptdb')
  collection.count {}, (error, count) ->
    res.json count
    return
  return

# Get Property listing price on Map 

exports.propertylist = (req, res) ->
  db = req.db
  collection = db.get('aptdb')

  collection.col.aggregate [ { '$group':
    '_id': '$region'
    'Average': '$avg': '$price' } ], (err, docs) ->
    if err
      console.log err
    console.log docs
    res.json docs
    return
  return

# Get Property Listing by Region using Price Range

exports.propertylistByRegionRange = (req, res) ->
  db = req.db
  collection = db.get('aptdb')
  min = parseInt(req.query.min)
  max = parseInt(req.query.max)
  collection.col.aggregate [
    { '$match': 'price':
      $gt: min
      $lt: max }
    { '$group':
      '_id': '$region'
      'count': $sum: 1 }
  ], (err, docs) ->
    if err
      console.log err
    console.log docs
    res.json docs
    return
  return

# Update Table on any change
exports.updatebyregionorfilterchange = (req, res) ->
  db = req.db
  collection = db.get('aptdb')
  min = if typeof req.query.min != 'undefined' and req.query.min != null then parseInt(req.query.min) else -1
  max = if typeof req.query.max != 'undefined' and req.query.max != null then parseInt(req.query.max) else -1
  reg = if typeof req.query.region != 'undefined' and req.query.region != null then req.query.region else 'all'
  filter = if typeof req.query.filter != 'undefined' and req.query.filter != null then req.query.filter else 'No Filters'
  start = parseInt(req.query.start)
  end = parseInt(req.query.end)
  totalRecord = parseInt(end - start)
  if reg == 'San Francisco'
    reg = 'sfc'
  else if reg == 'North Bay'
    reg = 'nby'
  else if reg == 'South Bay'
    reg = 'sby'
  else if reg == 'East Bay'
    reg = 'eby'
  else if reg == 'Santa Cruz'
    reg = 'scz'
  else if reg == 'Peninsula'
    reg = 'pen'
  else
    reg = 'all'
  if reg == 'all' and filter == 'No Filters' and min == -1 and max == -1
    collection.find {}, {
      limit: totalRecord
      skip: start
    }, (e, docs) ->
      res.json docs
      return
  else if reg != 'all' and filter == 'No Filters'
    collection.find {
      region: reg
      price:
        $gte: min
        $lte: max
    }, {
      limit: totalRecord
      skip: start
    }, (e, docs) ->
      res.json docs
      return
  else if reg == 'all' and filter == 'No Filters'
    collection.find { price:
      $lte: max
      $gte: min }, {
      limit: totalRecord
      skip: start
    }, (e, docs) ->
      res.json docs
      return
  else if reg != 'all' and filter == 'Price Low to High'
    collection.find {
      region: reg
      price:
        $gte: min
        $lte: max
    }, {
      limit: totalRecord
      skip: start
      sort: price: 1
    }, (e, docs) ->
      res.json docs
      return
  else if reg == 'all' and filter == 'Price Low to High'
    collection.find { price:
      $gte: min
      $lte: max }, {
      limit: totalRecord
      skip: start
      sort: price: 1
    }, (e, docs) ->
      res.json docs
      return
  else if reg != 'all' and filter == 'Price High to Low'
    collection.find {
      region: reg
      price:
        $gte: min
        $lte: max
    }, {
      limit: totalRecord
      skip: start
      sort: price: -1
    }, (e, docs) ->
      res.json docs
      return
  else if reg == 'all' and filter == 'Price High to Low'
    collection.find { price:
      $lte: max
      $gte: min }, {
      limit: totalRecord
      skip: start
      sort: price: -1
    }, (e, docs) ->
      res.json docs
      return
  else if reg != 'all' and filter == 'Newest First'
    collection.find {
      region: reg
      price:
        $gte: min
        $lte: max
    }, {
      limit: totalRecord
      skip: start
      sort: date: -1
    }, (e, docs) ->
      res.json docs
      return
  else if reg == 'all' and filter == 'Newest First'
    collection.find { price:
      $lte: max
      $gte: min }, {
      limit: totalRecord
      skip: start
      sort: date: -1
    }, (e, docs) ->
      res.json docs
      return
  else if reg != 'all' and filter == 'Oldest First'
    console.log 'abd'
    collection.find {
      region: reg
      price:
        $gte: min
        $lte: max
    }, {
      limit: totalRecord
      skip: start
      sort: date: 1
    }, (e, docs) ->
      res.json docs
      return
  else if reg == 'all' and filter == 'Oldest First'
    console.log 'oldall'
    collection.find { price:
      $lte: max
      $gte: min }, {
      limit: totalRecord
      skip: start
      sort: date: 1
    }, (e, docs) ->
      res.json docs
      return
  return

# Get record count on any change
exports.getCountOnChange = (req, res) ->
  db = req.db
  collection = db.get('aptdb')
  min = parseInt(req.query.min)
  max = parseInt(req.query.max)
  reg = req.query.region
  console.log reg
  if reg == 'San Francisco'
    reg = 'sfc'
  else if reg == 'North Bay'
    reg = 'nby'
  else if reg == 'South Bay'
    reg = 'sby'
  else if reg == 'East Bay'
    reg = 'eby'
  else if reg == 'Santa Cruz'
    reg = 'scz'
  else if reg == 'Peninsula'
    reg = 'pen'
  else
    reg = 'all'
  #console.log(typeof reg);
  if reg != 'all'
    collection.count {
      region: reg
      price:
        $lte: max
        $gte: min
    }, (error, count) ->
      res.json count
      return
  else
    collection.count { price:
      $lte: max
      $gte: min }, (e, count) ->
      res.json count
      return
  return