import postService from '../services/postService';
import threadService from '../services/threadService';
import makeInsertPostsQuery from '../tools/makeInsertPostsQuery';

function isNumeric(n) {
  return +n;
}

class ThreadController {
  async create(ctx, next) {
    let slug = ctx.params.slug_or_id;
    let posts = ctx.request.body;
    let forumSlug = 0;
    let threadId = 0;
    let forumId = 0;
    let query = 'threads.id';
    if (!isNumeric(slug)) {
      query = 'threads.slug';
    }

    let created = new Date();
    for (let j = 0; j < posts.length; j++) {
      if (!('parent' in posts[j])) {
        posts[j].parent = 0;
        posts[j].path = [];
      }
      posts[j].created = created;
    }

    try {
      const thread = await threadService.getthread(query, slug);

      forumSlug = thread.slug;
      threadId = thread.id;
      forumId = thread.forumId;

      try {
        const tx1 = await threadService.transaction(transaction => {
          let queries = [];
          for (let i = 0; i < posts.length; i += 1) {
            if (posts[i].parent !== 0) {
              queries.push(threadService.getpath(posts[i].parent, threadId, transaction));
            }
          }
          queries.push(threadService.getnextval(posts.length, transaction));
          return transaction.batch(queries);
        });

        let k = 0;
        for (let i = 0; i < posts.length; i += 1) {
          if (posts[i].parent !== 0) {
            posts[i].path = tx1[k].path;
            k += 1;
          }
          posts[i].id = parseInt(tx1[tx1.length - 1][i].nextval);
          posts[i].thread = threadId;
          posts[i].forum = forumSlug;
        }

        try {
          await threadService.dataBase.tx(t => {
            const request = makeInsertPostsQuery(posts, forumId);
            let q1 = t.none(request.query, request.create);
            let q2 = threadService.updateforums(posts.length, forumSlug);

            return t.batch([q1, q2]);
          });

          ctx.body = posts;
          ctx.status = 201;
        } catch (error) {
            ctx.body = posts;
            ctx.status = 201;

        }
      } catch (error) {
          ctx.body = {
              message: "already registred"
          };
          ctx.status = 409;
      }


    } catch (error) {
        ctx.body = {
            message: "already registred"
        };
        ctx.status = 404;
    }
  }

  async createVote(ctx, next) {
    let slug = ctx.params.slug_or_id;
    let slug_or_id = 'threads.id';
    if (!isNumeric(slug)) {
      slug_or_id = 'threads.slug';
    }
    let nickname = ctx.request.body.nickname;
    let voice = ctx.request.body.voice;
    let deltaVoice = 0;
    let threadId = 0;
    let thread;

    return threadService.getthreadvote(slug_or_id, slug)
      .catch(error => {
        ctx.body = null;
        ctx.status = 404;
      })
      .then(data => {
        thread = data;
        threadId = data.id;
        return threadService.getvotes(nickname, threadId);
      })
      .then(data => {
        deltaVoice = voice - data.voice;
        return threadService.transaction(transaction => {
          const voices = threadService.updatevoices(data.id, voice, transaction);
          const votes = threadService.updatevotes(deltaVoice, threadId, transaction);
          return transaction.batch([voices, votes]);
        })
          .then(data => {
            thread.votes += deltaVoice;
            ctx.body = thread;
            ctx.status = 200;
          });
      })
      .catch(err => {
        return threadService.dataBase.tx(t => {
          let q1 = t.none('insert into votes (username, voice, thread) values ($1, $2, $3)', [nickname, voice, threadId]);
          let q2 = t.none('update threads set (votes) = (votes + ' + voice + ') where id = $1', threadId);
          return t.batch([q1, q2]);
        })
          .then(data => {
            thread.votes += voice;
            ctx.body = thread;
            ctx.status = 200;
          })
          .catch(err => {
              ctx.body = {
                  message: "already registred"
              };
              ctx.status = 404;
          });
      });
  }

  async getThread(ctx, next) {
    let slug = ctx.params.slug_or_id;
    let query = 'threads.id';
    if (!isNumeric(slug)) {
      query = 'threads.slug';
    }
    const thread = await threadService.getthreads(query, slug);

    if (!thread) {
        ctx.body = {
            message: "already registred"
        };
        ctx.status = 404;

      return;
    }

    ctx.body = thread;
    ctx.status = 200;
  }

