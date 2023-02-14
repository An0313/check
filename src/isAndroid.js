/**
 * 是否是安卓客户端
 * @return {boolean}
 */
export default () => /android/.test(window.navigator.userAgent.toLowerCase())
