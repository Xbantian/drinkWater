# 自定义windows定时服务

- 可以自定义服务的内容
- 现有的一个服务是定时"抽水"（ibu的一个活动），并且将结果推送至钉钉群（要跑起来需要配置数据库以及一个钉钉群机器人）

## 配置方法

 - 添加文件config/ding-token.local.js,如果没有该配置会读取config/ding-token.js

 ## 安转Windows服务
 -  yarn start