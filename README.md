# 秋空󠄁明󠄁朝󠄁 ChiuKong Mincho

[![秋空󠄁字體討論組](https://dcbadge.vercel.app/api/server/hebuGFm9fg)](https://discord.gg/hebuGFm9fg)

![ChiuKongMinchoLogo_Light](public/images/ChiuKongMinchoLogo_Light.svg#gh-light-mode-only)
![ChiuKongMinchoLogo_Dark](public/images/ChiuKongMinchoLogo_Dark.svg#gh-dark-mode-only)

## 說明

本專案仍在製作中，僅作開源文件用途。

目前預設不同默認字圖版本有 CL、MN 及 JP 版本，而 JP 版本爲 JIS2004 字體。

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

> -   **字圖字樣：** （字圖字樣圖片）
> -   **字符：** （字符）
> -   **碼位：** （U+XXXX 16 進制格式）
> -   **CID：** （CID）
> -   **優先度：** （急迫-緊急-高-中-低-無關緊要-應重新設計）
> -   **理由：** （其理由是？）

English

> -   **Glyph Shape:** (Picture of desire glyph)
> -   **Character:** (Character)
> -   **Codepoint:** (in U+XXXX hexadecimal format)
> -   **CID:** (CID)
> -   **Priority:** (Urgent-Critical-High-Medium-Low-Very Low-Redesign)
> -   **Reason:** (Support Reason)

**優先度說明：** 若相關字符屬於 jf7000 當務字集範圍內且默認字圖仍未使用印刷體筆形的字圖字樣，可考慮將優先度設定爲緊急或急迫。

閣下可以參考該格式製作成表格，但仍須包含以上所有項目。

若無根據以上格式要求進行提交 Issue，本專案有權在不通知的情況下直接關閉相關 Issue 而無須提供任何理由。

### 字體生成程式相關

若發現字體生成程式具有嚴重的漏洞，或代碼風格有些許改進的地方，歡迎提出 Issue 及 Merge Request。唯在 Issue 內須附上代碼片段及文件名以方便追蹤修改。

## 參與製作或後續改作

本專案作為開源專案非常歡迎任何人參與字體的製作。如有深度參與製作的想法或詳細討論關於本專案或秋空󠄁黑體及相關話題，可以點擊說明上方的 discord 邀請鏈接加入伺服器參與討論。

## 著作權及授權信息

依照 SIL Open Font License 1.1 授權許可發佈，閣下可以：

-   可自由使用本字體，不限個人或商業用途。
-   自由分發本字體。
-   基於 SIL Open Font License 1.1 授權許可修改、二次創作本字體。

## Build 構建（僅提供英語）

### Prerequisites

Before you begin, ensure you have met the following requirements:

-   Node.js >= 20.10.0 (LTS)
-   Python >= 3.12
-   Perl >= 5.38

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
