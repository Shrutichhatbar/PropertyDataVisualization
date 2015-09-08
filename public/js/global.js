// Userlist data array for filling in info box
var propertyListData = [];

var currentPage = 1;
var PAGE_SIZE = 12;
var MAX_SLIDER = 6000;
var MAX_INT = 2147483647;

function getPagination(currentPage, totalCount) {
    var numPages = Math.floor(totalCount / PAGE_SIZE);
    var pages = "";
    if (currentPage > 1) {
        if (currentPage > 2)
            pages += '<li><a onClick="pageUpdate(1)">«</a></li>';
        else
            pages += '<li class="disabled"><a>«</a></li>';
        pages += '<li><a onClick="pageUpdate(' + (currentPage - 1) + ')">‹</a></li>';
    }
    else {
        pages += '<li class="disabled"><a>«</a></li>';
        pages += '<li class="disabled"><a>‹</a></li>';
    }
    pages += '<li class="active"><a>Page ' + currentPage + ' of ' + numPages + '</a></li>';
    if (currentPage < numPages) {
        pages += '<li><a onClick="pageUpdate(' + (currentPage + 1) + ')">›</a></li>';
        if (currentPage < numPages - 1)
            pages += '<li><a onClick="pageUpdate(' + numPages + ')">»</a></li>';
        else
            pages += '<li class="disabled"><a onClick="pageUpdate(' + numPages + ')">»</a></li>';
    }
    else {
        pages += '<li class="disabled"><a>›</a></li>';
        pages += '<li class="disabled"><a>»</a></li>';
    }
    return pages;
}

function updatePropertyTable(pageNum) {
    minValue = document.getElementById('min-value');
    maxValue = document.getElementById('max-value');
    var min = parseInt(minValue.innerHTML);
    var max = MAX_INT;
    if (maxValue.innerHTML != 'MAX')
        var max = parseInt(maxValue.innerHTML);
    var region = $('.region').find('.btn-primary').html();
    var filter = $('.arrange').find('.btn-primary').html();
    console.log(filter)
    var start = (pageNum - 1) * PAGE_SIZE;
    var end = pageNum * PAGE_SIZE;

    $.getJSON('/users/updatebyregionorfilterchange/?min=' + min + '&max=' + max + '&region=' + region + '&filter=' + filter + '&start=' + start + '&end=' + end, function (data) {
        var tableContent = '';
        var count = 0;
        $('#props1').html('');
        $('#props2').html('');
        $('#props3').html('');
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function () {
            var length = this.title.length;
            var random = "img/" + (length % 6 + 1) + ".jpg";
            
            var date = this.date;
            date = date.replace(/-/g, " ");
            date = date.replace(/:/g, " ");
            var res = date.split(" ");
            var dt = new Date(res[0], res[1], res[2], res[3], res[4])
          
            tableContent += '<div class="col-md-3 col-xs-3 mix cat_nature cat_all" style="display: inline-block;"> \
                    <a class="thumbnail-item"> \
                        <img src='+ random + ' alt=' + this.title + ' /> \
                        <div class="thumbnail-info"> \
                            <p>' + this.location + '</p> \
                            <button class="btn btn-primary"><span class="fa fa-eye"></span></button> \
                        </div> \
                    </a> \
                    <div class="thumbnail-data"> \
                        <h5>$'+ this.price + ' - ' + this.title + '</h5> \
                        <p><span class="displayregion">' + this.region + '</span> ' + dt.toDateString() + '</p> \
                    </div> \
                </div>';
            count++;
            if (count <= 4) {
                $('#props1').append(tableContent);
                tableContent = '';
            }
            if (count <= 8) {
                $('#props2').append(tableContent);
                tableContent = '';
            }
            if (count <= 12) {
                $('#props3').append(tableContent);
                tableContent = '';
            }
        });

        var totalCount;

        $.ajax({
            url: '/users/getCountOnChange/?min=' + min + '&max=' + max + '&region=' + region + '',
            dataType: 'json',
            async: false,
            success: function (data) {
                totalCount = data;
            }
        });

        $('.pagination').html(getPagination(pageNum, totalCount));

    });
}

