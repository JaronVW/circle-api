/* eslint-disable prettier/prettier */
export const jwtConstants = {
  secret:
    process.env.SECRET_KEY || 'secretKey',
};
//WARNING
//Do not expose this key publicly. We have done so here to make it
//clear what the code is doing, but in a production system you must
//protect this key using appropriate measures such as a secrets vault,
//environment variable, or configuration service.
