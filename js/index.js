// html公共部分
$(document).ready(function () {
    $("header").load("component/header.html");
    $(".column2").load("component/right.html");
    $("footer").load("component/footer.html");
})
let imgs = document.querySelectorAll(".article .swiper-wrapper img");
// 轮播缩略图
let swiper1 = new Swiper("#swiper", {
    direction: "horizontal",
    autoplay: {
        delay: 3500
    },
    loop: true,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
        renderBullet: (i, c) => `<span class="${c}"><img src="${imgs[i].src}"></span>`
    }
})
// 请求picNews数据
let url = "data/picNews1.json"
let getPicNews = (url) => {
    $.ajax({
        url: url,
        success: (res) => {
            renderPicNews(res);
        }
    })
}
getPicNews(url);
// 渲染picNews数据
function renderPicNews(data) {
    let str = "";
    data.forEach(el => {
        str += `<li><a href="javascript:;"><img src="${el.img}" alt=""></a><h3 class="title">${el.title}</h3><div class="thumb"><i class="iconfont icon-shizhongclock77"></i><span>${el.time}</span><i class="iconfont icon-yanjing"></i><span>${el.view}</span></div></li>`
    });
    $(".picNews").html(str);
    // 加载失败的图片显示默认图片
    $(".picNews img").error(function () {
        $(this).attr("src", "img/default.png")
    })
}
// 获取picNews距离浏览器顶部的高度
let newsT = $(".picNews").offset().top + 200;
let lens = $(".page li").length - 1;
let idx = 1;
$(".page li").eq(idx).addClass("current").siblings().removeClass("current");
// 获取分页器，使用事件传播
function pageClick(e) {
    if ($(e.target).index() == 0) {
        if (idx > 1) {
            idx -= 1;
        } else {
            return
        }
    } else if ($(e.target).index() == lens) {
        if (idx < lens - 1) {
            idx += 1;
        } else {
            return
        }
    } else {
        idx = $(e.target).index();
    }
    getPicNews(`data/picNews${idx}.json`);
    $(".page li").eq(idx).addClass("current").siblings().removeClass("current");
    $(document).scrollTop(newsT);
}
$(".page").click(debounce((e) => pageClick(e), 300))

function debounce(fn, wait) {
    let timer = null,
        result;
    return function (...params) {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            result = fn.call(this, ...params);
        }, wait)
        return result;
    }
}