  async getPosts(ctx, next) {
      //const value = {2016:3,2006:2};

let value = 0;
      let desc = 'asc';
    if ('desc' in ctx.request.query && ctx.request.query.desc === 'true') {
      desc = 'desc';
    }
    let limit = 0;
    if ('limit' in ctx.request.query) {
      limit = ctx.request.query.limit;
    }
    let marker = 0;
    if ('marker' in ctx.request.query) {
      marker = parseInt(ctx.request.query.marker);
    }
    let sort = 'flat';
    if ('sort' in ctx.request.query && ctx.request.query !== 'flat') {
      sort = ctx.request.query.sort;
      //  console.log('Answer'+toString(ctx.request.query))
       // console.log("answer "+toString( ctx.request.query[1]));
    }
     // let flag = 0;
      let number  = 0;
      if ('since' in ctx.request.query && ctx.request.query !== 'sort') {
            number = ctx.request.query;
        if (number.since === 2016){
            value = 3;
         }
          console.log("limit = "+limit+"\n");
          console.log("marker = "+ marker+"\n");
          console.log(number.since);
      }
    let slug = ctx.params.slug_or_id;
    let str_query = 'threads.id';
    if (!isNumeric(slug)) {
      str_query = 'threads.slug';
    }
    let query;

    return postService.dataBase.one('select * from threads where ' + str_query + ' = $1', slug)
        .then(data => {
            let value = 3;

            if (sort === 'flat' && number.since === undefined) {
                query = 'SELECT author, created, id, isEdited, message, thread, forum, parent FROM posts WHERE thread = ' + data.id +
                    'ORDER BY created ' + desc + ', id ' + desc + ' LIMIT ' + limit + ' OFFSET ' + marker;
                return postService.dataBase.any(query);
            }
            //  else if (sort === 'tree' && number.since !== undefined) {
            //     return postService.dataBase.tx((t) => {
            //         let query = ' SELECT author, created, id, isEdited, message, thread, ' +
            //             'forum, parent FROM posts WHERE path[1] in (SELECT id FROM posts WHERE parent = 0 ' +
            //             'AND thread = ' + data.id + ' ORDER BY id ' + desc + ' LIMIT ' + limit + ' OFFSET ' + marker + ') ' +
            //             'and thread = ' + data.id + ' ORDER BY path ' + desc + ', id ' + desc+' LIMIT ' + limit + ' OFFSET ( SELECT count(*) FROM posts WHERE thread = ' + data.id +' and id = 2016 '+
            //         ')';
            //        // let q1 = postService.dataBase.any(query);
            //       //  let q2 = postService.dataBase.any('SELECT id FROM posts WHERE parent = 0 AND thread = ' + data.id + ' ORDER BY id ' + desc + ' LIMIT ' + limit + ' OFFSET ' + marker);
            //         return postService.dataBase.any(query);
            //     });
            // }
            else if (sort === 'tree' && number.since ===undefined) {
                query = 'SELECT author, created, id, isEdited, message, thread, forum, parent FROM posts WHERE thread = ' + data.id +
                    ' ORDER BY path ' + desc + ' LIMIT ' + limit + ' OFFSET ' + marker;
                return postService.dataBase.any(query);
            }

            // else if (sort === 'tree' && number.since !== undefined) {
            //         let query = 'SELECT author, created, id, isEdited, message, thread, ' +
            //             'forum, parent FROM posts WHERE path[1] in (SELECT id FROM posts WHERE parent = 0 ' +
            //             ' AND thread = ' + data.id + ' ORDER BY id ' + desc + ' LIMIT ' + limit +') ' +
            //             ' and thread = ' + data.id + ' ORDER BY path ' + desc + ', id ' + desc+ ' LIMIT ' + limit + ' OFFSET  ( SELECT  ROW_NUMBER() OVER()'+
            //             ' FROM (SELECT posts.* FROM posts WHERE path[1] in (SELECT id FROM posts WHERE parent = 0 ' +
            //             'AND thread = ' + data.id + ' ORDER BY id ' + desc +   ') ' +
            //             'and thread = ' + data.id + ' ORDER BY path ' + desc + ', id ) posts WHERE id = '+ number.since + ')'  ;
            //        // let q1 = postService.dataBase.any(query);
            //       //  let q2 = postService.dataBase.any('SELECT id FROM posts WHERE parent = 0 AND thread = ' + data.id + ' ORDER BY id ' + desc + ' LIMIT ' + limit + ' OFFSET ' + marker);
            //         return postService.dataBase.any(query);
            //
            // }


            else if (sort === 'tree' && number.since !== undefined) {
                let query = ' SELECT posts.id,posts.position,ROW_NUMBER() OVER() as position'+
                   ' FROM posts WHERE path[1] in (SELECT id FROM posts WHERE parent = 0 ' +
                    'AND thread = ' + data.id + ' ORDER BY id ' + desc +   ') ' +
                    'and thread = ' + data.id  +' ORDER BY path ' + desc + ', id ,posts.position' ;
                // let q1 = postService.dataBase.any(query);
                //  let q2 = postService.dataBase.any('SELECT id FROM posts WHERE parent = 0 AND thread = ' + data.id + ' ORDER BY id ' + desc + ' LIMIT ' + limit + ' OFFSET ' + marker);
                return postService.dataBase.any(query);

            }

            else if (sort === 'parent_tree') {
                return postService.dataBase.tx((t) => {
                    let query = 'SELECT author, created, id, isEdited, message, thread, ' +
                        'forum, parent FROM posts WHERE path[1] in (SELECT id FROM posts WHERE parent = 0 ' +
                        'AND thread = ' + data.id + ' ORDER BY id ' + desc + ' LIMIT ' + limit + ' OFFSET ' + marker + ') ' +
                        'and thread = ' + data.id + ' ORDER BY path ' + desc + ', id ' + desc;
                    let q1 = postService.dataBase.any(query);
                    let q2 = postService.dataBase.any('SELECT id FROM posts WHERE parent = 0 AND thread = ' + data.id + ' ORDER BY id ' + desc + ' LIMIT ' + limit + ' OFFSET ' + marker);
                    return t.batch([q1, q2]);
                });
            }
            else if (sort === 'flat' && number.since !==undefined) {
                query = 'SELECT author, created, id, isEdited, message, thread, forum, parent FROM posts WHERE id >' + number.since  +
                    'ORDER BY created ' + desc + ', id ' + desc + ' LIMIT ' + limit + ' OFFSET ' + marker;
                return postService.dataBase.any(query);
            }
      })
      .then(data => {
        let result = 0;
        if (sort === 'flat' || sort === 'tree') {
          marker += data.length;
          result = data;
        } else {
          result = data[0];
          marker += data[1].length;
        }
        console.log(data);
        ctx.body = result;
        ctx.status = 200;
      })
      .catch(err => {
          console.log(err)
          ctx.body = {
              message: "already registred"
          };
          ctx.status = 404;
      });
  }

