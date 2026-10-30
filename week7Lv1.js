

const url = "https://raw.githubusercontent.com/hexschool/js-training/main/travelAPI-lv1.json";

function getData() {
    axios.get(url).then((response) => {
        console.log(response.data);
        renderChart(response.data);
    }).catch(function () {
        console.log("發生錯誤");
    })
}

getData();

function renderChart(data) {
    // 篩選地區，並累加數字上去
    // totalObj 會變成 {高雄: 2, 台北: 1, 台中: 2}
    let totalObj = {};
    data.forEach(function (item, index) {
        if (totalObj[item.area] == undefined) {
            totalObj[item.area] = 1;
        } else {
            totalObj[item.area] += 1;
        }
    })


    // newData = [["高雄", 2], ["台北",1], ["台中", 1]]
    let newData = [];
    let area = Object.keys(totalObj);
    // area output ["高雄","台北","台中"]
    area.forEach(function (item, index) {
        let ary = [];
        ary.push(item);
        ary.push(totalObj[item]);
        newData.push(ary);
    })

    // 將 newData 丟入 c3 產生器
    const chart = c3.generate({
        bindto: "#chart",
        data: {
            columns: newData,
            type: 'donut',
        },
        donut: {
            title: "地區"
        }
    });
}





