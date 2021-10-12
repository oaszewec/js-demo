// new Promise(function (resolve, reject) {/* code */});
function getData(id) {
  return new Promise(function (resolve, reject) {
    if (!id) return reject(new TypeError('没有id'));
    setTimeout(() => {
      resolve([1, 2, 3, 4]);
    }, 500);
  });
}

// promise.then(onFulfilled:Function, onRejected:Function)
let pData = getData('123').then(
  (data) => {
    console.log('callback', data);
    return data.join(',');
  },
  (err) => {
    console.error(err);
    throw err;
  }
);

// 文件上传
function verifyFile(file) {
  const maxSize = 1024 * 1024;
  const suffixs = ['.jpg', '.png'];
  return new Promise(function (resolve, reject) {
    if (file.size > maxSize) {
      return reject('文件大小超过限制');
    }
    if (suffixs.includes(file.name.match(/\.\w+$/)?.[0].toLowerCase())) {
      return reject('文件类型不支持');
    }
    resolve(file);
  });
}

function existsFile(file) {
  return new Promise(function (resolve, reject) {
    $.get('/api/getFileByMd5', { md5: getFileMd5(file) }, function (data, status) {
      if (status === 'success') {
        if (data.file) {
          resolve();
        } else {
          reject();
        }
      }
    });
  });
}

// <input type="file" onchange="onChange" />

function handleUpload(file) {}
