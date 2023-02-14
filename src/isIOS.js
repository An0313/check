/**
 * 客户端是否是ios
 * @return {boolean}
 */
export default () => /ios|iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase())
