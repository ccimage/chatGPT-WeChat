# chatGPT-WeChat
use chatgpt inside wecom (企业微信接入chatgpt)

## 功能
在企业微信中跟ai聊天
> 原理如下
> 
> 通过企业微信的自建应用（可以当作群聊使用）接收消息，对特定命令当作ai提示词（/prompt: 开头的）。 访问chatgpt返回结果回复到企业微信

## 准备工作
开通企业微信，添加自建程序 (需要配置接收消息的服务器地址和token以及AESKey)
有一台可信服务器，使用可信域名，最好是https
开通chatgpt的api并且可以使用

## 编译
```shell
git clone https://github.com/ccimage/chatGPT-WeChat.git
yarn install
yarn run package
```

## 部署
复制dist文件夹和package.json到某个文件夹
创建.env文件配置如下
```
port=端口
chatGPT_token=OpenAI的key
Token=企业微信自建应用中配置时生成
EncodingAESKey=企业微信自建应用中配置时生成
```
```shell
yarn install --prod
node dist/server.bundle.js
```

## 存在问题
* 没有测试open ai的api,因为我的信用卡所在区域不能使用
* 微信接收和返回消息的功能已经测试成功了 

## 后续功能待开发
用别的大模型api代替open ai的(能找到的话)
