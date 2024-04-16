# 秋空󠄁明󠄁朝󠄁 ChiuKong Mincho

[![秋空󠄁字體討論組](https://dcbadge.vercel.app/api/server/hebuGFm9fg)](https://discord.gg/hebuGFm9fg)

![ChiuKongMinchoLogo_Light](public/images/ChiuKongMinchoLogo_Light.svg#gh-light-mode-only)
![ChiuKongMinchoLogo_Dark](public/images/ChiuKongMinchoLogo_Dark.svg#gh-dark-mode-only)

<sup><sub><strong>註：</strong> 使用圖片展示「秋空󠄁黑體」這一名稱時，名稱中的「空」應爲如圖所示的「空󠄁」形（「⿱穴工」/穴從八形）而非「空󠄀」（「⿱宂工」/穴從儿形）形。 其對應的異體字選擇符碼位爲U+E0101或U+E0103。</sub></sup>

## 說明

> **本專案仍在製作中，僅作開源文件用途。**

秋空󠄁明󠄁朝󠄁（ChiuKong Mincho）是一款以思源明體爲基礎進行二次修改而成，使用傳統印刷體筆形設計，同時整合了異體字選擇器特性的一般及純文本異體字編排用途的字體專案。

## 分流版

> 由於本專案所基於的思源明體2.002相較於原本的1.001版本大量刪減了原有的JP字圖，逐字恢復所有被刪減字圖並不現實，因此不保證在常用字及次常用字範圍以外的字圖使用傳統明朝體筆形設計。

### 舊式活字慣用字形（CL）

參考舊時出版物的慣用活字字樣的傳統活字印刷慣用字形，字形選取基準大致上與日本的《表外漢字字體表》相同。適合使用傳統漢字的中文書面語排版場景使用。

### 現代折衷印刷體慣用字形（MN）

兼顧當代正體中文用戶慣用字形的新舊混合字形，適合使用傳統漢字的中文書面語排版場景使用。

### JIS X 0213:2004規格字形（JP）

基於原版思源明體JP版進行少量修改，對一些錯誤字圖進行了修正，並參考日本商業字體中常見的容許設計差範圍內降低與表外漢字的字形差異。其字形符合Adobe-Japan及JIS X 0213:2004規格，支援規格及字形大致與Pr6N字體相同，適合現代日語書面語排版場景使用。

## 相關常見問題

## 提交 Issue 須知

本專案以下所有規則，不僅適用於本專案，亦適用於秋空󠄁黑體專案。

### 語言

閣下必須使用中文書面語或英文提交相關 Issue，若沒有按本專案的要求提交其他語言的 Issue 或附上中文書面語或英文翻譯，本專案保留不作任何回應的權利。

中文書面語的定義為書面現代標準漢語的官話白話文，不包括大量參雜口語用詞 、官話變體用詞及令人難以理解的網絡用語、拉丁字母縮寫、注音字符諧音或漢字諧音替代的官話白話文，以及官話白話文以外的漢語變體白話文。

### 請保持基本禮貌及尊重

請勿使用粗言穢語，保持基本謙虛的態度，並尊重所有討論各方的觀點。

### 提議修改字圖或字圖映射格式

關於提議修改字圖或字圖映射的請求，閣下可以任意使用中文或英文提出相關 Issue 請求，唯須按以下格式進行提交：

中文

> - **字圖字樣：** （字圖字樣圖片）
> - **字符：** （字符）
> - **碼位：** （U+XXXX 16 進制格式）
> - **CID：** （CID）
> - **優先度：** （急迫-緊急-高-中-低-無關緊要-應重新設計）
> - **理由：** （修改字圖的理由）

English

> - **Glyph Shape:** (Picture of desire glyph)
> - **Character:** (Character)
> - **Codepoint:** (in U+XXXX hexadecimal format)
> - **CID:** (CID)
> - **Priority:** (Urgent-Critical-High-Medium-Low-Very Low-Redesign)
> - **Reason:** (Support Reason)

**優先度說明：** 若相關字符屬於 jf7000 當務字集範圍內且默認字圖仍未使用印刷體筆形的字圖字樣，可考慮將優先度設定爲緊急或急迫。

**修改理由說明：** 一般如果是映射問題或繪製問題可以接受。但如果提議修改默認字圖的情況，閣下必須提供充分的理由要求修改，包括但不限於出版物相關圖像等。請注意，倘若閣下衹提及字源字理、要求彰顯字理、引用難以被證實存在實際運用的證據或在提議修改CL版時僅引用單一字表或直接使用字書字頭而不附上一般出版物使用情況，閣下的理由將被視作是無效理由。

閣下可以參考該格式製作成表格，但仍須包含以上所有項目。

若無根據以上格式要求進行提交 Issue，或沒有塡寫所有項目，本專案有權在不通知的情況下直接關閉相關 Issue 而無須提供任何理由。

### 字體生成程式相關

若發現字體生成程式具有嚴重的漏洞，或代碼風格有些許改進的地方，歡迎提出 Issue 及 Merge Request。唯在 Issue 內須附上代碼片段及文件名以方便追蹤修改。

## 參與製作或後續改作

本專案作為開源專案非常歡迎任何人參與字體的製作。如有深度參與製作的想法或詳細討論關於本專案或秋空󠄁黑體及相關話題，可以點擊說明上方的 discord 邀請鏈接加入伺服器參與討論。

## 著作權及授權信息

依照 SIL Open Font License 1.1 授權許可發佈，閣下可以：

- 可自由使用本字體，不限個人或商業用途。
- 自由分發本字體。
- 基於 SIL Open Font License 1.1 授權許可修改、二次創作本字體。

## 鳴謝

## Build 構建（僅提供英語）

### Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js >= 20.10.0 (LTS)
- Python >= 3.12
- Perl >= 5.38

**Note:** Python is typically invoked with the `python` command. But on UNIX-like systems (macOS, Linux, etc.), the command is usually `python3`. Ensure that you use the appropriate command for your operating system and that the correct version of Python is installed.

### Build the script

To create a production-ready build of the project, execute the following command:

```shell
npm run build
```

### Installation

Install the necessary dependencies:

```shell
npm install
```

Then if you would like to build the production ready script, use following command:

```shell
npm run build
```

### Run

The build script is currently under development and not fully prepared. However, you can build the variable font master with the following command:

```shell
npm run start -- --build-dev
```

Alternatively, to directly run the script in TypeScript without compiling, you can use:

```shell
npm run dev -- --build-dev
```

Please note that this command is a temporary solution until the build script and first version of ChiuKong Mincho is finalized.
=======
# 秋空󠄁明󠄁朝󠄁 ChiuKong Mincho

[![秋空󠄁字體討論組](https://dcbadge.vercel.app/api/server/hebuGFm9fg)](https://discord.gg/hebuGFm9fg)

![ChiuKongMinchoLogo_Light](public/images/ChiuKongMinchoLogo_Light.svg#gh-light-mode-only)
![ChiuKongMinchoLogo_Dark](public/images/ChiuKongMinchoLogo_Dark.svg#gh-dark-mode-only)

<sup><sub><strong>註：</strong> 使用圖片展示「秋空󠄁黑體」這一名稱時，名稱中的「空」應爲如圖所示的「空󠄁」形（「⿱穴工」/穴從八形）而非「空󠄀」（「⿱宂工」/穴從儿形）形。 其對應的異體字選擇符碼位爲U+E0101或U+E0103。</sub></sup>

## 說明

> **本專案仍在製作中，僅作開源文件用途。**

秋空󠄁明󠄁朝󠄁（ChiuKong Mincho）是一款以思源明體爲基礎進行二次修改而成，使用傳統印刷體筆形設計，同時整合了異體字選擇器特性的一般及純文本異體字編排用途的字體專案。

## 分流版

> 由於本專案所基於的思源明體2.002相較於原本的1.001版本大量刪減了原有的JP字圖，逐字恢復所有被刪減字圖並不現實，因此不保證在常用字及次常用字範圍以外的字圖使用傳統明朝體筆形設計。

### 舊式活字慣用字形（CL）

參考舊時出版物的慣用活字字樣的傳統活字印刷慣用字形，字形選取基準大致上與日本的《表外漢字字體表》相同。適合使用傳統漢字的中文書面語排版場景使用。

### 現代折衷印刷體慣用字形（MN）

兼顧當代正體中文用戶慣用字形的新舊混合字形，適合使用傳統漢字的中文書面語排版場景使用。

### JIS X 0213:2004規格字形（JP）

基於原版思源明體JP版進行少量修改，對一些錯誤字圖進行了修正，並參考日本商業字體中常見的容許設計差範圍內降低與表外漢字的字形差異。其字形符合Adobe-Japan及JIS X 0213:2004規格，支援規格及字形大致與Pr6N字體相同，適合現代日語書面語排版場景使用。

## 相關常見問題

## 提交 Issue 須知

本專案以下所有規則，不僅適用於本專案，亦適用於秋空󠄁黑體專案。

### 語言

閣下必須使用中文書面語或英文提交相關 Issue，若沒有按本專案的要求提交其他語言的 Issue 或附上中文書面語或英文翻譯，本專案保留不作任何回應的權利。

中文書面語的定義為書面現代標準漢語的官話白話文，不包括大量參雜口語用詞 、官話變體用詞及令人難以理解的網絡用語、拉丁字母縮寫、注音字符諧音或漢字諧音替代的官話白話文，以及官話白話文以外的漢語變體白話文。

### 請保持基本禮貌及尊重

請勿使用粗言穢語，保持基本謙虛的態度，並尊重所有討論各方的觀點。

### 提議修改字圖或字圖映射格式

關於提議修改字圖或字圖映射的請求，閣下可以任意使用中文或英文提出相關 Issue 請求，唯須按以下格式進行提交：

中文

> - **字圖字樣：** （字圖字樣圖片）
> - **字符：** （字符）
> - **碼位：** （U+XXXX 16 進制格式）
> - **CID：** （CID）
> - **優先度：** （急迫-緊急-高-中-低-無關緊要-應重新設計）
> - **理由：** （修改字圖的理由）

English

> - **Glyph Shape:** (Picture of desire glyph)
> - **Character:** (Character)
> - **Codepoint:** (in U+XXXX hexadecimal format)
> - **CID:** (CID)
> - **Priority:** (Urgent-Critical-High-Medium-Low-Very Low-Redesign)
> - **Reason:** (Support Reason)

**優先度說明：** 若相關字符屬於 jf7000 當務字集範圍內且默認字圖仍未使用印刷體筆形的字圖字樣，可考慮將優先度設定爲緊急或急迫。

**修改理由說明：** 一般如果是映射問題或繪製問題可以接受。但如果提議修改默認字圖的情況，閣下必須提供充分的理由要求修改，包括但不限於出版物相關圖像等。請注意，倘若閣下衹提及字源字理、要求彰顯字理、引用難以被證實存在實際運用的證據或在提議修改CL版時僅引用單一字表或直接使用字書字頭而不附上一般出版物使用情況，閣下的理由將被視作是無效理由。

閣下可以參考該格式製作成表格，但仍須包含以上所有項目。

若無根據以上格式要求進行提交 Issue，或沒有塡寫所有項目，本專案有權在不通知的情況下直接關閉相關 Issue 而無須提供任何理由。

### 字體生成程式相關

若發現字體生成程式具有嚴重的漏洞，或代碼風格有些許改進的地方，歡迎提出 Issue 及 Merge Request。唯在 Issue 內須附上代碼片段及文件名以方便追蹤修改。

## 參與製作或後續改作

本專案作為開源專案非常歡迎任何人參與字體的製作。如有深度參與製作的想法或詳細討論關於本專案或秋空󠄁黑體及相關話題，可以點擊說明上方的 discord 邀請鏈接加入伺服器參與討論。

## 著作權及授權信息

依照 SIL Open Font License 1.1 授權許可發佈，閣下可以：

- 可自由使用本字體，不限個人或商業用途。
- 自由分發本字體。
- 基於 SIL Open Font License 1.1 授權許可修改、二次創作本字體。

## Build 構建（僅提供英語）

### Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js >= 20.10.0 (LTS)
- Python >= 3.12
- Perl >= 5.38

**Note:** Python is typically invoked with the `python` command. But on UNIX-like systems (macOS, Linux, etc.), the command is usually `python3`. Ensure that you use the appropriate command for your operating system and that the correct version of Python is installed.

### Build the script

To create a production-ready build of the project, execute the following command:

```shell
npm run build
```

### Installation

Install the necessary dependencies:

```shell
npm install
```

Then if you would like to build the production ready script, use following command:

```shell
npm run build
```

### Run

The build script is currently under development and not fully prepared. However, you can build the variable font master with the following command:

```shell
npm run start -- --build-dev
```

Alternatively, to directly run the script in TypeScript without compiling, you can use:

```shell
npm run dev -- --build-dev
```

Please note that this command is a temporary solution until the build script and first version of ChiuKong Mincho is finalized.