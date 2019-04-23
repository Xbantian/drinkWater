# 自定义 windows 定时服务

-   可以自定义服务的内容
-   现有的一个服务是定时"抽水"（ibu 的一个活动），并且将结果推送至钉钉群（要跑起来需要配置数据库以及一个钉钉群机器人）

## 配置方法

-   把根目录下的 sql 导入到你的数据库
-   到`@/src/tasks/drink-water`配置你的数据库连接
-   添加文件 config/ding-token.local.js,如果没有该配置会读取 config/ding-token.js
-   在 config/ding-token.local.js 里配置你的钉钉群 token

## 安装 Windows 服务

-   yarn start
