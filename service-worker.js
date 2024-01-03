const minAge = 4; //最小淘龄
const maxOrderTimes = 2; //最大周平均数
const maxSearchTimes = 5; //最大近一周被查询数

chrome.runtime.onMessage.addListener(async (message) => {
  console.log("onMessage", message);
  switch (message.type) {
    case "queryBlack":
      {
        const [tab] = await chrome.tabs.query({
          url: ["http://www.dianzhushou.cn/function/ww-check"],
        });
        chrome.tabs.sendMessage(tab.id, {
          type: "queryBlack",
          account: message.account,
        });
      }
      break;
    case "resultBlack":
      {
        const [tab] = await chrome.tabs.query({
          url: ["https://my.xueyuds.com/*"],
        });

        const isBlack =
          message.result.age < minAge ||
          message.result.orderTimes > maxOrderTimes ||
          message.result.searchTimes > maxSearchTimes;
        chrome.tabs.sendMessage(tab.id, {
          type: "resultBlack",
          isBlack,
        });
      }
      break;
    default:
      console.warn("未知的message type");
  }
});
