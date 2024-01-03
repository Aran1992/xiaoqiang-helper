console.log("content-platform loaded");

function getAccount() {
  try {
    // todo 如果如此静态 是不是用xpath实现比较好呢？
    const a = document.getElementsByClassName("el-table__row")[0];
    const c = a.getElementsByTagName("td")[2].getElementsByClassName("red")[0];
    return c.innerText.trim();
  } catch (e) {
    return null;
  }
}

function getNum() {
  try {
    const a = document.getElementById("spAuditedAccountCount");
    return parseInt(a.innerText.trim());
  } catch (e) {
    return null;
  }
}

function getRejectButton() {
  const a = document.getElementsByClassName("el-table__row")[0];
  return a
    .getElementsByTagName("td")[4]
    .getElementsByClassName("el-button--danger")[0];
}

function getPassButton() {
  const a = document.getElementsByClassName("el-table__row")[0];
  return a
    .getElementsByTagName("td")[4]
    .getElementsByClassName("el-button--primary")[1];
}

function getConfirmButton() {
  return document
    .getElementsByClassName("el-message-box__wrapper")[0]
    .getElementsByClassName("el-button--primary")[0];
}

function tryUtilSuccess(handler) {
  const timer = setInterval(() => {
    try {
      handler();
      clearInterval(timer);
    } catch (e) {}
  }, 1000);
}

// todo 界面上最好加个蒙版 让用户不能随意操作 并且知道这是程序在操作的页面

/**
 * 页面打开之后先判断当前是否有买手
 * 有就开始查询
 * 没有就检查一下是否有角标
 * 有就刷新一下页面
 * 没有就继续隔段时间检查一下
 */
const timer = setInterval(() => {
  const account = getAccount();
  if (account) {
    clearInterval(timer);
    console.log("检测到当前有买手，账号：", account);
    queryBlack(account);
    return;
  }
  const num = getNum();
  if (num > 0) {
    clearInterval(timer);
    console.log("检测到当前有待审号订单，数量：", num);
    location.reload();
  }
}, 1000);

chrome.runtime.onMessage.addListener((message) => {
  console.log("onMessage", message);
  if (message.isBlack) {
    getRejectButton().click();
    tryUtilSuccess(() => {
      getConfirmButton().click();
      setTimeout(() => {
        location.reload();
      }, 1000);
    });
  } else {
    getPassButton().click();
    tryUtilSuccess(() => {
      getConfirmButton().click();
      setTimeout(() => {
        location.reload();
      }, 1000);
    });
  }
});

async function queryBlack(account) {
  chrome.runtime.sendMessage({
    type: "queryBlack",
    account,
  });
}
