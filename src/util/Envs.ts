export const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'local';

export const PREFIX = `/${process.env.DOMAIN}/${process.env.SERVICE_NAME}`;
console.log('PREFIX', PREFIX);
