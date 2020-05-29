import mysql from 'mysql'

const config = {
	host: 'localhost',
	user: 'root',
	password: '123456',
	database: 'blog',
	port: 3306,
	multipleStatements: true //允许多条sql同时执行
}

const pool = mysql.createPool(config)

class Mysql {
	constructor() {}
	query(sql: string) {
		return new Promise((resolve, reject) => {
			pool.query(sql, (error: any, results: any, fields: any) => {
				if (error) {
					reject(error)
				}
				resolve(results)
			})
		})
	}
}

export default () => async (ctx: any, next: any) => {
	ctx.mysql = new Mysql()
	await next()
}
