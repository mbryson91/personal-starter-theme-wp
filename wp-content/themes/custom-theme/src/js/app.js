var $ = require('jquery');
var Popper = require('@popperjs/core');
require('bootstrap/js/dist/alert');
require('bootstrap/js/dist/button');
require('bootstrap/js/dist/carousel');
require('bootstrap/js/dist/collapse');
require('bootstrap/js/dist/dropdown');
require('bootstrap/js/dist/modal');
require('bootstrap/js/dist/popover');
require('bootstrap/js/dist/scrollspy');
require('bootstrap/js/dist/tab');
require('bootstrap/js/dist/toast');
require('bootstrap/js/dist/tooltip');
require('bootstrap/js/dist/util');
// require('./defaults/customizer');
// require('./defaults/navigation.js');

$(function () {
    'use strict'

    $('[data-toggle="offcanvas"]').on('click', function () {
        $('.offcanvas-collapse').toggleClass('open')
    })
})