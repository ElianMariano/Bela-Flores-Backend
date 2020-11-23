import db from '../database/connection'

class Utils {
  public async isLoggedIn (id: string, email: string, auth: string) : Promise<boolean> {
    const [AuthKey, isLoggedIn] = await db('users')
      .select('auth', 'is_logged_in')
      .where({ id, email })

    return AuthKey !== '' && AuthKey === auth && isLoggedIn
  }
}

export default new Utils()
