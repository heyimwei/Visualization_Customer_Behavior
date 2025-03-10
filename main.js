//Bar 
let barLeft = 0, barTop = 0;
let barTotalWidth = 1000, barTotalHeight = 400;
let barMargin = { top: 10, right: 210, bottom: 60, left: 10 },
    barWidth = barTotalWidth - barMargin.left - barMargin.right,
    barHeight = barTotalHeight - barMargin.top - barMargin.bottom;

//Pie 
let pieLeft = 1000, pieTop = 0;
let pieTotalWidth = 600, pieTotalHeight = 400;
let pieMargin = { top: 10, right: 10, bottom: 60, left: 10 },
    pieWidth = pieTotalWidth - pieMargin.left - pieMargin.right,
    pieHeight = pieTotalHeight - pieMargin.top - pieMargin.bottom;

//Heat  
let heatLeft = 0, heatTop = 400;
let heatTotalWidth = 800, heatTotalHeight = 800;
let heatMargin = { top: 50, right: 150, bottom: 100, left: 50 },
    heatWidth = heatTotalWidth - heatMargin.left - heatMargin.right,
    heatHeight = heatTotalHeight - heatMargin.top - heatMargin.bottom;

//Line  
let lineLeft = 800, lineTop = 400;
let lineTotalWidth = 800, lineTotalHeight = 800;
let lineMargin = { top: 50, right: 10, bottom: 60, left: 80 },
    lineWidth = lineTotalWidth - lineMargin.left - lineMargin.right,
    lineHeight = lineTotalHeight - lineMargin.top - lineMargin.bottom;

//創建畫布並且分配位置
const svg = d3.select("#chart-area").append("svg")
    .attr("width", 2000)
    .attr("height", 2000)
const barchart_g = svg.append("g")
    .attr("transform", `translate(${barLeft + barMargin.left}, ${barTop + barMargin.top})`)
const piechart_g = svg.append("g")
    .attr("transform", `translate(${pieLeft + pieMargin.left}, ${pieTop + pieMargin.top})`)
const heatmap_g = svg.append("g")
    .attr("transform", `translate(${heatLeft + heatMargin.left}, ${heatTop + heatMargin.top})`)
const linechart_g = svg.append("g")
    .attr("transform", `translate(${lineLeft + lineMargin.left}, ${lineTop + lineMargin.top})`)


//global data
var g_data;
var itemName = {
    'Blouse': 0, 'Sweater': 1, 'Jeans': 2, 'Sandals': 3, 'Sneakers': 4,
    'Shirt': 5, 'Shorts': 6, 'Coat': 7, 'Handbag': 8, 'Shoes': 9,
    'Dress': 10, 'Skirt': 11, 'Sunglasses': 12, 'Pants': 13, 'Jacket': 14,
    'Hoodie': 15, 'Jewelry': 16, 'T-shirt': 17, 'Scarf': 18, 'Hat': 19,
    'Socks': 20, 'Backpack': 21, 'Belt': 22, 'Boots': 23, 'Gloves': 24,
};
var malefemale = 0;



//filtered data variables
let if_brushed = 0;
let brush_left, brush_right = 0;
let if_click = 0;
let OnClickLabel = -1;
let update = 0;


//read dataset
parseData();


function parseData(data) {
    d3.csv("preprocessed_shopping_trends.csv").then(function (data) {
        data.forEach((d, i) => {
            d.Age = Number(d.Age);
        });
        console.log(data);


        g_data = data;

        Initialization(data);

    }).catch(function (error) {
        console.log(error);
    });
}