// DOM Ready =============================================================
$(document).ready(function () {

    $('#all').on('click', regionChange);
    $('#sfo').on('click', regionChange);
    $('#nby').on('click', regionChange);
    $('#eby').on('click', regionChange);
    $('#sby').on('click', regionChange);
    $('#pen').on('click', regionChange);
    $('#scz').on('click', regionChange);
    $('#ltoh').on('click', arrangementChange);
    $('#htol').on('click', arrangementChange);
    $('#newfirst').on('click', arrangementChange);
    $('#oldfirst').on('click', arrangementChange);

    var slider = document.getElementById('slider');

    noUiSlider.create(slider, {
        start: [1000, 5000],
        step: 5, // Slider moves in increments of '5'
        margin: 100,
        connect: true,
        range: {
            'min': 0,
            'max': 6000
        },
    });

    minValue = document.getElementById('min-value');
    maxValue = document.getElementById('max-value');

    // When the slider value changes, update the min and max value
    slider.noUiSlider.on('change', function (values, handle) {
        if (handle) {
            if(values[handle]==MAX_SLIDER)
                maxValue.innerHTML = "MAX";
            else
                maxValue.innerHTML = parseInt(values[handle]);

        } else {
            minValue.innerHTML = parseInt(values[handle]);
        }
        $('#averageprice').removeClass('btn-primary').addClass('btn-success');
        $('#listingbyregion').removeClass('btn-success').addClass('btn-primary');
        var min = parseInt(minValue.innerHTML);
        var max = MAX_INT;
        if (maxValue.innerHTML != 'MAX')
            var max = parseInt(maxValue.innerHTML);
        var region = $('.region').find('.btn-primary').html();
        var filter = $('.arrange').find('.btn-primary').html();

        // On slider change changes in number of count in number of listing on map 
        $.getJSON('/users/propertylistByRegionRange/?min=' + min + '&max=' + max + '', function (data) {

            $.each(data, function () {
                $('.' + this._id).html("<a href=\"\" class=\"label-danger btn avgprice\" rel=\"tooltip\" title=\"Count " + this._id + "\">" + Math.round(this.count) + "</a>");
            });

        });

        // Also change table/grid on slider change
        updatePropertyTable(1);
    });

    // Populate average price map

    //on clicking list by region sidebar
    $('#listingbyregion').on('click', showListingByRegion);
    //on clicking average price by region
    $('#averageprice').on('click', populateAveragePrice);
    populateAveragePrice();

});

function pageUpdate(pageNum) {
    var start = (pageNum - 1) * PAGE_SIZE;
    var end = pageNum * PAGE_SIZE;
    currentPage = pageNum;

    updatePropertyTable(pageNum);
}

// Change grid/table when region changes
function regionChange() {
    $('.region').find('.btn-primary').removeClass('btn-primary').addClass('btn-success');
    $(this).addClass('btn-primary').removeClass('btn-success');

    updatePropertyTable(1);
};

// Change Filters low to high, hight to low, newest first or oldest first
function arrangementChange() {
    $('.arrange').find('.btn-primary').removeClass('btn-primary').addClass('btn-success');
    $(this).addClass('btn-primary').removeClass('btn-success');

    updatePropertyTable(1);
};

// Fill Map values with Average Price in respective regions
function populateAveragePrice() {
    $('#listingbyregion').removeClass('btn-primary').addClass('btn-success');
    $('#averageprice').removeClass('btn-success').addClass('btn-primary');
    // jQuery AJAX call for JSON
    $.getJSON('/users/propertylist', function (data) {
        // Uncomment below line to Check Data
        // console.log(data);
        // For each region in our JSON, add average price on map
        $.each(data, function () {
            $('.' + this._id).html("<a href=\"\" class=\"label-danger btn avgprice\" rel=\"tooltip\" title=\"Average Price " + this._id + "\">$" + Math.round(this.Average) + "</a>");
        });
    });
};

// Fill Map values with number of entries int respective regions
function showListingByRegion() {

    $('#averageprice').removeClass('btn-primary').addClass('btn-success');
    $('#listingbyregion').removeClass('btn-success').addClass('btn-primary');
    var min = parseInt(minValue.innerHTML);
    var max = MAX_INT;
    if (maxValue.innerHTML != 'MAX')
        var max = parseInt(maxValue.innerHTML);

    // jQuery AJAX call for JSON
    $.getJSON('/users/propertylistByRegionRange/?min=' + min + '&max=' + max + '', function (data) {
        // Check data
        // console.log(data);
        // For each region in our JSON, add listing count on map

        $.each(data, function () {
            $('.' + this._id).html("<a href=\"\" class=\"label-danger btn avgprice\" rel=\"tooltip\" title=\"Count " + this._id + "\">" + Math.round(this.count) + "</a>");
        });
    });
};
