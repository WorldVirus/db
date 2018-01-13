import userService from '../services/userService';

class UserController {
  async create(ctx, next) {
    const body = ctx.request.body;
    const nickname = ctx.params.nickname;

    const user = await userService.getUser(nickname, body.email);

    if (user.length !== 0) {
      ctx.body = user;
      ctx.status = 409;

      return;
    }

    ctx.body = await userService.create(nickname, body);
    ctx.status = 201;
  }

  async get(ctx, next) {
    const user = await userService.getUserByNickname(ctx.params.nickname);

    //ctx.body = user;
    ctx.status = user ? 200 : 404;
    if (ctx.status === 404) {
        ctx.body = {
            message: "Not found"
        };

    }
    else if (ctx.status === 200){
      ctx.body = user;
    }
  }

  async update(ctx, next) {
    const body = ctx.request.body;
    body.nickname = ctx.params.nickname;

    await userService.task(async (task) => {
      const errors = await userService.checkErrors(body.nickname, body.email, task);

      if (errors.notfound) {
          ctx.body = {
              message: "Not found"
          };
          ctx.status = 404;

        return;
      } else if (errors.conflict) {
          ctx.body = {
              message: "already registred"
          };
          ctx.status = 409;

        return;
      }

      ctx.body = await userService.update(body, task);
      ctx.status = 200;
    });
  }
}

const userController = new UserController();
export default userController;
