# Visualization of Customer Behavior

使用 D3.js 分析與視覺化不同客群的購物行為，以協助商家做出更有效的數據導向決策。

## 專案簡介
本專案透過一組包含約 3900 位顧客購物資訊的資料集，探討不同年齡層、性別顧客的購買行為模式，並分析購買品項、支付方式、配送方式以及不同季節的熱門商品等。希望藉由互動式視覺化，協助商家快速觀察並做出行銷與庫存管理的調整。

## 功能特色
1. **堆疊直方圖 (Stacked Histogram)**
   - 展示不同年齡區間的購買人數，並可區分男性與女性的購買佔比。支援框選 (Brush) 功能，可縮小篩選範圍。

2. **圓餅圖 (Pie Chart)**
   - 顯示各大類別（如 Clothing、Footwear、Outerwear、Accessories）購買量佔比，並可在圖例上點擊篩選。

3. **熱圖 (Heatmap)**
   - 分析消費者常用的支付方式與配送方式組合。以色彩深淺顯示不同組合的使用次數。

4. **折線圖 (Line Chart)**
   - 觀察各商品在不同季節 (Spring, Summer, Fall, Winter) 的銷售趨勢，了解隨季節變化的熱賣品項。

## 資料來源
- [Kaggle - Customer Shopping Trends Dataset](https://www.kaggle.com/datasets/iamsouravbanerjee/customer-shopping-trends-dataset)
- 檔案說明：
  - `shopping_trends.csv`：原始數據 (上傳至本專案後命名可自行調整)  
  - `preprocessed_shopping_trends.csv`：預處理後資料，包含清理及資料型別轉換等作業

## 專案結構
... ├─ data/ │ ├─ shopping_trends.csv │ ├─ preprocessed_shopping_trends.csv ├─ index.html ├─ main.js ├─ pre_processing.ipynb ├─ README.md └─ ...


- **index.html**：主頁面，載入並顯示 D3.js 視覺化結果  
- **main.js**：包含 D3.js 的圖表繪製邏輯，包括堆疊直方圖、圓餅圖、熱圖與折線圖  
- **pre_processing.ipynb**：資料預處理的 Python 筆記本 (清理、轉換、篩選、統計等)  
- **data/**：放置原始及預處理後的 CSV 檔  

## 如何啟動專案
1. **安裝環境**
   - 建議安裝 Python（若需要在本地執行 Jupyter Notebook 進行資料清洗）
   - 若僅需瀏覽視覺化，安裝任何 Web Server（例如使用 VSCode 的 Live Server）即可。

2. **資料準備**
   - 將您下載/清理後的 `preprocessed_shopping_trends.csv` 放到 `data/` 資料夾中。  
   - 如需自訂檔案路徑，請確保在 `main.js` 的 `parseData()` 與 `UpDateData()` 內更改對應路徑。

3. **執行專案**
   - 在專案根目錄下，啟動簡易伺服器（例如 `python -m http.server`）
   - 瀏覽器中進入 `http://127.0.0.1:8000/index.html` (依實際埠號為準) 即可查看視覺化結果。

4. **互動方式**
   - **堆疊直方圖**：滑鼠拖拉可框選年齡範圍；點擊圖例「Male 或 Female」可切換顯示方式。
   - **圓餅圖**：點擊圖例可針對指定類別篩選，其他圖表對應更新。
   - **熱圖**：顯示不同支付方式與物流方式交叉的使用頻度。
   - **折線圖**：顯示品項在四季的銷售變化，滑鼠移動到資料點可浮出提示 (Tooltip)。

## 使用技術
- **D3.js** (版本 v5)
- **HTML / CSS**
- **JavaScript**
- **Python** (資料預處理，可選)

## 成員名單
- 41047027S 簡暐軒  
- 40947008S 林顥羽  

## 後續可改進方向
1. **更多互動功能**：加入更加直覺的篩選、縮放或動態更新機制。
2. **更大數據集**：若要處理海量資料，可考慮以後端/API 形式配合伺服器端的篩選與分頁機制。
3. **整合式儀表板 (Dashboard)**：將各圖表以更美觀的排版整合並提供自訂篩選條件。

## 版權聲明
- 資料集之版權請參考原始資料來源之使用條款。
- 此專案程式碼若無額外註明，採 [MIT License](https://opensource.org/licenses/MIT) 開放授權，歡迎自由複製及修改。
