import requests
import re
from bs4 import BeautifulSoup
import json
import random


url = 'https://news.tsinghua.edu.cn/tsqh/19.htm'
# url = "https://news.tsinghua.edu.cn/tsqh.htm"
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36'}
path = "D:/picwhitenewslist.json"


def get_page():
    session = requests.session()
    res = session.get(url, headers=headers, timeout=2)
    res.encoding = 'utf-8'
    page = res.text
    return page


def rep(strs):
    suffix = "?/|\.><:*"
    for s in suffix:
        if s in strs:
            strs.replace(s, "")
    return strs

# picwhitenewslist
def parse_html(html):
    soup = BeautifulSoup(html, "html.parser")
    all_list = []
    for li in soup.find_all("figure"):
        # 获取图片地址
        img = li.find("img")
        if img:
            img = "https://news.tsinghua.edu.cn/" + img["src"]
        # 获取标题
        title = li.select("a.jiequ")
        if title:
            title = rep(title[0].string)
        else:
            continue
        # 获取创建时间
        time = li.select("i.thunews-clock-o")
        if time:
            time = time[0].next_element
        # 获取阅览人数
        # view = li.select("font>span")
        # if view:
        #     time = view[0].string
        view = random.randint(800,8000)
        all_obj = {
            "img": img,
            "title": title,
            "time": time,
            "view" : view,
        }
        all_list.append(all_obj)
    print(all_list)
    return all_list

html = get_page()
lists = parse_html(html)
with open(path, 'w', encoding='utf-8') as writer:
    json.dump(lists, writer, ensure_ascii=False, indent=2)