//function for filtering updated data
function UpDateData() {
    d3.csv("preprocessed_shopping_trends.csv").then(function (data) {
        //initial

        data.forEach((d, i) => {
            d.Age = Number(d.Age);
        });

        let filterData;
        filterData = data;

        console.log(filterData);

        //stacked histogram

        if (if_brushed == 1) {
            const Bx = d3.scaleLinear()
                .domain([15, 75])
                .range([0, barTotalWidth - barMargin.left - barMargin.right - 40])

            filterData = filterData.filter(function (d) {
                return (
                    Bx(d.Age) >= brush_left &&
                    Bx(d.Age) <= brush_right
                );
            });
            console.log("After brushing", filterData.length);
        }

        //pie chart

        if (if_click == 1) {
            filterData = filterData.filter(function (d) {
                switch (OnClickLabel) {
                    case "Clothing":
                        return (d.Category == "Clothing");
                    case "Footwear":
                        return (d.Category == "Footwear");
                    case "Outerwear":
                        return (d.Category == "Outerwear");
                    case "Accessories":
                        return (d.Category == "Accessories");
                }
            });
            console.log("After clicking", filterData.length);
        }

        update = 1;

        Initialization(filterData);

    }).catch(function (error) {
        console.log(error);
    });
}


//function for calculating data
function Initialization(data) {

    //stacked histogram data

    var arrAge = d3.range(101).map((_, index) => ({
        age: index,
        num: 0,
        male: 0,
        female: 0,
    }));

    var arrAgeO = d3.range(101).map((_, index) => ({
        age: index,
        num: 0,
        male: 0,
        female: 0,
    }));

    data.forEach((d) => {
        arrAge[d.Age].num += 1;
        if (d.Gender === "Male") {
            arrAge[d.Age].male += 1;
        }
        else if (d.Gender === "Female") {
            arrAge[d.Age].female += 1;
        }
    })

    g_data.forEach((d) => {
        arrAgeO[d.Age].num += 1;
        if (d.Gender === "Male") {
            arrAgeO[d.Age].male += 1;
        }
        else if (d.Gender === "Female") {
            arrAgeO[d.Age].female += 1;
        }
    })

    //pie chart data

    // 計算每個類別的總數
    let categoryCounts = d3.nest()
        .key(function (d) { return d.Category; })
        .rollup(function (v) { return v.length; })
        .entries(data);

    console.log(categoryCounts);

    // 圓餅圖的布局設置
    let radius = Math.min(pieWidth, pieHeight) * 0.9 / 2;
    let pie = d3.pie().value(function (d) { return d.value; });
    let arc = d3.arc().innerRadius(0).outerRadius(radius);

    // 計算g_
    let g_categoryCounts = d3.nest()
        .key(function (d) { return d.Category; })
        .rollup(function (v) { return v.length; })
        .entries(g_data);

    console.log(g_categoryCounts);


    //heatmap data

    // 提取 "Payment_Method" 和 "Shipping_Type" 屬性的值
    var paymentMethods = data.map(function (d) { return d.Payment_Method; });
    var shippingTypes = data.map(function (d) { return d.Shipping_Type; });

    // 創建一個包含所有唯一的 "Payment_Method" 和 "Shipping_Type" 的陣列
    var uniquePaymentMethods = Array.from(new Set(paymentMethods));
    var uniqueShippingTypes = Array.from(new Set(shippingTypes));

    console.log(uniquePaymentMethods);
    console.log(uniqueShippingTypes);

    // 創建一個二維數組以保存結果
    var heatmapData = new Array(uniquePaymentMethods.length);

    for (var i = 0; i < uniquePaymentMethods.length; i++) {
        heatmapData[i] = new Array(uniqueShippingTypes.length).fill(0);
    }

    // 遍歷原始數據，填充熱圖數據
    data.forEach(function (d) {
        var rowIndex = uniquePaymentMethods.indexOf(d.Payment_Method);
        var colIndex = uniqueShippingTypes.indexOf(d.Shipping_Type);
        heatmapData[rowIndex][colIndex]++;
    });

    console.log(heatmapData);


    //line chart data

    let itemN = [
        'Blouse', 'Sweater', 'Jeans', 'Sandals', 'Sneakers',
        'Shirt', 'Shorts', 'Coat', 'Handbag', 'Shoes',
        'Dress', 'Skirt', 'Sunglasses', 'Pants', 'Jacket',
        'Hoodie', 'Jewelry', 'T-shirt', 'Scarf', 'Hat',
        'Socks', 'Backpack', 'Belt', 'Boots', 'Gloves',
    ]

    let itemCounts = d3.nest()
        .key(d => d.Item_Purchased)
        .rollup(v => v.length)
        .entries(data)

    console.log("it", itemCounts)

    var itemArr = new Array(25).fill(0);

    for (let i = 0; i < itemCounts.length; i++) {
        itemArr[itemName[itemCounts[i].key]] = itemCounts[i].value;
    }

    console.log(itemArr)

    var itemSeasons = []
    for (let i = 0; i < itemArr.length; i++) {
        var per = [
            { season: 'Spring', count: 0, item: itemN[i] },
            { season: 'Summer', count: 0, item: itemN[i] },
            { season: 'Fall', count: 0, item: itemN[i] },
            { season: 'Winter', count: 0, item: itemN[i] },
        ]

        if (itemArr[i] != 0) {
            itemSeasons.push(per);
        }

    }

    data.forEach(d => {
        for (let i = 0; i < itemSeasons.length; i++) {
            if (d.Item_Purchased === itemSeasons[i][0].item) {
                for (let j = 0; j < 4; j++) {
                    if (d.Season === itemSeasons[i][j].season) {
                        itemSeasons[i][j].count++;
                        break;
                    }
                }
                break;
            }
        }
    });

    console.log(itemSeasons)


    //draw charts
    if (update == 0) {
        drawHistogram(arrAge, arrAgeO);
        drawPiechart(categoryCounts, pie, arc);
        drawHeatmap(heatmapData, uniquePaymentMethods, uniqueShippingTypes);
        drawLinechart(itemCounts, itemSeasons);
    } else if (if_click == 0) { //if_click == 0 才更新piechart_g
        barchart_g.selectAll("*").remove();
        heatmap_g.selectAll("*").remove();
        piechart_g.selectAll("*").remove();
        linechart_g.selectAll("*").remove();
        drawHistogram(arrAge, arrAgeO);
        drawPiechart(categoryCounts, pie, arc, g_categoryCounts);
        drawHeatmap(heatmapData, uniquePaymentMethods, uniqueShippingTypes);
        drawLinechart(itemCounts, itemSeasons);
    } else {  //if_click == 1 不更新piechart_g
        barchart_g.selectAll("*").remove();
        heatmap_g.selectAll("*").remove();
        linechart_g.selectAll("*").remove();
        drawHistogram(arrAge, arrAgeO);
        drawHeatmap(heatmapData, uniquePaymentMethods, uniqueShippingTypes);
        drawLinechart(itemCounts, itemSeasons);
    }

}





