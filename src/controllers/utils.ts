import db from '../database/connection'

class Utils {
  public async isLoggedIn (email: string, auth: string) : Promise<boolean> {
    const data = await db('users')
      .select('auth', 'is_logged_in')
      .where({ email })

    const [{ auth: AuthKey, is_logged_in: isLoggedIn }] = data

    return AuthKey !== '' && AuthKey === auth && isLoggedIn
  }

  public async isAdmin (email: string) : Promise<boolean> {
    const [{ is_admin: isAdmin }] = await db('users')
      .select('is_admin')
      .where({ email })

    return isAdmin
  }
}

export default new Utils()
