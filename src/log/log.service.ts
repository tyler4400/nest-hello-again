import { Injectable } from '@nestjs/common';

@Injectable()
export class LogService {
  hello() {
    return {
      code: 0,
      data: [],
      msg: '请求logger成功！',
    };
  }

  // addUser() {
  //   return {
  //     code: 0,
  //     data: {},
  //     msg: '添加用户成功',
  //   };
  // }
}