function drawHistogram(arrAge, arrAgeO) {

    var Bg = barchart_g.append('g')
        .attr('transform', `translate(${50}, ${30})`)

    //stacked histogram name
    barchart_g.append('text')
        .attr('x', barTotalWidth / 2 - 100)
        .attr('y', 15)
        .attr('font-size', '20px')
        .attr('text-anchor', 'middle')
        .text('Age Distribution')
        .style("font-weight", "bold")

    //stacked histogram X label
    barchart_g.append('text')
        .attr('x', (barTotalWidth - 60) / 2 - 80)
        .attr('y', barTotalHeight - 5)
        .attr('font-size', '18px')
        .attr('text-anchor', 'middle')
        .text('Age')

    //stacked histogram Y label
    barchart_g.append('text')
        .attr('x', -(barTotalHeight - 60) / 2)
        .attr('y', 20)
        .attr('font-size', '18px')
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .text('Count')

    //stacked histogram X ticks
    const Bx = d3.scaleLinear()
        .domain([15, 75])
        .range([0, barTotalWidth - barMargin.left - barMargin.right - 40])

    const BxAxisCall = d3.axisBottom(Bx)
    Bg.append('g')
        .attr("transform", `translate(0, ${barTotalHeight - barMargin.top - barMargin.bottom})`)
        .call(BxAxisCall)

    //find Y axis maximum
    let max = 0;
    for (let i = 0; i < arrAgeO.length; i++) {
        if (arrAgeO[i].num > max) {
            max = arrAgeO[i].num;
        }
    }

    //stacked histogram Y ticks
    const By = d3.scaleLinear()
        .domain([0, max])
        .range([barTotalHeight - barMargin.top - barMargin.bottom, 0])

    const ByAxisCall = d3.axisLeft(By)

    Bg.append('g').call(ByAxisCall)

    //group of the bars
    const Brectsg = Bg.selectAll('rect').data(arrAgeO)

    //draw bars (total)
    var rectsT = Brectsg
        .enter().append('rect')
        .attr('y', (d) => {
            return By(d.num);
        })
        .attr('x', (d, i) => {
            return Bx(i) - 6;
        })
        .attr('width', 12)
        .attr('height', (d) => {
            return barTotalHeight - barMargin.top - barMargin.bottom - By(d.num);
        })
        .attr('fill', 'white')
        .attr('stroke', 'black')

    //draw bars (male)
    var rectsM = Brectsg
        .enter().append('rect')
        .attr('y', (d) => {
            if (malefemale === 0) {
                return By(d.male);
            }
            else if (malefemale === 1) {
                return By(d.num);
            }
        })
        .attr('x', (d, i) => {
            return Bx(i) - 6;
        })
        .attr('width', 12)
        .attr('height', (d) => {
            return barTotalHeight - barMargin.top - barMargin.bottom - By(d.male);
        })
        .attr('fill', d3.rgb(86, 130, 176))
        .attr('stroke', 'black')

    //draw bars (female)
    var rectsF = Brectsg
        .enter().append('rect')
        .attr('y', (d) => {
            if (malefemale === 0) {
                return By(d.num);
            }
            else if (malefemale === 1) {
                return By(d.female);
            }
        })
        .attr('x', (d, i) => {
            return Bx(i) - 6;
        })
        .attr('width', 12)
        .attr('height', (d) => {
            return barTotalHeight - barMargin.top - barMargin.bottom - By(d.female);
        })
        .attr('fill', 'pink')
        .attr('stroke', 'black')

    //stacked histogram legend
    Blegend = [{ gender: "Male", color: d3.rgb(86, 130, 176) },
    { gender: "Female", color: "pink" }];

    var Bl = barchart_g.append('g')
        .attr('transform', `translate(${barTotalWidth - 150} , 30)`)

    var Blegendrects = Bl.selectAll("rect")
        .data(Blegend)
        .enter()
        .append('rect')
        .attr('x', 0)
        .attr('y', (d, i) => i * 20)
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', (d) => d.color)
        .attr('stroke', 'black')

    Bl.selectAll('text')
        .data(Blegend)
        .enter()
        .append('text')
        .attr('x', 20)
        .attr('y', (d, i) => i * 20 + 12)
        .attr('font-size', '16px')
        .text(d => d.gender)

    Blegendrects.on('click', blegendclick)

    function blegendclick(d) {
        console.log('clicked ' + d.gender)

        if (d.gender === 'Male') {
            console.log('apple')
            malefemale = 0;
        }
        else if (d.gender === 'Female') {
            console.log('banana')
            malefemale = 1;
        }

        UpDateData()
    }

    //add brush
    var brush = d3.brushX()
        .extent([[0, 0], [barWidth, barHeight]])
        .on("end", brushed);


    function brushed() {
        var extent = d3.event.selection;
        console.log(extent);

        if (extent) {
            // 如果有 brush
            if_brushed = 1;
            brush_left = extent[0];
            brush_right = extent[1];

            UpDateData();
        } else {
            // 如果没有 brush
            if_brushed = 0;

            UpDateData();
        }
    }

    if (update == 1) {
        rectsM.attr('fill', 'white')
            .attr('stroke', 'none')
        rectsF.attr('fill', 'white')
            .attr('stroke', 'none')

        const BrectsgN = Bg.selectAll('rectn').data(arrAge)

        var rectsMn = BrectsgN
            .enter().append('rect')
            .attr('x', (d, i) => (Bx(i) - 6))
            .attr('y', (d) => {
                if (malefemale === 0) {
                    return By(d.male);
                }
                else if (malefemale === 1) {
                    return By(d.num);
                }
            })
            .attr('width', 12)
            .attr('height', 0)
            .transition().duration(1000)
            .attr('height', (d) => {
                return barTotalHeight - barMargin.top - barMargin.bottom - By(d.male);
            })
            .attr('fill', d3.rgb(86, 130, 176))
            .attr('stroke', 'black')

        var rectsFn = BrectsgN
            .enter().append('rect')
            .attr('x', (d, i) => (Bx(i) - 6))
            .attr('y', (d) => {
                if (malefemale === 0) {
                    return By(d.num);
                }
                else if (malefemale === 1) {
                    return By(d.female);
                }
            })
            .attr('width', 12)
            .attr('height', 0)
            .transition().duration(1000)
            .attr('height', (d) => {
                return barTotalHeight - barMargin.top - barMargin.bottom - By(d.female);
            })
            .attr('fill', 'pink')
            .attr('stroke', 'black')
    }

    Bg.call(brush);
}





