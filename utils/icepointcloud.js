var sessionID = "sessionID";
var bindPhone = "bindPhone";

function getSessionID() {
    var a =  wx.getStorageSync(sessionID)
    return a
}

function setSessionID(a) {
    wx.setStorageSync(sessionID, a)
}

function setBindPhone(a){
    wx.setStorageSync(bindPhone, a)
}

function getBindPhone(){
    var a =  wx.getStorageSync(bindPhone)
    return a
}

module.exports = {
    setSessionID:setSessionID,
    getSessionID:getSessionID,
    getBindPhone:getBindPhone,
    setBindPhone:setBindPhone
}