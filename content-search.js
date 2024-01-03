console.log("content-search loaded");

chrome.runtime.onMessage.addListener(async (message) => {
  console.log("onMessage", message);
  if (message.type === "queryBlack") {
    const result = await search(message.account);
    console.log("查询结果", result);
    chrome.runtime.sendMessage({ type: "resultBlack", result });
  }
});

async function search(account) {
  const input = document.querySelector(".ant-input");
  input.value = account;
  const inputEvent = new Event("input", { bubbles: true, cancelable: true });
  input.dispatchEvent(inputEvent);

  const button = document.getElementsByClassName(
    "mr-20 ant-btn ant-btn-primary"
  )[0];
  button.click();

  await waitUtilTrue(() => find("旺旺账号").innerText.trim() === account);

  return {
    account,
    age: findFloat("淘龄"),
    orderTimes: findFloat("周平均数"),
    searchTimes: findSearchTimes(),
  };
}

function find(key) {
  const a = document.getElementsByClassName("ant-spin-nested-loading")[0];
  const b = [...a.getElementsByClassName("font-bold fs-14")];
  const c = b.find((a) => a.innerText.trim().startsWith(key));
  return c.nextElementSibling;
}

function findFloat(key) {
  const a = find(key);
  return parseFloat(a.innerText.trim());
}

function findSearchTimes() {
  const a = find("周查询次数");
  const b = a.getElementsByClassName("cl-main");
  return parseFloat(b[1].innerText.trim());
}

function waitUtilTrue(condition) {
  return new Promise((resolve) => {
    const timer = setInterval(() => {
      try {
        if (condition()) {
          clearInterval(timer);
          resolve();
        }
      } finally {
      }
    }, 1000);
  });
}