function drawPiechart(categoryCounts, pie, arc, g_categoryCounts) {

    piechart_g.selectAll("*:not(path,rect,legend)").remove();

    let Pg = piechart_g.append('g')
        .append('g')
        .attr('transform', 'translate(' + pieWidth / 2 * 0.7 + ',' + pieHeight / 2 * 1.2 + ')');

    // 設置圓餅圖標題
    piechart_g.append('text')
        .attr('x', pieTotalWidth / 2)
        .attr('y', 20)
        .attr('font-size', '20px')
        .attr('text-anchor', 'middle')
        .text('Category Proportion')
        .style("font-weight", "bold")

    // 定義類別和它們對應的顏色
    let categoryColorMap = {
        'Clothing': '#1f77b4', // 藍色
        'Footwear': '#ff7f0e', // 橙色
        'Outerwear': '#2ca02c', // 綠色
        'Accessories': '#d62728' // 紅色
    };

    // 繪製圓餅圖
    let paths = Pg.selectAll('path')
        .data(pie(categoryCounts))
        .enter().append('path')
        .attr('d', arc)
        .attr('fill', function (d) {
            return categoryColorMap[d.data.key]; // 使用類別名稱來獲取固定的顏色
        })
        .attr('class', (d, i) => 'pie-piece pie-piece-' + i); // 添加類別以便選擇

    paths.exit().remove();

    // 圖例的尺寸設置
    let legendRectSize = 25;
    let legendSpacing = 5;

    // 創建圖例
    let legend = Pg.selectAll('.legend')
        .data(pie(categoryCounts))
        .enter().append('g')
        .attr('class', 'legend')
        .attr('transform', function (d, i) {
            let height = legendRectSize + legendSpacing;
            let offset = height * categoryCounts.length / 2;
            let horz = -2 * legendRectSize;
            let vert = i * height - offset;
            return 'translate(' + horz + ',' + vert + ')';
        });

    // 圖例的顏色方塊
    let rects = legend.append('rect')
        .attr('class', (d, i) => 'legend-rect legend-rect-' + i) // 添加類別以便選擇
        .attr('x', legendRectSize + legendSpacing + 190)
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', function (d) {
            return categoryColorMap[d.data.key]; // 使用類別名稱來獲取固定的顏色
        })
        .on('click', function (d, i) {
            // 'this' refers to the rect that was clicked
            let isSelected = d3.select(this).classed('selected'); //true when no select, false when one selected

            console.log(isSelected);

            // 移除所有描邊並設定所有扇形為完全不透明
            d3.selectAll('.legend-rect').classed('selected', false).style('stroke', null);
            d3.selectAll('.pie-piece').transition().duration(1000).style('opacity', 1.0);

            // 如果當前元素被選擇，則添加描邊並減少其他扇形的透明度
            if (isSelected == false) {
                let SelectedThis = d3.select(this).classed('selected', true).style('stroke', 'black').style('stroke-width', 3);

                if_click = 1;

                OnClickLabel = SelectedThis._groups[0][0].__data__.data.key;

                // 將未被選取的扇形透明度設定為0.3
                d3.selectAll('.pie-piece').filter((d, j) => i !== j)
                    .transition().duration(1000)
                    .style('opacity', 0.3);

            } else { //isSelected == true
                if_click = 0;
                OnClickLabel = -1;
            }
        });

    rects.on('click', function (d, i) {
        // 'this' refers to the rect that was clicked
        let isSelected = d3.select(this).classed('selected'); //true when no select, false when one selected

        console.log(isSelected);

        // 移除所有描邊並設定所有扇形為完全不透明
        d3.selectAll('.legend-rect').classed('selected', false).style('stroke', null);
        d3.selectAll('.pie-piece').transition().duration(1000).style('opacity', 1.0);

        // 如果當前元素被選擇，則添加描邊並減少其他扇形的透明度
        if (isSelected == false) {
            let SelectedThis = d3.select(this).classed('selected', true).style('stroke', 'black').style('stroke-width', 3);

            if_click = 1;

            OnClickLabel = SelectedThis._groups[0][0].__data__.data.key;

            // 將未被選取的扇形透明度設定為0.3
            d3.selectAll('.pie-piece').filter((d, j) => i !== j)
                .transition().duration(1000)
                .style('opacity', 0.3);

        } else { //isSelected == true
            if_click = 0;
            OnClickLabel = -1;
        }
        console.log(if_click);
        console.log(OnClickLabel);

        UpDateData();
    });


    // 圖例的文字
    legend.append('text')
        .attr('x', legendRectSize + legendSpacing + 220)
        .attr('y', legendRectSize - legendSpacing - 2)
        .text(function (d) { return d.data.key; });

}





