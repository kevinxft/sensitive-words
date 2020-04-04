import { Injectable, HttpService } from '@nestjs/common'
let tokenObj = null

@Injectable()
export class AppService {
  constructor(private readonly http: HttpService) {}

  async checkWords(content: string): Promise<any> {
    const needRefreshFlag: Boolean = await this.CheckNeedRefresh()
    if (needRefreshFlag) {
      await this.refreshToken()
    }
    const { data } = await this.http
      .post(
        `https://api.weixin.qq.com/wxa/msg_sec_check?access_token=${tokenObj.access_token}`,
        {
          content,
        },
      )
      .toPromise()
    return data
  }

  async refreshToken(): Promise<any> {
    const APPID = process.env.APPID
    const APPSECRET = process.env.APPSECRET
    const { data } = await this.http
      .get(
        `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`,
      )
      .toPromise()
    tokenObj = {
      ...data,
      createdAt: Date.now(),
    }
    return tokenObj
  }

  async CheckNeedRefresh(): Promise<Boolean> {
    if (!tokenObj) {
      return true
    }
    const { createdAt, expires_in } = tokenObj
    const needRefreshFlag =
      Math.floor((Date.now() - createdAt) / 1000) + 180 >= expires_in
    return needRefreshFlag
  }
}
