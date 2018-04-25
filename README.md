# Gulp 

這個懶人包提供的功能有：

1. 轉換 Pug 為 HTML
2. 轉換 SASS/SCSS 為 CSS
3. 整合所有 CSS 並提供壓縮版
4. 整合 JS 並提供壓縮版
4. 壓縮圖片

## 安裝環境

1. 安裝 gulp到全域
```
npm install gulp -g
```

2. 安裝使用到的套件
```
cd 位置
npm install
```

## 執行

提供三種方法，依照需求使用：

1. 監聽改變(Pug, SASS/SCSS, JS)
```
gulp watch
```

2. 完整編譯(Pug, SASS/SCSS, JS, image)
```
gulp build
```

3. 編譯(Pug, SASS/SCSS, JS)
```
gulp 
```

### P.S：
1. 必須安裝Node.js
2. 請依照提供的資料夾結構使用，想改的話到gulpfile.js檔案裡改，不會改的話，到官網看一下基本操作
3. 完整編譯的差別是會進行圖片壓縮，壓縮時間視情況可能會很久，不需要做網站優化的話，通常也用不到，所以區別開給需要的人用