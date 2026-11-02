# Fr.eeeeZe Music Lab — Full Handoff Scaffold

這是交給 Codex 接手的完整專案骨架與可操作 MVP，不是八輪需求的最終完成品。它已包含可執行的前端核心：五度圈、調性切換、和弦進行、簡易播放、錄音／音檔匯入、基礎音高偵測、Piano Roll 編輯、MIDI 匯出、專案本機保存。

## 啟動
```bash
npm install
npm run dev
```
建置檢查：
```bash
npm run build
```

## 交給 Codex
將整個 ZIP 解壓後的所有檔案上傳到 `freeeze-music-lab` repository 根目錄，再把 `CODEX_HANDOFF_PROMPT.md` 全文貼給 Codex。要求 Codex 先檢查、執行 `npm install`、`npm run build`，修正所有錯誤，再依照提示逐階段完成產品。

## 目前 MVP 能力與限制
- 五度圈、大小調、調號、相對大小調
- 七級和弦、常用和弦進行與和聲色彩
- Web Audio 合成播放
- 麥克風錄音、音檔匯入；基礎單音自相關音高估測（不是專業級轉錄）
- 可編輯音符 Piano Roll、音符新增／刪除／移動／改音高
- MIDI Type 0 匯出（自行產生 SMF，不依賴外部套件）
- 多聲部資料結構、專案本機自動保存

## 尚待 Codex 實作／驗證
高品質多音高辨識、節奏／連音／裝飾音辨識、完整樂譜排版、music21 理論後端、真正的對位法求解器、跨裝置雲端同步、PDF 分譜、可靠的多軌 MIDI 匯出、版本歷史、測試與無障礙完整性。請勿把未完成項目假裝成已完成。
