let data = [];
const url = "https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json";

// 搜尋區
const ticketCardArea = document.querySelector(".ticketCard-area");
const regionSearch = document.querySelector(".regionSearch");
const searchResultText = document.querySelector("#searchResult-text");
const cantFindArea = document.querySelector(".cantFind-area");
// 表單
const addTicketForm = document.querySelector(".addTicket-form");
const ticketName = document.querySelector("#ticketName");
const ticketImgUrl = document.querySelector("#ticketImgUrl");
const ticketRegion = document.querySelector("#ticketRegion");
const ticketPrice = document.querySelector("#ticketPrice");
const ticketNum = document.querySelector("#ticketNum");
const ticketRate = document.querySelector("#ticketRate");
const ticketDescription = document.querySelector("#ticketDescription");
const addTicketBtn = document.querySelector(".addTicket-btn");

// !!! img url 判斷 
ticketImgUrl.addEventListener("blur", function() {
    const url = ticketImgUrl.value.trim();
    if (url === "") return; // 如果沒填就不做檢查

    const testImg = new Image();
    testImg.src = url;

    // 如果圖片載入失敗（死連結或非圖片）
    testImg.onerror = function() {
        alert("警告：此圖片網址無法正常載入，請確認網址是否正確！");
        ticketImgUrl.value = ""; // 清空錯誤的網址，或讓使用者重新輸入
        ticketImgUrl.focus();    // 把游標重新聚焦回圖片輸入框
    };
});

addTicketBtn.addEventListener("click", function(e){
    e.preventDefault();
    if (
        ticketName.value.trim() === "" ||
        ticketImgUrl.value.trim() === "" ||
        ticketRegion.value === "" ||
        ticketPrice.value === "" ||
        ticketNum.value === "" ||
        ticketRate.value === "" ||
        ticketDescription.value.trim() === ""
    ) {
        alert("請填寫所有欄位！"); 
        return; 
    }

    if (ticketPrice.value <= 0 || ticketNum.value <= 0) {
        alert("套票金額與組數任一個必須大於 0！");
        return;
    }

    if (ticketRate.value < 1 || ticketRate.value > 10) {
        alert("星級評分必須介於 1 到 10 之間！");
        return;
    }

    const obj = {
        "id": data.length,
        "name": ticketName.value.trim(),
        "imgUrl": ticketImgUrl.value.trim(),
        "area": ticketRegion.value,
        "description": ticketDescription.value.trim(),
        "group": Number(ticketNum.value),
        "price": Number(ticketPrice.value),
        "rate": Number(ticketRate.value)
    };
    data.push(obj);
    regionSearch.value = "";
    handleRender(data)
    addTicketForm.reset();
});


regionSearch.addEventListener("change", function (e) {
    if (regionSearch.value === "") { 
        renderData(data);
        return;
    } 
    let filterData = data.filter(ticket => ticket.area === regionSearch.value);
    renderData(filterData);
});
// ------------------------------------------------------------------------------------
// 渲染函式
function handleRender(data){
    renderData(data);
    renderChart(data);
}


// 渲染圖表
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
        size:{
            width: 200,
            height: 200
        },
        data: {
            columns: newData,
            type: 'donut',
            colors: {
                高雄: "#E68618",
                台中: "#5151D3",
                台北: "#26C0C7"
            }
        },
        donut: {
            title: "套票地區比重",
            width: 10,
            label: {
                show: false
            },
        }
    });
}



// ------------------------------------------------------------------------------------

// 渲染資料 
function renderData(tickets) {
    if (tickets.length === 0) {
        ticketCardArea.innerHTML = ""; 
        cantFindArea.style.display = "block"; 
        searchResultText.textContent = `本次搜尋共 0 筆資料`;
        return;
    }

    cantFindArea.style.display = "none";
    let str = "";
    tickets.forEach(function (ticket) {
        str += `<li class="ticketCard">
                    <div class="ticketCard-img">
                        <a href="#"><img src="${ticket.imgUrl}"alt="${ticket.name}"></a>
                        <div class="ticketCard-region">${ticket.area}</div>
                        <div class="ticketCard-rank">${ticket.rate}</div>
                    </div>
                    <div class="ticketCard-content">
                        <div>
                            <h3><a href="#" class="ticketCard-name">${ticket.name}</a></h3>
                            <p class="ticketCard-description">${ticket.description}</p>
                        </div>
                        <div class="ticketCard-info">
                            <p class="ticketCard-num">
                                <span><i class="fas fa-exclamation-circle"></i></span>
                                剩下最後 <span id="ticketCard-num"> ${ticket.group} </span> 組
                            </p>
                            <p class="ticketCard-price">
                                TWD <span id="ticketCard-price">$${ticket.price}</span>
                            </p>
                        </div>
                    </div>
                </li>`
    })

    ticketCardArea.innerHTML = str;
    searchResultText.textContent = `本次搜尋共 ${tickets.length} 筆資料`;
};


// 取得
// function getData() {
//     axios.get(url)
//     .then(function(response){
//         console.log(response);
//         data = response.data.data;
//         renderData(data);
//     })
//     .catch(function(error){
//         console.log("發生錯誤");
//     })
// };


// async await 方法
async function getData() {
    try{
        const response = await axios.get(url);
        data = response.data.data;
        handleRender(data)
    }catch{
        console.log("發生錯誤");
    }
}


getData();

