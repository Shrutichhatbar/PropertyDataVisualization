###
# GET home page.
###

exports.index = (req, res) ->
  res.render 'index',
    title: 'Express'
    year: (new Date).getFullYear()
  return
