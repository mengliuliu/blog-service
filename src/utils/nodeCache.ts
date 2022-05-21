const NodeCache = require('node-cache');
let myCache = new NodeCache();

/**
 * 添加一个新缓存
 * @param cachename 缓存名
 * @param value 缓存值
 * @param ttl 缓存时间
 */
const setCache = (cachename, value) => {
  myCache.set(cachename, value);
};

/**
 * 获取缓存数据
 * @param cachename 缓存名
 */
const getCache = (cachename) => {
  return myCache.get(cachename);
};

/**
 * 删除缓存数据
 * @param cachename 缓存名
 */
const delCache = (cachename) => {
  myCache.del(cachename);
};

module.exports = {
  setCache,
  getCache,
  delCache,
};
// export { setCache, getCache, delCache };
