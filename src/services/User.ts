import Service from '../utils/baseClass/Service'
import Article from './Article'
import { Profile } from '../utils/type'
import * as is from '../utils/is'

export default class User extends Service {
  private _username?: string
  private _password?: string
  private _profile?: Profile
  private _aritlceList: Article[]

  public get password() {
    return this._password
  }
  public set password(value) {
    this._password = value
  }

  public get username() {
    return this._username
  }
  public set username(value) {
    this._username = value
  }

  public get profile() {
    return this._profile
  }
  public set profile(value) {
    this._profile = value
  }

  public get aritlceList() {
    return this._aritlceList
  }
  public set aritlceList(value) {
    this._aritlceList = value
  }

  public constructor() {
    super()
    this._aritlceList = []
  }

  public async addArticle(article: Article) {
    if (!article.info || !this.profile?.nickname) return

    article.info.author = this.profile.nickname
    await article.add()
    this.aritlceList.push(article)
  }

  public async removeArticle(articleId: string) {
    await Article.remove(articleId)
    this.aritlceList = this.aritlceList
      .map(article => (article.info?.articleId === articleId ? false : article))
      .filter(Boolean) as Article[]
  }

  private setUserInfo(username: string, password: string, profile: Profile) {
    this.username = username
    this.password = password
    this.profile = profile
  }

  public async initById(userId: string) {
    const result = await User.find({ userId })
    if (!result) throw new Error('用户不存在')

    const {
      account: { username, password },
      profile
    } = result
    this.setUserInfo(username, password, profile)
  }

  public async register(username: string, password: string, profile: Profile) {
    if (await User.find({ username })) throw new Error('用户已存在')
    if (!is.object(profile)) return

    await this.dao.user.create(username, password, profile)
    this.setUserInfo(username, password, profile)
  }

  public async signIn(username: string, password: string) {
    const result = await User.find({ username })
    if (!result) throw new Error('用户不存在')

    await this.dao.user.signIn(username, password)
    this.setUserInfo(username, password, result.profile)
  }

  public static async signOut(userId: string) {
    if (!(await User.find({ userId }))) throw new Error('用户不存在')

    await this.dao.user.signOut(userId)
  }

  public static async find({ username, userId }: { username?: string; userId?: string }) {
    if (username) return await this.dao.user.findByName(username)
    if (userId) return await this.dao.user.findById(userId)
  }
}