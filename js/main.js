$(function(){
    var trove_api_key = "pkncug5mova6jr0i";
    var trove_api_url = "http://api.trove.nla.gov.au/result?zone=newspaper";
    var trove_page_img = "http://trove.nla.gov.au/ndp/imageservice/nla.news-page";
    var start_year = 1803;
    var end_year = 1954;
    var range_year = end_year - start_year;
    var initial_year, current_year;
    var keywords = "";
    var cells = 25;
    var current_cell = 1;
    var colours = {"front": "#C7B6A3", "back": "#C7AB8D"};
    var totals = {"1803": "391", "1804": "462", "1805": "303", "1806": "243", "1807": "75", "1808": "92", "1809": "128", "1810": "160", "1811": "109", "1812": "92", "1813": "120", "1814": "94", "1815": "116", "1816": "478", "1817": "773", "1818": "943", "1819": "841", "1820": "959", "1821": "635", "1822": "611", "1823": "573", "1824": "1184", "1825": "2574", "1826": "3874", "1827": "4148", "1828": "3389", "1829": "5203", "1830": "4615", "1831": "5199", "1832": "6383", "1833": "6561", "1834": "7708", "1835": "9682", "1836": "10682", "1837": "11164", "1838": "12624", "1839": "14657", "1840": "18620", "1841": "20112", "1842": "21073", "1843": "23383", "1844": "25964", "1845": "29994", "1846": "29226", "1847": "32322", "1848": "30106", "1849": "28450", "1850": "33759", "1851": "44565", "1852": "39398", "1853": "41184", "1854": "52074", "1855": "69794", "1856": "77088", "1857": "74774", "1858": "79165", "1859": "89275", "1860": "97419", "1861": "105068", "1862": "105520", "1863": "108896", "1864": "110965", "1865": "99477", "1866": "102063", "1867": "113819", "1868": "111991", "1869": "115701", "1870": "126182", "1871": "114341", "1872": "119143", "1873": "123135", "1874": "133795", "1875": "131351", "1876": "138725", "1877": "150399", "1878": "170230", "1879": "173048", "1880": "174094", "1881": "175781", "1882": "211481", "1883": "223544", "1884": "238741", "1885": "245984", "1886": "270633", "1887": "290821", "1888": "293455", "1889": "333733", "1890": "367143", "1891": "392326", "1892": "414533", "1893": "424846", "1894": "412223", "1895": "441061", "1896": "478761", "1897": "519980", "1898": "559615", "1899": "590851", "1900": "671320", "1901": "671950", "1902": "661261", "1903": "700359", "1904": "716326", "1905": "770938", "1906": "767674", "1907": "787850", "1908": "841692", "1909": "806447", "1910": "888258", "1911": "869332", "1912": "927175", "1913": "875316", "1914": "1130445", "1915": "1169878", "1916": "1072213", "1917": "989323", "1918": "980202", "1919": "773444", "1920": "675804", "1921": "670272", "1922": "714634", "1923": "857058", "1924": "935920", "1925": "921818", "1926": "895862", "1927": "914096", "1928": "1025688", "1929": "1052548", "1930": "1010340", "1931": "931540", "1932": "944070", "1933": "971127", "1934": "1025408", "1935": "1014858", "1936": "1059385", "1937": "1091171", "1938": "1051634", "1939": "970539", "1940": "815343", "1941": "765951", "1942": "633186", "1943": "522380", "1944": "562814", "1945": "630736", "1946": "690715", "1947": "717173", "1948": "652053", "1949": "735208", "1950": "736715", "1951": "635505", "1952": "653635", "1953": "670775", "1954": "667765"};
    function get_content(cell_id, face) {
        return $("." + face, $("#" + cell_id + "-content")).html();
    }
    function get_random_year() {
        var range = (end_year - start_year) + 1;
        var year = start_year + Math.floor(Math.random() * range);
        return year;
    }
    function prepare_cell() {
        $(".magic", $('*[data-value="' + current_cell + '"]')).hide("fade", function() {
            $('*[data-value="' + current_cell + '"]').empty().html('<p class="status">making...</p>');
            get_article();
        });
    }
    function get_article() {
        if ( current_cell <= cells ) {
            //var value = $("#cell" + current_cell).data('value');
            var query;
            current_year = start_year + (((initial_year + (current_cell - 1)) - start_year) % range_year);
            if (keywords === "") {
                var total = totals[current_year];
                var number = Math.floor(Math.random() * total);
                query = make_query(number);
                get_api_result(query, 'article');
            } else {
                query = trove_api_url + "&q=" + keywords + "date:[" + current_year + " TO " + current_year + "]&n=0&l-category=Article&encoding=json&key=" + trove_api_key;
                get_api_result(query, 'total');
            }
        }
    }
    function get_api_result(query, type) {
        $.ajax({
            "dataType": "jsonp",
            "url": query,
            "success": function(results) {
                process_results(results, type);
            },
            error: function(xmlReq, txtStatus, errThrown){
                $('#status').text(xmlReq.responseText);
            }
        });
    }
    function make_query(number) {
        return trove_api_url + "&q=" + keywords + "date:[" + current_year + " TO " + current_year + "]&s=" + number + "&n=1&l-category=Article&encoding=json&reclevel=full&key=" + trove_api_key;
    }
    function process_results(results, type) {
        var article;
        if (type == 'total') {
            var total = results.response.zone[0].records.total;
            var number = Math.floor(Math.random() * total);
            var query = make_query(number);
            get_api_result(query, 'article');
        } else if (type == 'article') {
            if (results.response.zone[0].records.total > 0) {
                article = results.response.zone[0].records.article[0];
            } else {
                article = null;
            }
            display_article(article);
        }
    }
    function display_article(article) {
        var $cell = $('<div id="cell' + current_cell + '-content" ></div>');
        if (article) {
            var page_id, heading;
            var article_id = article.id;
            var date = $.format.date(article.date + ' 00:00:00.000', 'd MMMM yyyy');
            if (article.heading.length > 50) {
                heading = article.heading.substring(0, 50) + "...";
            } else {
                heading = article.heading;
            }
            if (article.title.value.indexOf('(')) {
                newspaper = article.title.value.substr(0, article.title.value.indexOf('(') - 1);
            } else {
                newspaper = article.title.value;
            }
            if (article.trovePageUrl) {
                var page_url = article.trovePageUrl;
                page_id = page_url.match(/(\d+)$/)[1];
            } else {
                page_id = null;
            }
            $front_content = $('<div class="front"></div>');
            $front_content.append('<div class="year">' + current_year + '</div>');
            if (page_id) {
                $front_content.append('<img height="140px" src="' + trove_page_img + page_id + '/thumb"></div>');
            }
            $cell.append($front_content);
            $back_content = $('<div class="back"></div>');
            $back_content.append("<p>" + heading + "</p>");
            $back_content.append("<p><em>" + newspaper + "</em><br> " + date + "</p>");
            $back_content.append('<p><a target="_blank" href="' + article.troveUrl + '">View article</a></p>');
            $cell.append($back_content);
            $("#cell-contents").append($cell);
            $('*[data-value="' + current_cell + '"]').html($(".front", $cell).html()).hide().show("fade");
        } else {
            $cell.append('<div class="front"><div class="year">' + current_year + '</div></div>');
        }
        $("#cell" + current_cell).hideLoading();
        current_cell += 1;
        prepare_cell();
    }
    function year_choices() {
        var year = start_year;
        for (year; year <= end_year; year++) {
            $("#start_year").append('<option value="' + year + '">' + year + '</option');
        }
    }
    function show_numbers() {
        $(".cell").each(function() {
            $(this).append('<span class="magic">' + $(this).data('value') + '</span>');
        });
    }
    //$(".cell").each( function() {
    //    var content = get_content($(this).attr('id'), $(this).data('face'));
    //    $(this).html(content);
    //});
    $(".cell").click(function() {
        var face = $(this).data('face');
        face = (face == "front") ? "back" : "front";
        $(this).data("face", face);
        var content = get_content($(this).attr('id'), face);
        var $self = $(this);
        $(this).flippy({
            direction: "LEFT",
            content: content,
            color_target: colours[face],
            onFinish: function() {
                if (face=="back") {
                    $("#magic_total").data('value', $("#magic_total").data('value') + $self.data('value'));
                } else {
                    $("#magic_total").data('value', $("#magic_total").data('value') - $self.data('value'));
                }
                $("#magic_total").html('Total: ' + $("#magic_total").data('value'));
            }
        });
    });
    $("#go").button().click(function(event) {
        event.preventDefault();
        $(".cell").empty();
        show_numbers();
        $("#cell-contents").empty();
        current_cell = 1;
        if ($("#start_year").val() != "0") {
            initial_year = parseInt($("#start_year").val(), 10);
        } else {
            initial_year = get_random_year();
        }

        if ($("#keywords").val() !== "") {
            keywords = $("#keywords").val().replace(" ", "+") + "+";
        } else {
            keywords = "";
        }
        prepare_cell();
    });
    year_choices();
    show_numbers();

});
