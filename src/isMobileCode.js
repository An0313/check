import {ar_mobileCode} from "@ahg0313/regexp";

export default (code = '') => ar_mobileCode.test(code)
