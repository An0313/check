/**
 * 身份证校验
 * @param {string} card 要校验的身份证
 * @return {boolean}
 */

const validateIdent = {
  aIdentityCode_City: { // 城市代码列表
    11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林",
    23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西",
    37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南",
    50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃",
    63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 "
  },
  IdentityCode_isCardNo(card) {//检查号码是否符合规范，包括长度，类型
    const reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/; //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
    return reg.test(card) !== false;
  },
  IdentityCode_checkProvince(card) { //取身份证前两位，校验省份
    const province = card.substr(0, 2);
    return validateIdent.aIdentityCode_City[province] !== undefined;
  },
  IdentityCode_checkBirthday(card) { //检查生日是否正确，15位以'19'年份来进行补齐。
    const len = card.length;
    //身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
    if (len === 15) {
      const arr_data = card.match(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/); // 正则取号码内所含出年月日数据
      const year = arr_data[2];
      const month = arr_data[3];
      const day = arr_data[4];
      const birthday = new Date('19' + year + '/' + month + '/' + day);
      return validateIdent.IdentityCode_verifyBirthday('19' + year, month, day, birthday);
    }
    //身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
    if (len === 18) {
      const re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
      const arr_data = card.match(re_eighteen); // 正则取号码内所含出年月日数据
      const year = arr_data[2];
      const month = arr_data[3];
      const day = arr_data[4];
      const birthday = new Date(year + '/' + month + '/' + day);
      return validateIdent.IdentityCode_verifyBirthday(year, month, day, birthday);
    }
    return false;
  },
  IdentityCode_verifyBirthday(year, month, day, birthday) {//校验日期 ，15位以'19'年份来进行补齐。
    const now = new Date();
    const now_year = now.getFullYear();
    //年月日是否合理
    if (birthday.getFullYear() === year
      && (birthday.getMonth() + 1) === month
      && birthday.getDate() === day) {
      //判断年份的范围（3岁到150岁之间)
      const time = now_year - year;
      return time >= 3 && time <= 150;
    }
    return false;
  },
  IdentityCode_checkParity(card) { //校验位的检测
    card = validateIdent.IdentityCode_changeFivteenToEighteen(card); // 15位转18位
    const len = card.length;
    if (len === 18) {
      const arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      const arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
      let cardTemp = 0, i, valnum;
      for (i = 0; i < 17; i++) {
        cardTemp += card.substr(i, 1) * arrInt[i];
      }
      valnum = arrCh[cardTemp % 11];
      return valnum === card.substr(17, 1);
    }
    return false;
  },
  IdentityCode_changeFivteenToEighteen(card) {  //15位转18位身份证号
    if (card.length === 15) {
      const arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      const arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
      let cardTemp = 0, i;
      card = card.substr(0, 6) + '19' + card.substr(6, card.length - 6);
      for (i = 0; i < 17; i++) {
        cardTemp += card.substr(i, 1) * arrInt[i];
      }
      card += arrCh[cardTemp % 11];
      return card;
    }
    return card;
  },
  IdentityCodeValid(card) {//   身份证号码检验主入口
    let pass = true;
    let sex = ''
    //是否为空
    if (pass && card === '')
      pass = false;
    //校验长度，类型
    if (pass && validateIdent.IdentityCode_isCardNo(card) === false)
      pass = false;
    //检查省份
    if (pass && validateIdent.IdentityCode_checkProvince(card) === false)
      pass = false;
    //校验生日
    if (pass && validateIdent.IdentityCode_checkBirthday(card) === false)
      pass = false;
    //检验位的检测
    if (pass && validateIdent.IdentityCode_checkParity(card) === false)
      pass = false;
    if (pass) {
      var iCard = validateIdent.IdentityCode_changeFivteenToEighteen(card);
      if (parseInt(iCard.charAt(16)) % 2 === 0) {
        sex = "0"; // 女生
      } else {
        sex = "1"; // 男生
      }
      return true
    } else {
      return false
    }
  }
}

export default validateIdent.IdentityCodeValid
