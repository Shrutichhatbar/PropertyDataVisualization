﻿// Generated by IcedCoffeeScript 108.0.8

/*
 * GET home page.
 */

(function() {
  exports.index = function(req, res) {
    res.render('index', {
      title: 'Express',
      year: (new Date).getFullYear()
    });
  };

}).call(this);