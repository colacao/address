# node-ipip [![Build Status](https://travis-ci.org/ChiChou/node-ipip.svg?branch=master)](https://travis-ci.org/ChiChou/node-ipip) [![Coverage Status](https://img.shields.io/coveralls/ChiChou/node-ipip.svg)](https://coveralls.io/r/ChiChou/node-ipip) [![npm version](https://badge.fury.io/js/ipip.svg)](http://badge.fury.io/js/ipip)

[English Document](README.en.md)

适用于 Node.js 的 [ipip.net](http://ipip.net) IP 数据库查询模块。

## 入门

安装依赖项

    npm install ipip

[IP 地址库](http://s.qdcdn.com/17mon/17monipdb.dat) 由 17mon 提供，您可以手动下载最新的文件到库所在目录，也可以在库所在目录直接使用 `npm run installdb`命令下载安装。

代码示例

    var ipip = require('ipip').IPIP;
    var ip = new IPIP();
    
    // 查询 IP 信息，以字典格式返回
    console.log(ip.ip('202.195.161.30'));

## 文档

### 查 IP

IPIP.ip(ip [, format])

**ip**

待查询的 IP 地址，如 `8.8.8.8`

**format** 

制定返回数据的格式，可设置为 `array` 或者 `dict`。 

* 免费版（dat 格式）数据包含国家、省份、城市、组织；
* 收费版包含国家、省份、城市、组织、运营商、经度、纬度、时区、行政区域代码。

设为 `array`（缺省）时返回格式如下：
    
    ['国家', '省份', '城市', '组织']

设为 `dict` 时返回格式如下：

    {
      country: '国家',
      province: '省份',
      city: '城市',
      organization: '组织' 
    }

## 命令行小工具

安装位全局模块之后，可以在命令行中使用 `ipip` 快速查询 IP 信息：

    ➜  ~ ipip 8.8.8.8 202.195.161.30
    Information for 8.8.8.8:
    country: GOOGLE
    province: GOOGLE
    city: N/A
    organization: N/A
    
    Information for 202.195.161.30:
    country: 中国
    province: 江苏
    city: 镇江
    organization: 江苏大学

## 授权

MIT