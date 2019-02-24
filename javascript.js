/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var _now = new Date(),
    _chart;

function $$(selector, context) {
    context = context || document;
    var items = context.querySelectorAll(selector);
    return Array.from(items);
}

function createUrl(url, qs) {
    if(!qs) { return url; }

    var params = Object.keys(qs);
    if(params.length) {
        url = url + '?' + params.map(function(p) {
            return p +'='+ encodeURIComponent(qs[p]);
        }).join('&');
    }
    
    return url;
}

function getMean(items, getItemNumber) {
    getItemNumber = getItemNumber || function(x) { return x; };
    
    var len = items.length,
        sum = 0;
    
    var i = len;
    while (i--) {
        sum = sum + getItemNumber(items[i]);
    }
    
    var mean = sum/len;
    return mean;
}

/* Older Yahoo API - Doesn't work any longer

function createUrlYahoo_OBSOLETE(ticker, from, to) {
    //"Historical Prices" -> "Set Date Range" -> "Get Prices"..
    //  http://finance.yahoo.com/q/hp?s=MSFT&a=00&b=1&c=2015&d=11&e=31&f=2015&g=d
    //.. -> "Download to Spreadsheet":
    //  http://real-chart.finance.yahoo.com/table.csv?s=MSFT&a=00&b=1&c=2015&d=11&e=31&f=2015&g=d&ignore=.csv
    
    var urlBase = 'http://real-chart.finance.yahoo.com/table.csv';
    var qs = {};
    
    function qsDate(paramNames, date) {
        //Yahoo format: Month (zero based) *before* day, and then year:
        //http://stackoverflow.com/questions/2013255/how-to-get-year-month-day-from-a-date-object
        var dateParts = [date.getUTCMonth(), date.getUTCDate(), date.getUTCFullYear()];
        
        dateParts.forEach(function(d, i) {
            qs[paramNames[i]] = d;
        });
    }
    
    qs.s = ticker;
    qsDate(['a', 'b', 'c'], from);
    qsDate(['d', 'e', 'f'], to);
    qs.g = 'd';
    qs.ignore = '.csv';
    
    var url = createUrl(urlBase, qs);
    return url;
}

function parseYahoo_OBSOLETE(data) {
    //  Date,Open,High,Low,Close,Volume,Adj Close
    //  2015-09-11,16330.400391,16434.759766,16244.650391,16433.089844,104630000,16433.089844
    //  2015-09-10,16252.570312,16441.939453,16212.080078,16330.400391,122690000,16330.400391
    //  2015-09-09,16505.039062,16664.650391,16220.099609,16253.570312,118790000,16253.570312
    //  2015-09-08,16109.929688,16503.410156,16109.929688,16492.679688,123870000,16492.679688
    
    var days = data.split('\n').filter(function(row, i) {
        //Remove header row and any empty rows (there's usually one at the end):
        return (row && (i !== 0));
    });
    //console.log(days);
    
    //.sort(): Highcharts wants the data sorted ascending by date,
    //         and luckily each "day" row starts with the date in the sortable yyyy-mm-dd format:
    var ohlcData = days.sort()
                       .map(function(day) {
        var dayInfo = day.split(',');
        return [
            //new Date('2015-08-11') => UTC (which is what we want)
            //new Date(2015, 7, 11)  => Local
            new Date(dayInfo[0]).getTime(),
            
            Number(dayInfo[1]),
            Number(dayInfo[2]),
            Number(dayInfo[3]),
            Number(dayInfo[4]),
        ];
    });
    //console.log(ohlcData);
    
    return ohlcData;
}
*/

/* New Yahoo API - but CSV export requires some kind of authorization.. */
function createUrlYahoo(ticker, from, to) {
    //"Historical Data" -> "Time Period" -> "Apply"..
    //  https://finance.yahoo.com/quote/MSFT/history?period1=1492639200&period2=1498773600&interval=1d&filter=history&frequency=1d
    //.. -> "Download Data":
    //  https://query1.finance.yahoo.com/v7/finance/download/MSFT?period1=1492639200&period2=1498773600&interval=1d&events=history&crumb=E2mcvti0En9
    
    var urlBase = 'https://finance.yahoo.com/quote/' + ticker + '/history';
    //var urlBase = 'https://query1.finance.yahoo.com/v7/finance/download/' + ticker;
    var qs = {};
    
    function qsDate(param, date) {
        //JS: Milliseconds, Yahoo: Seconds
        var timestamp = Math.round(date.getTime() / 1000);
        qs[param] = timestamp;
    }
    
    qsDate('period1', from);
    qsDate('period2', to);
    qs.interval = '1d';
    
    qs.filter = 'history';
    qs.frequency = '1d';
    //qs.events = 'history';
    //qs.crumb = 'E2mcvti0En9';
    
    var url = createUrl(urlBase, qs);
    //console.log(url);
    return url;
}