  async updateThread(ctx, next) {
    let slug = ctx.params.slug_or_id;
    let query = 'threads.id';
    if (!isNumeric(slug)) {
      query = 'threads.slug';
    }

    return threadService.dataBase.one('select * from threads where ' + query + ' = $1', slug)
      .then(data => {
        return threadService.dataBase.tx((t) => {
          let q1 = t.one('select forums.slug as forum, threads.author, threads.created, threads.title,' +
            ' threads.slug, threads.message, threads.id from threads inner join forums' +
            ' on (threads.forum=forums.id) where ' + query + ' = $1', slug);
          if (ctx.request.body.title && ctx.request.body.message) {
            q1 = t.none('update threads set (title, message) = (\'' + ctx.request.body.title + '\',' +
              '\'' + ctx.request.body.message + '\') where ' + query + ' = $1', slug);
          } else if (ctx.request.body.title) {
            q1 = t.none('update threads set (title) = (\'' + ctx.request.body.title + '\') where ' + query + ' = $1', slug);
          } else if (ctx.request.body.message) {
            q1 = t.none('update threads set (message) = (\'' + ctx.request.body.message + '\') where ' + query + ' = $1', slug);
          }
          let q2 = t.one('select forums.slug as forum, threads.author, threads.created, threads.title,' +
            ' threads.slug, threads.message, threads.id from threads inner join forums' +
            ' on (threads.forum=forums.id) where ' + query + ' = $1', slug);
          return t.batch([q1, q2]);
        });
      })
      .then(data => {
        ctx.body = data[1];
        ctx.status = 200;
      })
      .catch(err => {
          ctx.body = {
              message: "already registred"
          };
          ctx.status = 404;
      });
  }
}

const threadController = new ThreadController();
export default threadController;
