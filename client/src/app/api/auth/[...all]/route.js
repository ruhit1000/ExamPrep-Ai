import { toNextRouteHandler } from 'better-auth/next';
import { auth } from '../../../../lib/auth-server';

export const { GET, POST } = toNextRouteHandler(auth);
