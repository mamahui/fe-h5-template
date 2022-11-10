export default {
  mobile: /^1\d{10}$/,
  idCard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
  chinese: /[\u4e00-\u9fa5]/g,
  name: /^[\u4e00-\u9fa5\w]+$/,
};
