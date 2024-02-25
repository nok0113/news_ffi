const API_KEY='9d48dfe9ca6d40ae8e444820b2ce9e7f'; 
let newsList = []; 
let menus = document.querySelectorAll(".menus button"); 
//getElementById는 하나 부를때 querySelectorAll 여러개 부를때

menus.forEach((menu) => 
menu.addEventListener("click", (event) => getNewsByCategory(event)) 
); 
let url = new URL('https://genuine-llama-77c90b.netlify.app/top-headlines?country=kr&apiKey=${API_KEY}') //전역변수 
let totalResults = 0; 
let page = 1; 
const pageSize = 10; 
const groupSize = 5; 



const getNews =async()=>{ 
    try{ 
        url.searchParams.set("page",page); // &page=page 
        url.searchParams.set("pageSize",pageSize);         
        const response = await fetch(url); 

        const data = await response.json(); 
        if(response.status===200){ 
            if(data.articles.length===0){ 
                throw new Error("No result for search"); 
            } 
            newsList = data.articles; 
            totalResults = data.totalResults; 
            render(); 
            paginationRender(); 
        }else{ 
            throw new Error(data.message); 
        }
    
    }catch(error){ 
        errorRender(error.message) 
    } 

}; 

const getLatestNews = async() => { 
    url = new URL( `https://genuine-llama-77c90b.netlify.app/top-headlines?country=kr&apiKey=${API_KEY}` ); 
    //내꺼 new URL(`https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`); 
    //누나꺼 new URL(`https://genuine-llama-77c90b.netlify.app/top-headlines?country=kr&apiKey=${API_KEY}`); 
    
    getNews();
}; 

const getNewsByKeyword = async() =>{ 
    const keyword = document.getElementById("search-input").value; 
    
    url = new URL( 
      //`https://newsapi.org/v2/top-headlines?country=kr&q=${keyword}&apiKey=${API_KEY}` 
    `https://genuine-llama-77c90b.netlify.app/top-headlines?country=kr&q=${keyword}&apiKey=${API_KEY}` 
    ); 
    
    getNews(); 
}; 

const getNewsByCategory = async (event) => { 
    const category = event.target.textContent.toLowerCase(); //toLowerCase 소문자로 바꿔주는 함수. 테스트에서 console에 대문자로 뜨는게 불편해서 바꿔줌 
    
    url = new URL(`https://genuine-llama-77c90b.netlify.app/top-headlines?country=kr&category=${category}&apiKey=${API_KEY}`); //api키는 보통 뒤에 붙인다 
    // https://newsapi.org/v2/top-headlines?country=kr&category=${category}&apiKey=${API_KEY} 
    
    getNews(); 
}; 

const openSearchBox = () => { 
    let inputArea = document.getElementById("input-area"); 
    if (inputArea.style.display === "inline") { 
        inputArea.style.display = "none"; 
    } else { 
        inputArea.style.display = "inline"; 
    } 
}; 
const render=()=>{
const newsHTML = newsList.map(news=>` <div class="row news">
<div class="col-lg-4">
<img class="news-img-size" src="${news.urlToImage}"/>
</div>
<div class="col-lg-8">
    <h2>${news.title}</h2>
    <p>
        ${news.description}
    </p>
    <div>
        ${news.source.name} * ${news.publishedAt}
    </div>
</div>
</div>`
).join(''); //행렬을 스트링타입으로 바꿔줌 map의 친구
document.getElementById("news-board").innerHTML=newsHTML
};


    const paginationRender=()=>{ 

        let paginationHTML = ``;
        //totalPages 
        let totalPages = Math.ceil(totalResults/pageSize); 

        //pageGroup 
        let pageGroup = Math.ceil(page/groupSize);

        //lastPage 
        let lastPage = pageGroup * groupSize; // 마지막 페이지 그룹이 그룹사이즈보다 작을 경우 
       // lastpage = totalPages;
        
        if(lastPage > totalPages){ 
            lastPage = totalPages; 
        } 

        
    let first = lastPage - 4 <= 0 ? 1 : lastPage - 4;
    if (first >= 6) {
        paginationHTML = `<li class="page-item" onclick="pageClick(1)">
                            <a class="page-link" href='#js-bottom'>&lt;&lt;</a>
                        </li>
                        <li class="page-item" onclick="pageClick(${page - 1})">
                            <a class="page-link" href='#js-bottom'>&lt;</a>
                        </li>`;
    }
    for (let i = first; i <= lastPage; i++) {
        paginationHTML += `<li class="page-item ${i == page ? "active" : ""}" >
                            <a class="page-link" href='#js-bottom' onclick="pageClick(${i})" >${i}</a>
                            </li>`;
    }
    
    if (lastPage < totalPages) {
        paginationHTML += `<li class="page-item" onclick="pageClick(${page + 1})">
                            <a  class="page-link" href='#js-program-detail-bottom'>&gt;</a>
                            </li>
                            <li class="page-item" onclick="pageClick(${totalPages})">
                            <a class="page-link" href='#js-bottom'>&gt;&gt;</a>
                            </li>`;
    }
    
    document.querySelector(".pagination").innerHTML = paginationHTML;
    };
    
    //const moveToPage = (pageNum) =>{ 
     //   console.log("moveToPage", pageNum); 
      //  page = pageNum; 
    
      //  getNews(); 
      //  }; 
        
    const pageClick = (pageNum) => {
    page = pageNum;
    window.scrollTo({ top: 0, behavior: "smooth" });
    getNews();
    };
    
const errorRender = (errorMessage)=>{
    const errorHTML = `<div class="alert alert-danger" role="alert">
    ${errorMessage}
    </div>`;
    document.getElementById("news-board").innerHTML=errorHTML
    };

    const openNav = () => { 
        document.getElementById("mySidenav").style.width = "250px"; 
    }; 
    
    const closeNav = () => { 
        document.getElementById("mySidenav").style.width = "0"; 
    }; 

   
    getLatestNews();