function parseYahoo(html) {
    var doc = $(html),
        table = $('[data-test="historical-prices"]', doc).get()[0],
        rows = $$('tbody tr', table).map(tr => {
            var cols = $$('td', tr).map(x => x.textContent);
            return cols;
        });
    //console.log('rows', JSON.stringify(rows));
    //  "Jul 25, 2017","21,638.56","21,670.62","21,577.37","21,613.43","21,613.43","304,300,000"
    //  "Jul 24, 2017","21,577.78","21,577.78","21,496.13","21,513.17","21,513.17","284,080,000"
    //  "Jul 21, 2017","21,591.72","21,592.61","21,503.78","21,580.07","21,580.07","362,830,000"
    //  "Jul 20, 2017","21,641.54","21,661.91","21,576.96","21,611.78","21,611.78","313,950,000"
    
    //Highcharts wants the data sorted ascending by date:
    rows.reverse();
    
    function yahooNumber(input) {
        //"21,467.93" -> 21467.93
        input = input.replace(/,/g, '');
        return Number(input);
    }
    
    var ohlcData = rows.map(row => {
        return [
            new Date(row[0]).getTime(),
            
            yahooNumber(row[1]),
            yahooNumber(row[2]),
            yahooNumber(row[3]),
            yahooNumber(row[4]),
        ];
    });
    //console.log(ohlcData);
    
    return ohlcData;
}


function renderData(name, ohlcData) {
    var ohlcSeries = {
        name: name,
        data: ohlcData,

        type: 'spline',
        //http://stackoverflow.com/questions/9849806/data-grouping-into-weekly-monthly-by-user
        dataGrouping: { enabled: false },
        tooltip:      { valueDecimals: 2 },
    };
    _chart.addSeries(ohlcSeries);


    //Bollinger bands:
    //https://bl.ocks.org/godds/6550889
    var bandsData = [];
    var period = 20;
    var stdDevs = 2;
    for (var i = period - 1, len = ohlcData.length; i < len; i++) {
        var slice = ohlcData.slice(i + 1 - period , i+1);
        
        var mean = getMean(slice, function(d) { return d[4]; });
        
        var stdDev = Math.sqrt(getMean(slice.map(function(d) {
            return Math.pow(d[4] - mean, 2);
        })));
        
        bandsData.push([
            ohlcData[i][0],
            mean - (stdDevs * stdDev),
            mean + (stdDevs * stdDev)
        ]);
    }
    
    //https://www.highcharts.com/component/content/article/2-news/46-gauges-ranges-and-polar-charts-in-beta#ranges
    var bandsSeries = {
        name: 'Bollinger',
        data: bandsData,

        type: 'arearange',
        dataGrouping: { enabled: false },
        tooltip:      { valueDecimals: 2 },
        fillOpacity: 0.1,
    };
    _chart.addSeries(bandsSeries);
    
    //console.log(JSON.stringify(ohlcData));
    //console.log(JSON.stringify(bandsData));
}


$(function () {
    _chart = new Highcharts.StockChart({
        chart: {
            renderTo: document.querySelector('#chart1 .chart')
        },
        title: {
            text: 'Stock Price'
        },
        rangeSelector: {
            //3 months:
            selected: 1
        }
    });
    
    var ticker = '^DJI'
    var to = new Date(_now);
    var from = new Date(to);
    from.setMonth(to.getMonth() - 12);
    
    _chart.showLoading();
    
    //Responds with 404 through crossorigin.me. Alternative service:
    //https://www.bountysource.com/issues/39833634-origin-header-is-required
    //  var url = '//crossorigin.me/' + createUrlYahoo(ticker, from, to);
    var url = '//cors-anywhere.herokuapp.com/' + createUrlYahoo(ticker, from, to);
    
    $.get(url, function (data) {
        //document.write('<pre>'+data+'</pre>');
        renderData(ticker, parseYahoo(data));

        _chart.hideLoading();
    });
})
