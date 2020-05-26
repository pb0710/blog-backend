import Controller from '../common/Controller';
export default class ArticleController extends Controller {
    constructor() {
        super(...arguments);
        this.getArticleList = async (ctx) => {
            const { sort } = ctx.query;
            const sql = `
		  select
		    id               as id,
		    sort             as sort,
		    title            as title,
		    background_image as backgroundImage,
		    author           as author,
		    views            as views,
		    tags             as tags
		  from article
		  ${sort ? `where sort = '${sort}'` : ''};
		`;
            const data = await this.mysql.query(sql);
            const response = data.map(item => {
                const { tags } = item;
                const tagsList = tags.split(',');
                return { ...item, tags: tagsList };
            });
            ctx.body = {
                status: 'OK',
                payload: response
            };
        };
        this.getArticleContent = async (ctx) => {
            const { articleId } = ctx.query;
            const sql = `
		  select background_image as backgroundImage, content from article where id = ${articleId};
		`;
            if (articleId) {
                const data = await this.mysql.query(sql);
                const payload = data[0];
                ctx.body = {
                    status: 'OK',
                    payload
                };
            }
            else {
                ctx.body = {
                    status: 'FAIL',
                    payload: '缺少参数'
                };
            }
        };
    }
}