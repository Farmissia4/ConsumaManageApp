// miniprogram/pages/consumables/consumables.js

//获取小程序全局配置
const app = getApp()

//调用utils中的获取系统日期时间模块
var util = require('../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentDt:"",
    inOutRange:["请选择","入库","出库"],
    inOutValue:0,
    inOut:"",
    partNo:"",
    facilityType:"",
    name:"",
    part:"",
    number:"",
    unitsRange:["请选择","个","根","套","袋","包","盒"],
    unitsValue:0,
    units:"",
    SN:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //初始化数据库
    var that = this
    wx.cloud.init({env:"datacld4-df5k1"})
    that.db = wx.cloud.database()             //简化数据库集合调用的名称
    that.ConRecord = that.db.collection("ConRecord")
    that.ConInfo = that.db.collection("ConInfo")

    //页面启动时，自动获取系统日期时间
    var dateTime = util.formatTime(new Date());
    this.setData({
      currentDt:dateTime
    })
  },

  //表格提交
  formSubmit: function(e){
    var warn = "";
    var flag = false;
    //数据信息不全或错误表单会无法提交，并弹出相关提示(仪器名称非必填)
    if(this.data.inOutValue == 0){
      warn = "请选择出入库信息！";
    }else if(this.data.partNo == ""){
      warn = "请输入货号！";
    }else if(this.data.name == ""){
      warn = "请输入名称！";
    }else if(this.data.part == ""){
      warn = "请输入部件！";
    }else if(this.data.number == "" || this.data.number == 0){
      warn = "请正确输入数量！";
    }else if(this.data.unitsValue == 0){
      warn = "请选择单位信息!";
    }else{ //表单信息完整且正确可成功提交
      var that = this;
      flag = true;
      try{
        //将录入的数据赋值给相关变量并储存在数据库中
        that.ConRecord.add({
          data:{
            currentDt: that.data.currentDt,
            inOut: that.data.inOutRange[that.data.inOutValue],
            partNo: that.data.partNo,
            facilityType: that.data.facilityType,
            name: that.data.name,
            part: that.data.part,
            number: that.data.number,
            units: that.data.unitsRange[that.data.unitsValue],
            SN: that.data.SN
          },

          //提交成功后会有提示窗口弹出
          success: function(res){
            console.log(res)
            wx.showModal({
              title:"success",
              content:"提交成功",
              showCancel: false
            })
           //提交成功后将自动重置表单         
            that.setData({
              currentDt: util.formatTime(new Date()),
              inOutRange:["请选择","入库","出库"],
              inOutValue:0,
              partNo:"",
              facilityType:"",
              name:"",
              part:"",
              number:"",
              unitsRange:["请选择","个","根","套","袋","包","盒"],
              unitsValue:0,
              SN:""
            })
          }
        })
      }

      catch(e){
        wx.showModal({
          title:"error",
          content: e.message,
          showCancel: false
        })
      }
    }

    if(flag == false){
      wx.showModal({
      title: '提示',
      content:warn
    })
  }
  },

  //点击取消后重置表单
  formReset(e) {
    this.setData({
      currentDt: util.formatTime(new Date()),
      inOutRange:["请选择","入库","出库"],
      inOutValue:0,
      partNo:"",
      facilityType:"",
      name:"",
      part:"",
      number:"",
      unitsRange:["请选择","个","根","套","袋","包","盒"],
      unitsValue:0,
      SN:""
    })
  },
  //出入库数据赋值
  inOutPickerBindchange: function(e){
    this.setData({
      inOutValue: e.detail.value
    })
  },

  //手动输入货号赋值
  bindKeyInputPartNo: function(e){
    this.setData({
      partNo: e.detail.value
    });
  },

  //扫描货号条码录入
  scanPartNo: function(){
    wx.scanCode({
      onlyFromCamera: true,   //只能从相机扫描
      scanType: ["barCode"],  //只能扫描条形码(可以扩展成其他条码)

       //扫描成功或条码号赋值给货号变量
      success:(res) => {
        var codeNo = res.result;
        this.setData({
          partNo: codeNo
        })
      },

      //扫码失败提示
      fail:(res) =>{
        wx.showToast({
          title:"扫码失败",
          icon:"loading",
          duration: 1500
        })
      }
    })
  },

  //手动输入仪器类型赋值
  bindKeyInputFacilityType: function(e){
    this.setData({
      facilityType: e.detail.value
    })
  },
  
  //手动输入耗材名称赋值
  bindKeyInputName: function(e){
    this.setData({
      name: e.detail.value
    })
  },

  //手动输入部件赋值
  bindKeyInputPart: function(e){
    this.setData({
      part: e.detail.value
    })
  },

  //输入数量赋值
  bindKeyInputNumber: function(e){
    this.setData({
      number: e.detail.value
    })
  },
  
  //单位选择赋值
  unitsPickerBindchange: function(e){
    this.setData({
      unitsValue: e.detail.value
    })
  },

  //手动输入SN号赋值
  bindKeyInputSN: function(e){
    this.setData({
      SN: e.detail.value
    })
  },

  //扫描SN号录入
  scanSN: function(){
    wx.scanCode({
      onlyFromCamera: true,     //只能从相机扫描
      scanType: ["barCode"],    //只能扫描条形码

      //扫描成功或条码号赋值给SN号变量
      success:(res) => {
        var codeSN = res.result;
        this.setData({
          SN: codeSN
        })
      },

      //扫码失败提示
      fail:(res) =>{
        wx.showToast({
          title:"扫码失败",
          icon:"loading",
          duration: 1500
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //页面下拉刷新时，获取系统日期时间，刷新当前时间
    //页面启动时，自动获取系统日期时间
    var dateTime = util.formatTime(new Date());
    this.setData({
      currentDt:dateTime
    })
    
    wx.stopPullDownRefresh() //时间更新后停止下拉刷新动画
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})