function drawHeatmap(heatmapData, uniquePaymentMethods, uniqueShippingTypes) {

    //heatmap name
    heatmap_g.append('text')
        .attr('x', heatTotalWidth / 2)
        .attr('y', 30)
        .attr('font-size', '20px')
        .attr('text-anchor', 'middle')
        .text('PaymentMethod & ShippingType Used Distribution')
        .style("font-weight", "bold");

    //heatmap name
    heatmap_g.append('text')
        .attr('x', heatTotalWidth / 2)
        .attr('y', heatTotalHeight - 40)
        .attr('font-size', '18px')
        .attr('text-anchor', 'middle')
        .text('Shipping Type')

    //heatmap name
    heatmap_g.append('text')
        .attr('x', -heatTotalWidth / 2)
        .attr('y', -10)
        .attr('font-size', '18px')
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .text('Payment Method')

    var colorScale = d3.scaleSequential(d3.interpolateBlues)
        .domain([d3.min(heatmapData, function (row) { return d3.min(row); }), d3.max(heatmapData, function (row) { return d3.max(row); })]);

    var Length = colorScale.ticks(10).length

    var rows = heatmap_g.selectAll("rect")
        .data(heatmapData)
        .enter()
        .append("g")
        .attr('transform', (d, i) => `translate(100,${i * (heatHeight / uniquePaymentMethods.length) + heatMargin.top})`);

    var rects = rows.selectAll(".cell")
        .data(function (d) { return d; })
        .enter()
        .append("rect")
        .attr("class", "cell");

    rects.attr("x", function (d, i) { return i * (heatWidth / uniqueShippingTypes.length); })
        .attr("width", heatWidth / uniqueShippingTypes.length)
        .attr("height", heatHeight / uniquePaymentMethods.length)
        .style("fill", "white")
        .transition().duration(1000)
        .style("fill", function (d) { return colorScale(d); })

    // 添加軸標籤
    heatmap_g.append("g")
        .selectAll("text")
        .data(uniqueShippingTypes)
        .enter()
        .append("text")
        .text(function (d) { return d; })
        .attr("x", function (d, i) { return i * (heatWidth / uniqueShippingTypes.length) + (heatWidth / (2 * uniqueShippingTypes.length)) + 100; })
        .attr("y", heatHeight + 20 + heatMargin.top)
        .attr("text-anchor", "middle");

    heatmap_g.append("g")
        .selectAll("text")
        .data(uniquePaymentMethods)
        .enter()
        .append("text")
        .text(function (d) { return d; })
        .attr("x", 90)
        .attr("text-anchor", "end")
        .attr("y", function (d, i) { return i * (heatHeight / uniquePaymentMethods.length) + (heatHeight / (2 * uniquePaymentMethods.length)) + heatMargin.top; });

    // 創建一個用於顯示顏色代表的值得圖的矩形
    var colorLegend = heatmap_g.append("g")
        .attr("transform", "translate(" + (720) + "," + heatHeight * 0.3 + ")");

    // 定義值得圖的顏色標籤寬度和高度
    var legendWidth = 40;
    var legendHeight = 450;

    // 創建一個SVG <linearGradient> 元素，用於定義漸變
    var gradient = colorLegend.append("defs")
        .append("linearGradient")
        .attr("id", "colorGradient")
        .attr("x1", "0%")
        .attr("y1", "100%")
        .attr("x2", "0%")
        .attr("y2", "0%");


    var p25Value = d3.min(colorScale.domain()) + (d3.max(colorScale.domain()) - d3.min(colorScale.domain())) * 1 / 4;
    var rounded_p25Value = Math.round(p25Value);
    var p50Value = d3.min(colorScale.domain()) + (d3.max(colorScale.domain()) - d3.min(colorScale.domain())) * 2 / 4;
    var rounded_p50Value = Math.round(p50Value);
    var p75Value = d3.min(colorScale.domain()) + (d3.max(colorScale.domain()) - d3.min(colorScale.domain())) * 3 / 4;
    var rounded_p75Value = Math.round(p75Value);

    // 添加漸變色段，使用与熱图相同的颜色比例尺
    gradient.append("stop")
        .attr("offset", "0%")
        .style("stop-color", colorScale(d3.min(colorScale.domain()))); // 最小值的顏色

    gradient.append("stop")
        .attr("offset", "25%") // 根据需要调整百分比位置
        .style("stop-color", colorScale(rounded_p25Value)); // 调整为适当的分位数

    gradient.append("stop")
        .attr("offset", "50%") // 根据需要调整百分比位置
        .style("stop-color", colorScale(rounded_p50Value)); // 调整为适当的分位数

    gradient.append("stop")
        .attr("offset", "75%") // 根据需要调整百分比位置
        .style("stop-color", colorScale(rounded_p75Value)); // 调整为适当的分位数

    gradient.append("stop")
        .attr("offset", "100%")
        .style("stop-color", colorScale(d3.max(colorScale.domain()))); // 最大值的顏色

    // 創建矩形元素來表示顏色條
    colorLegend.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", "url(#colorGradient)"); // 使用漸變填充

    // 添加最小值和最大值標籤
    colorLegend.append("text")
        .text(d3.max(colorScale.domain())) // 最大值
        .attr("x", legendWidth + 5)
        .attr("y", 0);


    colorLegend.append("text")
        .text(rounded_p75Value) // 75
        .attr("x", legendWidth + 5)
        .attr("y", legendHeight * 1 / 4)
        .attr("alignment-baseline", "middle");

    colorLegend.append("text")
        .text(rounded_p50Value) // 中間值
        .attr("x", legendWidth + 5)
        .attr("y", legendHeight * 2 / 4)
        .attr("alignment-baseline", "middle");

    colorLegend.append("text")
        .text(rounded_p25Value) // 25
        .attr("x", legendWidth + 5)
        .attr("y", legendHeight * 3 / 4)
        .attr("alignment-baseline", "middle");

    colorLegend.append("text")
        .text(d3.min(colorScale.domain())) // 最小值
        .attr("x", legendWidth + 5)
        .attr("y", legendHeight);
}





function drawLinechart(itemCounts, itemSeasons) {

    //set tooltip
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .html((d) => ("Item: " + d.item + "  Count: " + d.count));

    var seasons = ['', 'Spring', 'Summer', 'Fall', 'Winter', '']

    //color map
    var Lcolor = d3.scaleSequential().domain([0, 25])
        .interpolator(d3.interpolateTurbo);

    //create chart g
    var Lg = linechart_g.append('g')
        .attr('transform', `translate(${lineMargin.left},${lineMargin.top})`)

    //call tooltip
    Lg.call(tip);

    //line chart name
    linechart_g.append('text')
        .attr('x', lineTotalWidth / 2)
        .attr('y', 15)
        .attr('font-size', '20px')
        .attr('text-anchor', 'middle')
        .text('Item Purchased during Season')
        .style("font-weight", "bold")

    //line chart X label
    linechart_g.append('text')
        .attr('x', lineTotalWidth / 2)
        .attr('y', lineTotalHeight - 25)
        .attr('font-size', '18px')
        .attr('text-anchor', 'middle')
        .text('Season')

    //line chart Y label
    linechart_g.append('text')
        .attr('x', -lineTotalHeight / 2)
        .attr('y', 30)
        .attr('font-size', '16px')
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .text('Count')

    //line chart X ticks
    const space = (lineWidth - 100) / 3
    const Lx = d3.scaleOrdinal()
        .domain(seasons)
        .range([0, 50, 50 + space, 50 + space * 2, lineWidth - 50, lineWidth])

    const LxAxisCall = d3.axisBottom(Lx)
    Lg.append('g')
        .attr('transform', `translate(0,${lineHeight})`)
        .call(LxAxisCall)
        .attr('font-size', '14px')

    //find maximum
    console.log('max', itemSeasons)
    let Lmax = 0, Lmin = 100;
    for (let i = 0; i < itemSeasons.length; i++) {
        if (itemSeasons[i][0].count > Lmax) {
            Lmax = itemSeasons[i][0].count;
        }
        if (itemSeasons[i][1].count > Lmax) {
            Lmax = itemSeasons[i][1].count;
        }
        if (itemSeasons[i][2].count > Lmax) {
            Lmax = itemSeasons[i][2].count;
        }
        if (itemSeasons[i][3].count > Lmax) {
            Lmax = itemSeasons[i][3].count;
        }

        if (itemSeasons[i][0].count < Lmin) {
            Lmin = itemSeasons[i][0].count;
        }
        if (itemSeasons[i][1].count < Lmin) {
            Lmin = itemSeasons[i][1].count;
        }
        if (itemSeasons[i][2].count < Lmin) {
            Lmin = itemSeasons[i][2].count;
        }
        if (itemSeasons[i][3].count < Lmin) {
            Lmin = itemSeasons[i][3].count;
        }
    }
    console.log("max: ", Lmax, ", min: ", Lmin)

    //line chart Y axis
    const Ly = d3.scaleLinear()
        .domain([Lmin, Lmax])    //.domain([d3.min(heatmapData, function (row) { return d3.min(row); }), d3.max(heatmapData, function (row) { return d3.max(row); })])
        .range([lineHeight, 0]);

    const LyAxisCall = d3.axisLeft(Ly)
    Lg.append('g').call(LyAxisCall)

    //draw line chart
    var lineGenerator = d3.line()
        .x((d) => Lx(d.season))
        .y((d) => Ly(d.count))

    Lg.selectAll('.line')
        .data(itemSeasons)
        .enter()
        .append('path')
        .attr('fill', 'none')
        .attr('stroke', (d, i) => Lcolor(itemName[d[0].item]))
        .attr('stroke-width', 2)
        .attr('d', (d) => lineGenerator(d))

    //draw data points
    var Lc = Lg.append('g')
        .selectAll('g')
        .data(itemSeasons)
        .enter()
        .append('g')

    var counting = 0;

    var Lcircles = Lc.selectAll('circle')
        .data((d) => d)
        .enter()
        .append('circle')
        .attr('cx', (d) => Lx(d.season))
        .attr('cy', (d) => Ly(d.count))
        .attr('r', 5)
        .attr('fill', function (d, i) {
            let colorfill = Math.floor(counting / 4)
            counting++;
            // console.log(i + ' , ' + colorfill)
            return Lcolor(itemName[d.item])
        })

    //show tooltip
    Lcircles.on('mouseover', tip.show)
        .on('mouseout', tip.hide)

    //line chart legend
    var Llegend = linechart_g.append('g')
        .attr('transform', `translate(${lineTotalWidth - 0} , 30)`)

    Llegend.selectAll('rect')
        .data(itemSeasons)
        .enter()
        .append('rect')
        .attr('x', 0)
        .attr('y', (d, i) => i * 20)
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', (d, i) => Lcolor(itemName[d[0].item]))
        .attr('stroke', 'black')
        .attr('stroke-width', 1)

    Llegend.selectAll('text')
        .data(itemSeasons)
        .enter()
        .append('text')
        .attr('x', 20)
        .attr('y', (d, i) => i * 20 + 12)
        .attr('font-size', '16px')
        .text((d, i) => d[0].item)

}