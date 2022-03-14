# SSDExplainer
物体検出器を対象としてNNの判断根拠を示す要因マップやモデルごとの予測精度の比較調査を柔軟に支援する対話型支援システム


## DEMO

 ※[ デモ動画 ( GoogleDrive ) ](https://drive.google.com/file/d/1cGMhdSMe--NJdyWcwslY-CYKgZ__EuEG/view?usp=sharing)

<img width="1680" alt="スクリーンショット 0004-03-10 19 16 57" src="https://user-images.githubusercontent.com/44857986/157834876-1912816c-30d6-4432-8a4b-0c2e96bbc617.png">

## Features

![system_merit-1](https://user-images.githubusercontent.com/44857986/158005108-59a0b13d-15fa-49fa-b2d4-9fc177f92ed8.png)


## directory
- / front: webアプリケーション ( React )
- / back: ラベル情報を用いてデータベースから画像を検索 ( backServer.js )
- / image: 画像格納しているレポジトリサーバー ( server.js )

    ![system-figure-1](https://user-images.githubusercontent.com/44857986/158005195-1db322d7-e39f-431d-bc60-3a668ccbb24f.png)


*** 
## Requirement

必要なライブラリ

* Node.js ( React )
* MongoDB

--- 

## Installation ( windows )
インストール方法

Node.js
1. [Node.js公式サイト](https://nodejs.org/en/)からNode.jsのインストーラーを入手

1. インストーラーを実行してNode.jsをインストールする

1. Node.jsがインストールされたかを確認する

```bash
node -v
```

MongoDB

1. [MongoDB公式サイト](https://nodejs.org/en/)からMongoDBのインストーラーを入手

1. インストーラーを実行してMondoDBをインストールする

1. 画面に沿ってインストールを進める

1. 環境変数パスの設定を行う

    MongoDBの実行ファイルは、「C:\Program Files\MongoDB\Server\5.0\bin」に配置されているので、これを環境変数Pathに追加する

    ※[環境変数の設定方法参考サイト](https://proengineer.internous.co.jp/content/columnfeature/5205)

1. PCを再起動する

1. MongoDBがインストールされたか確認する

```bash
mongo -version
```

MongoDB データベース作成

```bash
mongoimport --db labels --collection vals --file ~/desktop/ssd-visualize-system/bdd100k_labels_images_val.json
```

データベースが作成されているか確認

```bash
mongo 
//シェル起動
show dbs 
// データベース labels が作成されているのを確認
use labels
show collections 
// テーブル(collections) vals が作成されているのを確認
use vals
db.vals.find()
// bdd100k_labels_images_val.jsonからデータベースが作成できているのを確認
```

MongoDBのURLを記述

1. シェルを起動した後，URLを確認する．
```bash
mongo //シェルを起動してURLを確認
```
2. db.config.jsを開いて，Node.jsを使って接続するMongoDBのURLとDB名を記述する

    (※db.config.js: /ssd-visualize-system/back/app/config/db.config.js)


「db.config.js」
```bash
// mongoDB URL指定
module.exports = {
    url: "mongodb://( mongoDBを起動したときに表示されるURL )/labels"
  };
```



# Usage
サーバの起動方法

1. https://github.com/kawa215/SSD-Visualize-system からZipでダウンロード解凍する
1. 以下のコマンドを入力する

```bash
(/back 配下に移動)
npm install
node backServer.js
(/image 配下に移動)
npm install
node server.js
(front/visualize-app 配下に移動)
npm install
npm start
```

# Note
画像枚数が非常に多く、検索条件によっては検索に時間がかかってしまうので注意してください

# Author

* 作成者: 三浦昌樹 (Masaki Miura)
* 所属: 亀谷研究室, 名城大学 理工学研究科 情報工学専攻 (2022卒業) 
* E-mail: 203426017@ccalumni.meijo-u.ac.jp

