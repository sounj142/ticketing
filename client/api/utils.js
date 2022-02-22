import Router from 'next/router';

export function redirectTo(res, url) {
  if (typeof window === 'undefined') {
    res.writeHead(302, { location: url });
    res.end();
  } else {
    // On client
    Router.push(url);
  }
}

export function redirectToHomePageIfAuthorized(context, currentUser) {
  if (currentUser) {
    redirectTo(context.res, '/');
  }
}

export function redirectToHomePageIfUnAuthorized(context, currentUser) {
  if (!currentUser) {
    redirectTo(context.res, '/');
  }
}
